<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role = 'Cliente'): Usuario
    {
        return Usuario::create([
            'nombre' => 'Cliente', 'email' => 'security@test.local',
            'password' => Hash::make('password123'), 'rol' => $role,
        ]);
    }

    public function test_rotating_emails_does_not_bypass_ip_limit(): void
    {
        for ($i = 0; $i < 30; $i++) {
            $this->postJson('/api/login', ['email' => "user{$i}@test.local", 'password' => 'wrong'])->assertUnprocessable();
        }

        $this->postJson('/api/login', ['email' => 'another@test.local', 'password' => 'wrong'])
            ->assertTooManyRequests()->assertHeader('Retry-After');
    }

    public function test_login_rejects_non_string_email_without_server_error(): void
    {
        $this->postJson('/api/login', ['email' => ['invalid'], 'password' => 'password123'])
            ->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_contact_is_limited_by_ip_independently_of_email(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/contact', ['name' => 'Cliente', 'email' => "user{$i}@test.local", 'subject' => 'Consulta', 'message' => 'Hola'])->assertCreated();
        }

        $this->postJson('/api/contact', ['email' => 'another@test.local'])->assertTooManyRequests();
    }

    public function test_reset_password_has_a_request_limit(): void
    {
        $payload = ['email' => 'unknown@test.local', 'token' => 'invalid', 'password' => 'newpassword123', 'password_confirmation' => 'newpassword123'];
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/reset-password', $payload)->assertUnprocessable();
        }

        $this->postJson('/api/reset-password', $payload)->assertTooManyRequests();
    }

    public function test_order_creation_is_limited_per_user(): void
    {
        Sanctum::actingAs($this->user());
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/orders', [])->assertUnprocessable();
        }

        $this->postJson('/api/orders', [])->assertTooManyRequests();
    }

    public function test_email_and_password_changes_require_current_password(): void
    {
        $user = $this->user();
        Sanctum::actingAs($user);
        $this->putJson('/api/profile', ['email' => 'changed@test.local'])
            ->assertUnprocessable()->assertJsonValidationErrors('current_password');
        $this->putJson('/api/profile', ['password' => 'newpassword123', 'current_password' => 'wrong'])
            ->assertUnprocessable()->assertJsonValidationErrors('current_password');
        $this->assertSame('security@test.local', $user->fresh()->email);
        $this->assertTrue(Hash::check('password123', $user->fresh()->password));
        $this->putJson('/api/profile', ['email' => 'changed@test.local', 'password' => 'newpassword123', 'current_password' => 'password123'])
            ->assertOk()->assertJsonMissingPath('user.password');
        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }

    public function test_contact_details_do_not_require_password_or_change_roles(): void
    {
        $user = $this->user('Administrador');
        Sanctum::actingAs($user);
        $this->putJson('/api/profile', ['nombre' => 'Otro nombre', 'email' => $user->email, 'telefono' => '123', 'rol' => 'Staff'])
            ->assertOk()->assertJsonPath('user.rol', 'Administrador');
    }

    public function test_sensitive_admin_updates_are_logged_without_personal_data(): void
    {
        $admin = $this->user('Administrador');
        $client = Usuario::create(['nombre' => 'Otro', 'email' => 'other@test.local', 'password' => Hash::make('password123'), 'rol' => 'Cliente']);
        Sanctum::actingAs($admin);
        Log::spy();

        $this->putJson("/api/admin/users/{$client->id}", ['rol' => 'Staff', 'password' => 'newpassword123'])->assertOk();

        Log::shouldHaveReceived('info')->with('security.admin_write', \Mockery::on(fn ($context) => $context['actor_id'] === $admin->id
            && $context['route'] === 'api/admin/users/{id}'
            && $context['status'] === 200
            && ! str_contains(json_encode($context), 'password')
            && ! str_contains(json_encode($context), '@')
        ))->once();
    }

    public function test_untrusted_forwarded_ip_does_not_change_client_ip(): void
    {
        $this->app['router']->get('/test-client-ip', fn (Request $request) => $request->ip());
        $this->withHeaders(['X-Forwarded-For' => '203.0.113.2'])->get('/test-client-ip')->assertSee('127.0.0.1');
    }

    public function test_configured_proxy_supplies_client_ip(): void
    {
        config(['trustedproxy.proxies' => '127.0.0.1']);
        $this->app['router']->get('/test-client-ip', fn (Request $request) => $request->ip());
        $this->withHeaders(['X-Forwarded-For' => '203.0.113.2'])->get('/test-client-ip')->assertSee('203.0.113.2');
    }

    public function test_account_limit_applies_across_different_ips(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.'.($i + 1)])
                ->postJson('/api/login', ['email' => 'same@test.local', 'password' => 'wrong'])->assertUnprocessable();
        }

        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.99'])
            ->postJson('/api/login', ['email' => 'SAME@test.local', 'password' => 'wrong'])->assertTooManyRequests();
    }

    public function test_reservation_writes_are_limited_but_reads_remain_available(): void
    {
        Sanctum::actingAs($this->user());
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/reservations', [])->assertUnprocessable();
        }

        $this->postJson('/api/reservations', [])->assertTooManyRequests();
        $this->getJson('/api/reservations')->assertOk();
    }

    public function test_public_api_has_a_general_request_limit(): void
    {
        for ($i = 0; $i < 120; $i++) {
            $this->getJson('/api/service-calendar')->assertOk();
        }

        $this->getJson('/api/service-calendar')->assertTooManyRequests();
    }

    public function test_admin_user_endpoint_cannot_bypass_profile_rate_limit(): void
    {
        $admin = $this->user('Administrador');
        Sanctum::actingAs($admin);
        for ($i = 0; $i < 10; $i++) {
            $this->putJson("/api/admin/users/{$admin->id}", ['email' => 'changed@test.local'])->assertUnprocessable();
        }

        $this->putJson("/api/admin/users/{$admin->id}", ['email' => 'changed@test.local'])->assertTooManyRequests();
    }
}
