<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test public dishes endpoint.
     */
    public function test_can_view_dishes_unauthenticated(): void
    {
        $response = $this->getJson('/api/dishes');

        $response->assertStatus(200);
    }

    /**
     * Test protected endpoint returns 401.
     */
    public function test_protected_reservations_requires_auth(): void
    {
        $response = $this->getJson('/api/reservations');

        $response->assertStatus(401);
    }
}
