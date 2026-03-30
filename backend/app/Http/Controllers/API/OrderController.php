<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class OrderController extends Controller
{
    // Obtener los pedidos del usuario autenticado
    public function index()
    {
        $userId = Auth::id();
        
        // Actualización automática: si ha pasado la hora de recogida, marcarlo como entregado
        \App\Models\Order::where('user_id', $userId)
            ->whereIn('status', ['received', 'preparing', 'ready'])
            ->where('pickup_time', '<', now())
            ->update(['status' => 'delivered']);

        $orders = \App\Models\Order::where('user_id', $userId)
            ->with(['items.dish', 'items.wine'])
            ->latest()
            ->get();
            
        return response()->json($orders);
    }

    // Crear un nuevo pedido
    public function store(Request $request)
    {
        // Verificar autenticación explícitamente por seguridad
        if (!Auth::check()) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        // Validar datos del pedido y sus artículos
        $request->validate([
            'total' => 'required|numeric',
            'payment_method' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.db_id' => 'required|integer',
            'items.*.item_type' => 'required|string|in:dish,wine',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            // Calcular hora de recogida (+45 minutos)
            $pickupTime = now()->addMinutes(45);

            // Crear el pedido principal
            $order = \App\Models\Order::create([
                'user_id' => Auth::id(),
                'total' => $request->total,
                'status' => 'received',
                'type' => 'gourmet_pickup',
                'payment_method' => $request->payment_method,
                'pickup_time' => $pickupTime
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

            return response()->json([
                'message' => 'Pedido creado correctamente', 
                'order' => $order->load('items')
            ], 201);
        });
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
