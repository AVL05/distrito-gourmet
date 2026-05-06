<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Vino;
use Illuminate\Http\Request;

class VinoController extends Controller
{
    public function index()
    {
        return response()->json(Vino::all());
    }

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

    public function update(Request $request, $id)
    {
        $vino = Vino::findOrFail($id);
        $vino->update($request->all());
        return response()->json($vino);
    }

    public function destroy($id)
    {
        Vino::findOrFail($id)->delete();
        return response()->json(['mensaje' => 'Vino eliminado']);
    }
}
