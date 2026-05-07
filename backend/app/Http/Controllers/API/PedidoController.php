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
            ->with(['detalles.plato', 'detalles.vino', 'detalles.bebida', 'detalles.menu_degustacion'])
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
            'hora_recogida' => 'nullable|string',
            'fecha_recogida' => 'nullable|date',
            'articulos' => 'required|array|min:1',
            'articulos.*.db_id' => 'required|integer',
            'articulos.*.tipo_item' => 'required|string|in:plato,vino,bebida,menu_degustacion',
            'articulos.*.nombre' => 'required|string',
            'articulos.*.cantidad' => 'required|integer|min:1',
            'articulos.*.precio' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            $total = (float) $request->total;
            $subtotal = round($total / 1.10, 2);
            $impuestos = round($total - $subtotal, 2);

            // Crear el pedido principal
            $pedido = Pedido::create([
                'usuario_id' => Auth::id(),
                'numero_pedido' => 'DG-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4)),
                'estado' => 'Pendiente',
                'tipo_pedido' => 'Takeaway',
                'subtotal' => $subtotal,
                'impuestos' => $impuestos,
                'total' => $total,
                'direccion' => $request->direccion ?? null,
                'hora_recogida' => $request->hora_recogida,
                'fecha_recogida' => $request->fecha_recogida,
                'metodo_pago' => $request->metodo_pago,
            ]);

            // Crear cada artículo del pedido
            foreach ($request->articulos as $item) {
                DetallePedido::create([
                    'pedido_id' => $pedido->id,
                    'plato_id' => $item['tipo_item'] === 'plato' ? $item['db_id'] : null,
                    'vino_id' => $item['tipo_item'] === 'vino' ? $item['db_id'] : null,
                    'bebida_id' => $item['tipo_item'] === 'bebida' ? $item['db_id'] : null,
                    'menu_degustacion_id' => $item['tipo_item'] === 'menu_degustacion' ? $item['db_id'] : null,
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
        $pedidos = Pedido::with(['usuario', 'detalles.plato', 'detalles.vino', 'detalles.bebida', 'detalles.menu_degustacion'])
            ->latest()
            ->get();
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

    /**
     * @function destroy
     * @description Elimina un pedido y sus detalles asociados (vía cascada SQL).
     */
    public function destroy($id)
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->delete();
        return response()->json(['mensaje' => 'Pedido eliminado correctamente']);
    }
}
