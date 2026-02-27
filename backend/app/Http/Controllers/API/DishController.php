<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DishController extends Controller
{
    public function index()
    {
        $dishes = \App\Models\Dish::with('category')->get();
        $categories = \App\Models\MenuCategory::orderBy('order')->get();
        $wines = \App\Models\Wine::all();

        return response()->json([
            'categories' => $categories,
            'dishes' => $dishes,
            'wines' => $wines
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'menu_category_id' => 'required|integer|exists:menu_categories,id',
        ]);

        $data = $request->all();

        $dish = \App\Models\Dish::create($data);
        return response()->json(['message' => 'Dish created successfully', 'dish' => $dish], 201);
    }

    public function show($id)
    {
        return response()->json(\App\Models\Dish::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'menu_category_id' => 'required|integer|exists:menu_categories,id',
        ]);

        $dish = \App\Models\Dish::findOrFail($id);
        $data = $request->all();

        $dish->update($data);
        return response()->json(['message' => 'Dish updated successfully', 'dish' => $dish]);
    }

    public function destroy($id)
    {
        \App\Models\Dish::destroy($id);
        return response()->json(['message' => 'Dish deleted']);
    }
}
