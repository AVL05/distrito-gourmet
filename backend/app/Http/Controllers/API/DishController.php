<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DishController extends Controller
{
    // Obtener toda la carta: platos, vinos, bebidas y menús degustación
    public function index()
    {
        $dishes = \App\Models\Dish::with('category')->get();
        $categories = \App\Models\MenuCategory::orderBy('order')->get();
        $wines = \App\Models\Wine::all();
        $beverages = \App\Models\Beverage::all();
        $tastingMenus = \App\Models\TastingMenu::with('dishes')->get();

        return response()->json([
            'categories' => $categories,
            'dishes' => $dishes,
            'wines' => $wines,
            'beverages' => $beverages,
            'tasting_menus' => $tastingMenus,
        ]);
    }

    // Crear un nuevo plato (solo admin)
    public function store(Request $request)
    {
        // Validar datos del plato
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'menu_category_id' => 'required|integer|exists:menu_categories,id',
            'image' => 'nullable|string',
            'allergens' => 'nullable|string',
            'is_signature' => 'boolean',
            'available' => 'boolean',
        ]);

        $dish = \App\Models\Dish::create($request->all());
        return response()->json(['message' => 'Plato creado correctamente', 'dish' => $dish->load('category')], 201);
    }

    // Obtener un plato por ID
    public function show($id)
    {
        return response()->json(\App\Models\Dish::with('category')->findOrFail($id));
    }

    // Actualizar un plato existente (solo admin)
    public function update(Request $request, $id)
    {
        // Validar datos actualizados
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'menu_category_id' => 'required|integer|exists:menu_categories,id',
            'image' => 'nullable|string',
            'allergens' => 'nullable|string',
            'is_signature' => 'boolean',
            'available' => 'boolean',
        ]);

        $dish = \App\Models\Dish::findOrFail($id);
        $dish->update($request->all());

        return response()->json(['message' => 'Plato actualizado correctamente', 'dish' => $dish->load('category')]);
    }

    // Eliminar un plato (solo admin)
    public function destroy($id)
    {
        \App\Models\Dish::destroy($id);
        return response()->json(['message' => 'Plato eliminado correctamente']);
    }
}
