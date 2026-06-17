<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsStaff
{
    public function handle(Request $request, Closure $next): Response
    {
        $rol = $request->user()?->rol;

        if (! in_array($rol, ['Administrador', 'Staff'], true)) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return $next($request);
    }
}
