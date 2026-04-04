<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Beverage;

class BeverageController extends Controller
{
    public function index()
    {
        return response()->json(Beverage::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|string',
            'price' => 'required|numeric',
            'available' => 'boolean',
        ]);

        $beverage = Beverage::create($validated);
        return response()->json(['message' => 'Bebida añadida correctamente', 'beverage' => $beverage], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|string',
            'price' => 'required|numeric',
            'available' => 'boolean',
        ]);

        $beverage = Beverage::findOrFail($id);
        $beverage->update($validated);
        return response()->json(['message' => 'Bebida actualizada correctamente', 'beverage' => $beverage]);
    }

    public function destroy($id)
    {
        Beverage::destroy($id);
        return response()->json(['message' => 'Bebida eliminada correctamente']);
    }
}
