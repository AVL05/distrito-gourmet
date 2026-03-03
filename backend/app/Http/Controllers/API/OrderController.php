<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Obtener los pedidos del usuario autenticado
    public function index()
    {
        $orders = \App\Models\Order::where('user_id', auth()->id())->with('items.dish')->get();
        return response()->json($orders);
    }

    // Crear un nuevo pedido
    public function store(Request $request)
    {
        // Validar datos del pedido y sus artículos
        $request->validate([
            'total' => 'required|numeric',
            'items' => 'required|array',
            'items.*.db_id' => 'required|integer',
            'items.*.item_type' => 'required|string|in:dish,wine',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        // Crear el pedido principal
        $order = \App\Models\Order::create([
            'user_id' => auth()->id(),
            'total' => $request->total,
            'status' => 'received'
        ]);

        // Crear cada artículo del pedido
        foreach ($request->items as $item) {
            \App\Models\OrderItem::create([
                'order_id' => $order->id,
                'dish_id' => $item['item_type'] === 'dish' ? $item['db_id'] : null,
                'wine_id' => $item['item_type'] === 'wine' ? $item['db_id'] : null,
                'item_name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
        }

        return response()->json(['message' => 'Pedido creado correctamente', 'order' => $order->load('items')], 201);
    }

    // Obtener todos los pedidos (solo admin)
    public function all()
    {
        $orders = \App\Models\Order::with('user', 'items')->latest()->get();
        return response()->json($orders);
    }

    // Actualizar el estado de un pedido (solo admin)
    public function updateStatus(Request $request, $id)
    {
        $order = \App\Models\Order::findOrFail($id);
        $order->status = $request->input('status');
        $order->save();
        return response()->json(['message' => 'Estado del pedido actualizado']);
    }
}
