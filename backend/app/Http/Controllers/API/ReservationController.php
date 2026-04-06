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
        $reservations = \App\Models\Reservation::where('user_id', auth()->id())->get();
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

        $res = \App\Models\Reservation::create(array_merge($validated, [
            'user_id' => auth()->id(),
            'status' => 'confirmed' // Auto-aceptar
        ]));

        return response()->json(['message' => 'Reserva confirmada correctamente', 'reservation' => $res], 201);
    }

    /**
     * @function all
     * @description Recupera el listado completo de reservas registradas para el panel de administración.
     */
    public function all()
    {
        $reservations = \App\Models\Reservation::with('user')->orderBy('reservation_time', 'desc')->get();
        return response()->json($reservations);
    }

    /**
     * @function updateStatus
     * @description Permite a un administrador modificar el estado (confirmado, llegado, cancelado) de una reserva.
     */
    public function updateStatus(Request $request, $id)
    {
        $res = \App\Models\Reservation::findOrFail($id);
        $res->status = $request->input('status');
        $res->save();
        return response()->json(['message' => 'Estado de la reserva actualizado']);
    }
}
