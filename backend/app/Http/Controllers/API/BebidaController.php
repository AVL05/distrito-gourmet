<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Bebida;
use Illuminate\Http\Request;

class BebidaController extends Controller
{
    public function index()
    {
        return response()->json(Bebida::all());
    }

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

    public function destroy($id)
    {
        Bebida::findOrFail($id)->delete();
        return response()->json(['mensaje' => 'Bebida eliminada']);
    }
}
