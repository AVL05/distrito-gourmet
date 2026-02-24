<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = \App\Models\Order::where('user_id', auth()->id())->with('items.dish')->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'total' => 'required|numeric',
            'items' => 'required|array',
            'items.*.db_id' => 'required|integer',
            'items.*.item_type' => 'required|string|in:dish,wine',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        $order = \App\Models\Order::create([
            'user_id' => auth()->id(),
            'total' => $request->total,
            'status' => 'received'
        ]);

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

        return response()->json(['message' => 'Order created successfully', 'order' => $order->load('items')], 201);
    }

    public function all()
    {
        $orders = \App\Models\Order::with('user', 'items')->latest()->get();
        return response()->json($orders);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = \App\Models\Order::findOrFail($id);
        $order->status = $request->input('status');
        $order->save();
        return response()->json(['message' => 'Order status updated']);
    }
}
