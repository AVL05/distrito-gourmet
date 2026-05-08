<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bebida;
use Illuminate\Http\Request;

// Gestión de bebidas: administración de la oferta de refrescos, cócteles y cafés
class BebidaController extends Controller
{
    // Listar todas las bebidas disponibles
    public function index()
    {
        return response()->json(Bebida::all());
    }

    // Registrar una nueva bebida en el sistema
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|in:agua,refresco,cocktail,cafe',
            'precio' => 'required|numeric',
            'disponible' => 'boolean',
            'destacado' => 'boolean',
        ]);

        $bebida = Bebida::create($request->all());
        return response()->json($bebida, 201);
    }

    // Actualizar los datos de una bebida existente
    public function update(Request $request, $id)
    {
        $bebida = Bebida::findOrFail($id);
        $request->validate([
            'nombre' => 'required|string',
            'tipo' => 'required|in:agua,refresco,cocktail,cafe',
            'precio' => 'required|numeric',
        ]);

        $bebida->update($request->all());
        return response()->json($bebida);
    }

    // Eliminar una bebida del sistema
    public function destroy($id)
    {
        Bebida::findOrFail($id)->delete();
        return response()->json(['mensaje' => 'Bebida eliminada']);
    }
}
