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
        ]);

        $data = $request->all();
        $dish = \App\Models\Dish::create($data);

        return response()->json(['message' => 'Plato creado correctamente', 'dish' => $dish], 201);
    }

    // Obtener un plato por ID
    public function show($id)
    {
        return response()->json(\App\Models\Dish::findOrFail($id));
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
        ]);

        $dish = \App\Models\Dish::findOrFail($id);
        $data = $request->all();
        $dish->update($data);

        return response()->json(['message' => 'Plato actualizado correctamente', 'dish' => $dish]);
    }

    // Eliminar un plato (solo admin)
    public function destroy($id)
    {
        \App\Models\Dish::destroy($id);
        return response()->json(['message' => 'Plato eliminado correctamente']);
    }
}
