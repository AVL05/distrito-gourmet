<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class SecurityAudit
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        $context = [
            'actor_id' => $request->user()?->id,
            'route' => $request->route()?->uri(),
            'method' => $request->method(),
            'status' => $response->getStatusCode(),
            'ip' => $request->ip(),
        ];

        if (in_array($response->getStatusCode(), [401, 403, 429], true)
            || ($request->is('api/login') && $response->getStatusCode() === 422)) {
            Log::warning('security.request_denied', $context);
        } elseif ($request->is('api/admin/*') && ! $request->isMethodSafe() && $response->isSuccessful()) {
            Log::info('security.admin_write', $context);
        }
    }
}
