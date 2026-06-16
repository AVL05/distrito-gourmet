<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:180',
            'subject' => 'required|string|max:80',
            'message' => 'required|string|max:500',
        ]);

        return response()->json([
            'mensaje' => 'Consulta recibida correctamente',
            'contact' => [
                'reference' => 'DG-C-' . now()->format('Ymd') . '-' . strtoupper(substr(md5($validated['email'] . microtime()), 0, 6)),
                'subject' => $validated['subject'],
            ],
        ], 201);
    }
}
