<?php

namespace Tests\Feature;

use App\Models\Pedido;
use App\Models\Reserva;
use App\Models\Usuario;
use App\Notifications\RestaurantUpdate;
use Database\Seeders\DistritoGourmetSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Notifications\ChannelManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RestaurantOperationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalogue_and_login_accounts_can_be_seeded_without_id_collisions(): void
    {
        $this->seed(DistritoGourmetSeeder::class);
        $this->assertDatabaseHas('usuarios', ['email' => 'admin@distritogourmet.com', 'rol' => 'Administrador']);
        $this->assertDatabaseHas('platos', ['slug' => 'croqueta-jamon-iberico']);
        $this->assertDatabaseCount('usuarios', 3);
        foreach (Usuario::all() as $user) {
            $this->assertTrue(Hash::check('password', $user->password));
        }
        $this->assertGreaterThan(3, $this->user('after-seed@test.local')->id);
    }

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
        $this->travelTo(new \DateTimeImmutable('2026-10-13 10:00:00 Europe/Madrid'));
    }

    private function user(string $email = 'customer@test.local', string $role = 'Cliente'): Usuario
    {
        return Usuario::create(['nombre' => 'Cliente', 'email' => $email, 'password' => bcrypt('password123'), 'rol' => $role]);
    }

    private function reservation(Usuario $user, array $overrides = []): Reserva
    {
        return Reserva::create(array_merge([
            'usuario_id' => $user->id, 'codigo_reserva' => uniqid(),
            'fecha_reserva' => '2026-10-14', 'hora_reserva' => '21:00:00',
            'comensales' => 4, 'estado' => 'Confirmada',
        ], $overrides));
    }

    public function test_calendar_excludes_closures_past_turns_and_sunday_dinner(): void
    {
        $this->getJson('/api/reservation-availability?date=2026-10-19')->assertOk()->assertJsonCount(0, 'turns');
        $this->getJson('/api/reservation-availability?date=2026-10-18')->assertOk()->assertJsonCount(3, 'turns');
        config(['restaurant.closed_dates' => ['2026-10-14']]);
        $this->getJson('/api/reservation-availability?date=2026-10-14')->assertOk()->assertJsonCount(0, 'turns');
        $this->travelTo(new \DateTimeImmutable('2026-10-13 21:10:00 Europe/Madrid'));
        $this->getJson('/api/reservation-availability?date=2026-10-13')->assertOk()->assertJsonCount(1, 'turns')->assertJsonPath('turns.0.time', '21:30');
    }

    public function test_confirmation_rechecks_capacity_and_pending_does_not_consume_seats(): void
    {
        $this->reservation($this->user(), ['comensales' => 40]);
        $pending = $this->reservation($this->user('pending@test.local'), ['comensales' => 8, 'estado' => 'Pendiente']);
        $this->getJson('/api/reservation-availability?date=2026-10-14')->assertJsonPath('turns.4.available_seats', 4);
        Sanctum::actingAs($this->user('admin@test.local', 'Administrador'));
        $this->patchJson("/api/admin/reservations/{$pending->id}", ['estado' => 'Confirmada'])->assertUnprocessable();
        $this->assertSame('Pendiente', $pending->fresh()->estado);
    }

    public function test_customer_can_cancel_only_own_future_reservation(): void
    {
        $owner = $this->user();
        $own = $this->reservation($owner);
        $other = $this->reservation($this->user('other@test.local'));
        Sanctum::actingAs($owner);
        $this->patchJson("/api/reservations/{$other->id}/cancel")->assertNotFound();
        $this->patchJson("/api/reservations/{$own->id}/cancel")->assertOk();
        $this->assertSame('Cancelada', $own->fresh()->estado);
        $past = $this->reservation($owner, ['fecha_reserva' => '2026-10-12']);
        $this->patchJson("/api/reservations/{$past->id}/cancel")->assertUnprocessable();
        $this->getJson('/api/reservations')->assertJsonCount(2, 'data');
    }

    public function test_order_status_cannot_reopen_terminal_order(): void
    {
        $user = $this->user('admin@test.local', 'Administrador');
        $order = Pedido::create(['usuario_id' => $user->id, 'numero_pedido' => 'DG-TEST', 'estado' => 'Entregado', 'tipo_pedido' => 'Takeaway', 'subtotal' => 10, 'impuestos' => 1, 'total' => 11, 'metodo_pago' => 'cash']);
        Sanctum::actingAs($user);
        $this->patchJson("/api/admin/orders/{$order->id}", ['estado' => 'Preparando'])->assertUnprocessable();
    }

    public function test_pickup_calendar_and_payment_are_validated_server_side(): void
    {
        $this->getJson('/api/pickup-times')->assertOk()->assertJsonPath('days.0.date', '2026-10-13');
        $this->getJson('/api/service-calendar')->assertOk()->assertJsonPath('timezone', 'Europe/Madrid');
        Sanctum::actingAs($this->user());
        $this->postJson('/api/orders', ['metodo_pago' => 'card', 'fecha_recogida' => '2026-10-13', 'hora_recogida' => '13:30', 'articulos' => []])->assertUnprocessable()->assertJsonValidationErrors('metodo_pago');
        $this->travelTo(new \DateTimeImmutable('2026-10-18 10:00:00 Europe/Madrid'));
        $this->postJson('/api/orders', ['metodo_pago' => 'cash', 'fecha_recogida' => '2026-10-18', 'hora_recogida' => '21:00', 'articulos' => []])->assertUnprocessable()->assertJsonValidationErrors('hora_recogida');
    }

    public function test_closed_and_past_reservations_are_rejected(): void
    {
        Sanctum::actingAs($this->user());
        $this->postJson('/api/reservations', ['fecha_reserva' => '2026-10-19', 'hora_reserva' => '21:00', 'comensales' => 2])->assertUnprocessable();
        $this->travelTo(new \DateTimeImmutable('2026-10-13 21:10:00 Europe/Madrid'));
        $this->postJson('/api/reservations', ['fecha_reserva' => '2026-10-13', 'hora_reserva' => '21:00', 'comensales' => 2])->assertUnprocessable();
    }

    public function test_confirmed_seats_are_shared_across_arrival_times_and_notifications_are_sent(): void
    {
        $this->reservation($this->user(), ['comensales' => 40, 'hora_reserva' => '20:30:00']);
        $user = $this->user('new@test.local');
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/reservations', ['fecha_reserva' => '2026-10-14', 'hora_reserva' => '21:00', 'comensales' => 8])
            ->assertCreated()->assertJsonPath('reserva.estado', 'Pendiente');
        Notification::assertSentTo($user, RestaurantUpdate::class,
            fn ($notification) => $notification->reference === $response->json('reserva.codigo_reserva'));
        $this->patchJson('/api/reservations/'.$response->json('reserva.id').'/cancel')->assertOk();
        Notification::assertSentToTimes($user, RestaurantUpdate::class, 2);
    }

    public function test_invalid_calendar_date_is_a_validation_error(): void
    {
        $this->getJson('/api/reservation-availability?date=2026-99-99')->assertUnprocessable();
        Sanctum::actingAs($this->user());
        $this->postJson('/api/reservations', ['fecha_reserva' => '2026-99-99', 'hora_reserva' => '21:00', 'comensales' => 2])->assertUnprocessable();
    }

    public function test_notifications_can_be_persisted_in_the_database_queue(): void
    {
        config(['queue.default' => 'database']);
        Notification::swap(new ChannelManager($this->app));
        RestaurantUpdate::send($this->user(), 'Reserva confirmada', 'QA-QUEUE', '2026-10-14 21:00');
        $this->assertDatabaseCount('jobs', 1);
    }

    public function test_https_is_detected_behind_the_hosting_proxy(): void
    {
        config(['trustedproxy.proxies' => '127.0.0.1']);
        Route::get('/proxy-check', fn () => ['secure' => request()->isSecure()]);
        $this->getJson('/proxy-check', ['X-Forwarded-Proto' => 'https'])->assertOk()->assertJsonPath('secure', true);
    }

    public function test_initialization_seeds_empty_database_and_preserves_changes_on_restart(): void
    {
        $this->artisan('restaurant:initialize')->assertSuccessful();
        $this->assertDatabaseCount('usuarios', 3);
        $this->user('preserve@test.local');
        $this->artisan('restaurant:initialize')->assertSuccessful();
        $this->assertDatabaseHas('usuarios', ['email' => 'preserve@test.local']);
        $this->assertDatabaseCount('usuarios', 4);
    }

    public function test_initialization_preserves_partial_catalogue_without_creating_demo_accounts(): void
    {
        DB::table('categorias_menu')->insert(['nombre' => 'Existing category', 'orden_visualizacion' => 1]);
        $this->artisan('restaurant:initialize')->assertSuccessful();
        $this->assertDatabaseCount('usuarios', 0);
        $this->assertDatabaseHas('categorias_menu', ['nombre' => 'Existing category']);
    }
}
