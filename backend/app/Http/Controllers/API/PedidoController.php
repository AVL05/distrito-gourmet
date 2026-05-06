<?php
/**
 * @file OrderController.php
 * @author Alex V. (DAW)
 * @date 2026-04-06
 * @description Controlador para la gestión de pedidos de la tienda Gourmet. Maneja la creación, listado y actualización de estados del pedido.
 */

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Pedido;
use App\Models\DetallePedido;

class PedidoController extends Controller
{
    /**
     * @function index
     * @description Obtiene el historial de pedidos del usuario autenticado.
     */
    public function index()
    {
        $userId = Auth::id();

        $pedidos = Pedido::where('usuario_id', $userId)
            ->with(['detalles.plato', 'detalles.vino'])
            ->latest()
            ->get();

        return response()->json($pedidos);
    }

    /**
     * @function store
     * @description Crea un nuevo pedido adaptado al esquema profesional SQL.
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['mensaje' => 'No autorizado'], 401);
        }

        $request->validate([
            'total' => 'required|numeric',
            'metodo_pago' => 'required|string',
            'articulos' => 'required|array|min:1',
            'articulos.*.db_id' => 'required|integer',
            'articulos.*.tipo_item' => 'required|string|in:plato,vino',
            'articulos.*.nombre' => 'required|string',
            'articulos.*.cantidad' => 'required|integer|min:1',
            'articulos.*.precio' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            $total = (float)$request->total;
            $subtotal = round($total / 1.10, 2);
            $impuestos = round($total - $subtotal, 2);

            // Crear el pedido principal siguiendo el nuevo esquema SQL
            $pedido = Pedido::create([
                'usuario_id' => Auth::id(),
                'numero_pedido' => 'DG-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4)),
                'estado' => 'Pendiente',
                'tipo_pedido' => 'Takeaway',
                'subtotal' => $subtotal,
                'impuestos' => $impuestos,
                'total' => $total,
                'direccion' => $request->direccion ?? null
            ]);

            // Crear cada artículo del pedido con los nuevos nombres de columna
            foreach ($request->articulos as $item) {
                DetallePedido::create([
                    'pedido_id' => $pedido->id,
                    'plato_id' => $item['tipo_item'] === 'plato' ? $item['db_id'] : null,
                    'vino_id' => $item['tipo_item'] === 'vino' ? $item['db_id'] : null,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio'],
                    'precio_total' => $item['precio'] * $item['cantidad']
                ]);
            }

            return response()->json([
                'mensaje' => 'Pedido creado correctamente',
                'pedido' => $pedido->load('detalles')
            ], 201);
        });
    }

    /**
     * @function all
     * @description Lista todos los pedidos para administración.
     */
    public function all()
    {
        $pedidos = Pedido::with('usuario', 'detalles')->latest()->get();
        return response()->json($pedidos);
    }

    /**
     * @function updateStatus
     * @description Actualiza el estado usando los nuevos valores ENUM (Pendiente, Preparando, Listo, Entregado, Cancelado).
     */
    public function updateStatus(Request $request, $id)
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->estado = $request->input('estado');
        $pedido->save();
        return response()->json(['mensaje' => 'Estado del pedido actualizado']);
    }
}
