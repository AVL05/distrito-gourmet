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
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB
            'menu_category_id' => 'required|integer|exists:menu_categories,id',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('dishes', 'public');
            $data['image'] = '/storage/' . $path;
        }

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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Optional but max 2MB if sent
            'menu_category_id' => 'required|integer|exists:menu_categories,id',
        ]);

        $dish = \App\Models\Dish::findOrFail($id);
        $data = $request->except('image');

        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si se quisiera (opcional pero buena práctica)
            if ($dish->image && str_starts_with($dish->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $dish->image);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('dishes', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $dish->update($data);
        return response()->json(['message' => 'Dish updated successfully', 'dish' => $dish]);
    }

    public function destroy($id)
    {
        \App\Models\Dish::destroy($id);
        return response()->json(['message' => 'Dish deleted']);
    }
}
