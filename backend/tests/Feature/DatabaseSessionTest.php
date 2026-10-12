<?php

namespace Tests\Feature;

use App\Models\Usuario;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class DatabaseSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_sessions_and_cache_support_spa_login(): void
    {
        config(['session.driver' => 'database', 'cache.default' => 'database']);
        $user = Usuario::create([
            'nombre' => 'Cliente', 'email' => 'session@test.local',
            'password' => bcrypt('password123'), 'rol' => 'Cliente',
        ]);
        $this->withHeaders(['Origin' => 'http://localhost', 'Referer' => 'http://localhost/']);
        $this->get('/sanctum/csrf-cookie')->assertNoContent();
        $this->assertDatabaseCount('sessions', 1);
        $this->postJson('/api/login', [
            'email' => $user->email, 'password' => 'password123',
        ])->assertOk();
        $this->assertDatabaseHas('sessions', ['user_id' => $user->id]);
        $this->getJson('/api/user')->assertOk();
        Cache::put('deployment-check', 'ok', 60);
        $this->assertSame('ok', Cache::get('deployment-check'));
        $lock = Cache::lock('deployment-lock', 60);
        $this->assertTrue($lock->get());
        $this->assertTrue($lock->release());
    }
}
