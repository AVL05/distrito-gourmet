<?php

namespace Tests\Feature;

use App\Models\Plato;
use App\Models\Reserva;
use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PfcClosureTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_login_logout_and_login_rate_limit(): void
    {
        $this->postJson('/api/register', [
            'nombre' => 'Cliente Test',
            'email' => 'cliente@test.local',
            'password' => 'password123',
            'telefono' => '+34 600 000 001',
        ])->assertCreated()->assertJsonStructure(['usuario', 'token']);

        $login = $this->postJson('/api/login', [
            'email' => 'cliente@test.local',
            'password' => 'password123',
        ])->assertOk()->assertJsonStructure(['usuario', 'token']);

        $token = $login->json('token');

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout')
            ->assertOk();

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', [
                'email' => 'bloqueo@test.local',
                'password' => 'wrong-password',
            ])->assertUnprocessable();
        }

        $this->postJson('/api/login', [
            'email' => 'bloqueo@test.local',
            'password' => 'wrong-password',
        ])->assertTooManyRequests();
    }

    public function test_reservation_is_confirmed_when_slot_has_capacity(): void
    {
        Sanctum::actingAs($this->user());

        $this->postJson('/api/reservations', [
            'fecha_reserva' => now()->addDay()->toDateString(),
            'hora_reserva' => '21:00',
            'comensales' => 4,
        ])->assertCreated()
            ->assertJsonPath('reserva.estado', 'Confirmada')
            ->assertJsonPath('reserva.hora_reserva', '21:00:00');
    }

    public function test_reservation_is_pending_when_slot_exceeds_capacity(): void
    {
        $existingUser = $this->user('existing@test.local');
        $newUser = $this->user('new@test.local');
        $fecha = now()->addDay()->toDateString();

        Reserva::create([
            'usuario_id' => $existingUser->id,
            'codigo_reserva' => 'CAPACITY1',
            'fecha_reserva' => $fecha,
            'hora_reserva' => '21:00:00',
            'comensales' => 40,
            'estado' => 'Confirmada',
        ]);

        Sanctum::actingAs($newUser);

        $this->postJson('/api/reservations', [
            'fecha_reserva' => $fecha,
            'hora_reserva' => '21:00',
            'comensales' => 8,
        ])->assertCreated()
            ->assertJsonPath('reserva.estado', 'Pendiente');
    }

    public function test_reservation_rejects_duplicate_date_and_invalid_values(): void
    {
        $user = $this->user();
        $fecha = now()->addDay()->toDateString();

        Reserva::create([
            'usuario_id' => $user->id,
            'codigo_reserva' => 'DUPLDATE',
            'fecha_reserva' => $fecha,
            'hora_reserva' => '13:00:00',
            'comensales' => 2,
            'estado' => 'Confirmada',
        ]);

        Sanctum::actingAs($user);

        $this->postJson('/api/reservations', [
            'fecha_reserva' => $fecha,
            'hora_reserva' => '20:00',
            'comensales' => 2,
        ])->assertUnprocessable()
            ->assertJsonPath('mensaje', 'Ya dispone de una reserva para esta fecha.');

        $this->postJson('/api/reservations', [
            'fecha_reserva' => now()->addDays(2)->toDateString(),
            'hora_reserva' => '16:00',
            'comensales' => 9,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['hora_reserva', 'comensales']);
    }

    public function test_order_rejects_invalid_payment_and_unavailable_items(): void
    {
        Sanctum::actingAs($this->user());
        $plato = $this->plato(['disponible' => false]);

        $payload = [
            'metodo_pago' => 'bitcoin',
            'hora_recogida' => '13:00',
            'fecha_recogida' => now()->toDateString(),
            'articulos' => [[
                'db_id' => $plato->id,
                'tipo_item' => 'plato',
                'nombre' => $plato->nombre,
                'cantidad' => 1,
            ]],
        ];

        $this->postJson('/api/orders', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['metodo_pago']);

        $payload['metodo_pago'] = 'card';

        $this->postJson('/api/orders', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['articulos']);
    }

    public function test_order_total_is_calculated_from_catalog(): void
    {
        Sanctum::actingAs($this->user());
        $plato = $this->plato(['precio' => 10.00]);

        $response = $this->postJson('/api/orders', [
            'metodo_pago' => 'card',
            'hora_recogida' => '13:00',
            'fecha_recogida' => now()->toDateString(),
            'total' => 999,
            'articulos' => [[
                'db_id' => $plato->id,
                'tipo_item' => 'plato',
                'nombre' => $plato->nombre,
                'cantidad' => 2,
                'precio' => 999,
            ]],
        ])->assertCreated();

        $this->assertSame(20.0, (float) $response->json('pedido.total'));
        $this->assertDatabaseHas('detalles_pedido', [
            'pedido_id' => $response->json('pedido.id'),
            'precio_unitario' => 10.00,
            'precio_total' => 20.00,
        ]);
    }

    public function test_admin_routes_require_admin_and_admin_cannot_delete_itself(): void
    {
        Sanctum::actingAs($this->user());

        $this->getJson('/api/admin/users')->assertForbidden();

        $admin = $this->user('admin@test.local', 'Administrador');
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/admin/users/{$admin->id}")
            ->assertUnprocessable()
            ->assertJsonPath('message', 'No puede eliminar su propio usuario administrador');
    }

    public function test_admin_rejects_invalid_role_and_reservation_status(): void
    {
        $admin = $this->user('admin@test.local', 'Administrador');
        $client = $this->user('client@test.local');

        Sanctum::actingAs($admin);

        $this->putJson("/api/admin/users/{$client->id}", [
            'rol' => 'superadmin',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['rol']);

        $reservation = Reserva::create([
            'usuario_id' => $client->id,
            'codigo_reserva' => 'STATUS01',
            'fecha_reserva' => now()->addDay()->toDateString(),
            'hora_reserva' => '13:00:00',
            'comensales' => 2,
            'estado' => 'Confirmada',
        ]);

        $this->patchJson("/api/admin/reservations/{$reservation->id}", [
            'estado' => 'NoValido',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['estado']);
    }

    private function user(string $email = 'user@test.local', string $rol = 'Cliente'): Usuario
    {
        return Usuario::create([
            'nombre' => 'Usuario Test',
            'email' => $email,
            'password' => Hash::make('password123'),
            'telefono' => '+34 600 000 000',
            'rol' => $rol,
        ]);
    }

    private function plato(array $overrides = []): Plato
    {
        return Plato::create(array_merge([
            'nombre' => 'Plato Test',
            'slug' => 'plato-test-'.uniqid(),
            'descripcion' => 'Plato de prueba',
            'precio' => 12.50,
            'alergenos' => null,
            'disponible' => true,
            'visible_en_carta' => true,
            'visible_en_degustacion' => true,
            'disponible_para_llevar' => true,
            'es_por_unidad' => false,
            'maximo_por_pedido' => 8,
        ], $overrides));
    }
}
