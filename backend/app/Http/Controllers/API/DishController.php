<?php
/**
 * @file DishController.php
 * @author Alex V. (DAW)
 * @date 2026-04-06
 * @description Controlador para gestionar los platos de la carta y el menú degustación del restaurante.
 */

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DishController extends Controller
{
    /**
     * @function index
     * @description Obtiene el listado completo de la carta, incluyendo categorías, platos, vinos, bebidas y menús degustación.
     */
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

    /**
     * @function store
     * @description Crea un nuevo plato validando los campos y vinculándolo a una categoría existente.
     */
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

    /**
     * @function show
     * @description Recupera la información detallada de un plato por ID.
     */
    public function show($id)
    {
        return response()->json(\App\Models\Dish::with('category')->findOrFail($id));
    }

    /**
     * @function update
     * @description Actualiza los datos de un plato existente tras validar las entradas.
     */
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

    /**
     * @function destroy
     * @description Elimina permanentemente un plato de la base de datos por su ID.
     */
    public function destroy($id)
    {
        \App\Models\Dish::destroy($id);
        return response()->json(['message' => 'Plato eliminado correctamente']);
    }
}
