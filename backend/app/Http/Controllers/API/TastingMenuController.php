<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TastingMenu;

class TastingMenuController extends Controller
{
    public function index()
    {
        return response()->json(TastingMenu::with('dishes')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'courses' => 'required|integer',
            'available' => 'boolean',
            'dishes' => 'nullable|array',
        ]);

        $menu = TastingMenu::create($request->only(['name', 'description', 'price', 'courses', 'available']));
        
        if ($request->has('dishes')) {
            $syncData = [];
            foreach ($request->dishes as $d) {
                $syncData[$d['id']] = [
                    'course_number' => $d['pivot']['course_number'] ?? 1,
                    'notes' => $d['pivot']['notes'] ?? null
                ];
            }
            $menu->dishes()->sync($syncData);
        }

        return response()->json(['message' => 'Menú degustación creado correctamente', 'menu' => $menu->load('dishes')], 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'courses' => 'required|integer',
            'available' => 'boolean',
            'dishes' => 'nullable|array',
        ]);

        $menu = TastingMenu::findOrFail($id);
        $menu->update($request->only(['name', 'description', 'price', 'courses', 'available']));

        if ($request->has('dishes')) {
            $syncData = [];
            foreach ($request->dishes as $d) {
                $syncData[$d['id']] = [
                    'course_number' => $d['pivot']['course_number'] ?? 1,
                    'notes' => $d['pivot']['notes'] ?? null
                ];
            }
            $menu->dishes()->sync($syncData);
        }

        return response()->json(['message' => 'Menú degustación actualizado correctamente', 'menu' => $menu->load('dishes')]);
    }

    public function destroy($id)
    {
        TastingMenu::destroy($id);
        return response()->json(['message' => 'Menú degustación eliminado correctamente']);
    }
}
