<?php
// Gestión de reservas: administración de citas y ocupación de mesas

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Services\DiscordReservationNotifier;
use App\Services\ReservationRules;
use Illuminate\Validation\Rule;

class ReservaController extends Controller
{
    public function __construct(
        private readonly DiscordReservationNotifier $discordReservationNotifier
    ) {}

    // Listar las reservas asociadas al usuario autenticado
    public function index()
    {
        $reservas = Reserva::where('usuario_id', auth()->id())
            ->get();
        return response()->json($reservas);
    }

    // Registrar una nueva reserva validando disponibilidad y aforo
    public function store(Request $request)
    {
        $request->merge([
            'hora_reserva' => ReservationRules::normalizeTime($request->input('hora_reserva')),
        ]);

        $request->validate([
            'fecha_reserva' => 'required|date|after_or_equal:today',
            'hora_reserva' => ['required', Rule::in(ReservationRules::TURNS)],
            'comensales' => 'required|integer|min:1|max:8',
            'peticiones_especiales' => 'nullable|string'
        ]);

        $fecha = $request->fecha_reserva;
        $hora = $request->hora_reserva;
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
            ->where('hora_reserva', $hora)
            ->where('estado', '!=', 'Cancelada')
            ->sum('comensales');

        $estado = ($totalOccupancy + $request->comensales) > ReservationRules::CAPACITY ? 'Pendiente' : 'Confirmada';

        $res = Reserva::create([
            'usuario_id' => auth()->id(),
            'fecha_reserva' => $fecha,
            'hora_reserva' => $hora,
            'comensales' => $request->comensales,
            'estado' => $estado,
            'peticiones_especiales' => $request->peticiones_especiales,
            'codigo_reserva' => strtoupper(substr(uniqid(), -8))
        ]);

        $this->discordReservationNotifier->notify($res, auth()->user());

        $mensaje = $estado === 'Pendiente'
            ? 'Su reserva ha quedado PENDIENTE de aprobación.'
            : 'Reserva confirmada correctamente';

        return response()->json(['mensaje' => $mensaje, 'reserva' => $res], 201);
    }

    // Recuperar el listado global de reservas para administración
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

    // Actualizar el estado de una reserva específica
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'estado' => 'sometimes|required|in:Pendiente,Confirmada,Cancelada'
        ]);

        $res = Reserva::findOrFail($id);

        if ($request->has('estado')) {
            $res->estado = $request->input('estado');
        }

        $res->save();
        return response()->json(['mensaje' => 'Reserva actualizada correctamente']);
    }

    // Eliminar una reserva de forma permanente
    public function destroy($id)
    {
        $res = Reserva::findOrFail($id);
        $res->delete();
        return response()->json(['mensaje' => 'Reserva eliminada correctamente']);
    }
}
