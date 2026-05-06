<?php
/**
 * @file ReservationController.php
 * @author Alex V. (DAW)
 * @date 2026-04-06
 * @description Gestión de las reservas de mesas para los clientes desde el entorno API.
 */

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reserva;

class ReservaController extends Controller
{
    /**
     * @function index
     * @description Lista las reservas históricas o futuras asociadas al usuario autenticado.
     */
    public function index()
    {
        $reservas = Reserva::where('usuario_id', auth()->id())
            ->get();
        return response()->json($reservas);
    }

    /**
     * @function store
     * @description Crea una reserva adaptada al nuevo esquema SQL (date/time separados).
     */
    public function store(Request $request)
    {
        $request->validate([
            'fecha_reserva' => 'required|date',
            'hora_reserva' => 'required|string',
            'comensales' => 'required|integer|min:1',
            'peticiones_especiales' => 'nullable|string'
        ]);

        $fecha = $request->fecha_reserva;
        $exists = Reserva::where('usuario_id', auth()->id())
            ->where('fecha_reserva', $fecha)
            ->where('estado', '!=', 'Cancelada')
            ->exists();

        if ($exists) {
            return response()->json([
                'mensaje' => 'Ya dispone de una reserva para esta fecha.'
            ], 422);
        }

        $totalOccupancy = Reserva::where('fecha_reserva', $fecha)
            ->where('estado', '!=', 'Cancelada')
            ->sum('comensales');

        $estado = ($totalOccupancy + $request->comensales) > 44 ? 'Pendiente' : 'Confirmada';

        $res = Reserva::create([
            'usuario_id' => auth()->id(),
            'fecha_reserva' => $fecha,
            'hora_reserva' => $request->hora_reserva,
            'comensales' => $request->comensales,
            'estado' => $estado,
            'peticiones_especiales' => $request->peticiones_especiales,
            'codigo_reserva' => strtoupper(substr(uniqid(), -8))
        ]);

        $mensaje = $estado === 'Pendiente'
            ? 'Su reserva ha quedado PENDIENTE de aprobación.'
            : 'Reserva confirmada correctamente';

        return response()->json(['mensaje' => $mensaje, 'reserva' => $res], 201);
    }

    /**
     * @function all
     * @description Recupera el listado completo para administración.
     */
    public function all()
    {
        $reservas = Reserva::with('usuario')
            ->orderByRaw("CASE
                WHEN estado = 'Pendiente' THEN 1
                WHEN estado = 'Confirmada' THEN 2
                ELSE 3
            END")
            ->orderBy('fecha_reserva', 'asc')
            ->orderBy('hora_reserva', 'asc')
            ->get();

        return response()->json($reservas);
    }

    public function updateStatus(Request $request, $id)
    {
        $res = Reserva::findOrFail($id);

        if ($request->has('estado')) {
            $res->estado = $request->input('estado');
        }

        $res->save();
        return response()->json(['mensaje' => 'Reserva actualizada correctamente']);
    }
}
