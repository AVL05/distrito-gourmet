<?php
// Gestión de pedidos: creación, listado y actualización de estados para el servicio takeaway

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Models\Bebida;
use App\Models\MenuDegustacion;
use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\Plato;
use App\Models\Vino;

class PedidoController extends Controller
{
    private const METODOS_PAGO = ['card', 'cash', 'paypal'];

    private const HORAS_RECOGIDA = [
        '13:00:00',
        '13:30:00',
        '14:00:00',
        '14:30:00',
        '15:00:00',
        '15:30:00',
        '20:00:00',
        '20:30:00',
        '21:00:00',
        '21:30:00',
        '22:00:00',
        '22:30:00',
    ];

    // Obtener el historial de pedidos del usuario autenticado
    public function index()
    {
        $userId = Auth::id();

        $pedidos = Pedido::where('usuario_id', $userId)
            ->with(['detalles.plato', 'detalles.vino', 'detalles.bebida', 'detalles.menu_degustacion'])
            ->latest()
            ->get();

        return response()->json($pedidos);
    }

    // Crear un nuevo pedido con el desglose de artículos y cálculo de impuestos
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['mensaje' => 'No autorizado'], 401);
        }

        $request->merge([
            'hora_recogida' => $this->normalizarHora($request->input('hora_recogida')),
        ]);

        $request->validate([
            'metodo_pago' => ['required', Rule::in(self::METODOS_PAGO)],
            'hora_recogida' => ['nullable', Rule::in(self::HORAS_RECOGIDA)],
            'fecha_recogida' => ['nullable', 'date', Rule::in([
                now()->toDateString(),
                now()->addDay()->toDateString(),
            ])],
            'articulos' => 'required|array|min:1',
            'articulos.*.db_id' => 'required|integer',
            'articulos.*.tipo_item' => 'required|string|in:plato,vino,bebida,menu_degustacion',
            'articulos.*.nombre' => 'required|string',
            'articulos.*.cantidad' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $articulos = collect($request->articulos)->map(function (array $item) {
                $catalogItem = match ($item['tipo_item']) {
                    'plato' => Plato::where('disponible', true)
                        ->where('disponible_para_llevar', true)
                        ->find($item['db_id']),
                    'vino' => Vino::where('disponible', true)->find($item['db_id']),
                    'bebida' => Bebida::where('disponible', true)->find($item['db_id']),
                    'menu_degustacion' => MenuDegustacion::where('disponible', true)->find($item['db_id']),
                };

                if (! $catalogItem) {
                    throw ValidationException::withMessages([
                        'articulos' => ['Uno de los artículos no está disponible.'],
                    ]);
                }

                $precio = match ($item['tipo_item']) {
                    'vino' => $catalogItem->precio_botella ?? $catalogItem->precio_copa,
                    default => $catalogItem->precio,
                };

                if ($precio === null) {
                    throw ValidationException::withMessages([
                        'articulos' => ['Uno de los artículos no tiene precio configurado.'],
                    ]);
                }

                $maximo = $catalogItem->maximo_por_pedido ?? null;
                if ($maximo && $item['cantidad'] > $maximo) {
                    throw ValidationException::withMessages([
                        'articulos' => ["La cantidad máxima permitida para {$catalogItem->nombre} es {$maximo}."],
                    ]);
                }

                return [
                    ...$item,
                    'precio' => (float) $precio,
                ];
            });

            $total = round($articulos->sum(fn ($item) => $item['precio'] * $item['cantidad']), 2);
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
            foreach ($articulos as $item) {
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

    // Listar todos los pedidos registrados (acceso de administrador)
    public function all()
    {
        $pedidos = Pedido::with(['usuario', 'detalles.plato', 'detalles.vino', 'detalles.bebida', 'detalles.menu_degustacion'])
            ->latest()
            ->get();
        return response()->json($pedidos);
    }

    // Actualizar el estado logístico del pedido (Pendiente, Preparando, Listo, etc.)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:Pendiente,Preparando,Listo,Entregado,Cancelado',
        ]);

        $pedido = Pedido::findOrFail($id);
        $pedido->estado = $request->input('estado');
        $pedido->save();
        return response()->json(['mensaje' => 'Estado del pedido actualizado']);
    }

    // Eliminar un pedido y su información asociada
    public function destroy($id)
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->delete();
        return response()->json(['mensaje' => 'Pedido eliminado correctamente']);
    }

    private function normalizarHora(?string $hora): ?string
    {
        if (! $hora) {
            return $hora;
        }

        return preg_match('/^\d{2}:\d{2}$/', $hora) ? "{$hora}:00" : $hora;
    }
}
