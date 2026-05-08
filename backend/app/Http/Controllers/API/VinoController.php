<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Vino;
use Illuminate\Http\Request;

// Gestión de bodega: administración del catálogo de vinos y sus variedades
class VinoController extends Controller
{
    // Listar todos los vinos registrados en la bodega
    public function index()
    {
        return response()->json(Vino::all());
    }

    // Registrar una nueva referencia de vino
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'tipo' => 'required|in:Tinto,Blanco,Rosado,Espumoso,Dulce',
            'precio_botella' => 'required|numeric',
        ]);

        $vino = Vino::create($request->all());
        return response()->json($vino, 201);
    }

    // Actualizar la información de un vino existente
    public function update(Request $request, $id)
    {
        $vino = Vino::findOrFail($id);
        $vino->update($request->all());
        return response()->json($vino);
    }

    // Eliminar una referencia de vino del sistema
    public function destroy($id)
    {
        Vino::findOrFail($id)->delete();
        return response()->json(['mensaje' => 'Vino eliminado']);
    }
}
