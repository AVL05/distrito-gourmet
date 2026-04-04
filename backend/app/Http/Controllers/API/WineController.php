<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wine;

class WineController extends Controller
{
    public function index()
    {
        return response()->json(Wine::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'winery' => 'nullable|string',
            'vintage' => 'nullable|string',
            'type' => 'required|string',
            'pairing_notes' => 'nullable|string',
            'price_bottle' => 'nullable|numeric',
            'price_glass' => 'nullable|numeric',
        ]);

        $wine = Wine::create($validated);
        return response()->json(['message' => 'Vino añadido correctamente', 'wine' => $wine], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'winery' => 'nullable|string',
            'vintage' => 'nullable|string',
            'type' => 'required|string',
            'pairing_notes' => 'nullable|string',
            'price_bottle' => 'nullable|numeric',
            'price_glass' => 'nullable|numeric',
        ]);

        $wine = Wine::findOrFail($id);
        $wine->update($validated);
        return response()->json(['message' => 'Vino actualizado correctamente', 'wine' => $wine]);
    }

    public function destroy($id)
    {
        Wine::destroy($id);
        return response()->json(['message' => 'Vino eliminado correctamente']);
    }
}
