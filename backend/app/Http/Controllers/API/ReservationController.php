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

class ReservationController extends Controller
{
    /**
     * @function index
     * @description Lista las reservas históricas o futuras asociadas al usuario autenticado.
     */
    public function index()
    {
        $reservations = \App\Models\Reservation::where('user_id', auth()->id())
            ->get()
            ->makeHidden(['table_number']);
        return response()->json($reservations);
    }

    /**
     * @function store
     * @description Crea una reserva tras validar los campos recibidos y asigna el estado 'confirmed' por defecto.
     */
    public function store(Request $request)
    {
        // Validar datos de la reserva
        $validated = $request->validate([
            'reservation_time' => 'required|date',
            'people' => 'required|integer|min:1',
            'experience_type' => 'nullable|string',
            'special_requests' => 'nullable|string',
            'allergies_noted' => 'nullable|string'
        ]);

        // Comprobar si el usuario ya tiene una reserva para el mismo día
        $date = date('Y-m-d', strtotime($request->reservation_time));
        $exists = \App\Models\Reservation::where('user_id', auth()->id())
            ->whereDate('reservation_time', $date)
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Ya dispone de una reserva para esta fecha. Solo se permite una reserva por día.'
            ], 422);
        }

        // Calcular la ocupación total para ese día (sumando todas las reservas activas)
        $totalOccupancy = \App\Models\Reservation::whereDate('reservation_time', $date)
            ->where('status', '!=', 'cancelled')
            ->sum('people');

        // Determinar el estado: si se superan las 44 personas, queda en pendiente
        $status = ($totalOccupancy + $request->people) > 44 ? 'pending' : 'confirmed';

        $res = \App\Models\Reservation::create(array_merge($validated, [
            'user_id' => auth()->id(),
            'status' => $status
        ]));

        $message = $status === 'pending'
            ? 'Capacidad máxima alcanzada para hoy. Su reserva ha quedado PENDIENTE de aprobación por el restaurante.'
            : 'Reserva confirmada correctamente';

        return response()->json(['message' => $message, 'reservation' => $res], 201);
    }

    /**
     * @function all
     * @description Recupera el listado completo de reservas registradas para el panel de administración.
     */
    public function all()
    {
        $reservations = \App\Models\Reservation::with('user')
            ->orderByRaw("CASE
                WHEN status = 'pending' THEN 1
                WHEN status = 'confirmed' THEN 2
                ELSE 3
            END")
            ->orderBy('reservation_time', 'asc')
            ->get();

        return response()->json($reservations);
    }

    /**
     * @function updateStatus
     * @description Permite a un administrador modificar el estado (confirmado, llegado, cancelado) de una reserva.
     */
    public function updateStatus(Request $request, $id)
    {
        $res = \App\Models\Reservation::findOrFail($id);

        if ($request->has('status')) {
            $res->status = $request->input('status');
        }

        if ($request->has('table_number')) {
            $res->table_number = $request->input('table_number');
        }

        $res->save();
        return response()->json(['message' => 'Reserva actualizada correctamente']);
    }
}
