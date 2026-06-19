<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservaRequest;
use App\Http\Resources\ReservaResource;
use App\Models\Reserva;
use App\Services\ReservationRules;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReservaController extends Controller
{
    public function index()
    {
        $reservas = Reserva::where('usuario_id', auth()->id())->get();

        return ReservaResource::collection($reservas);
    }

    public function store(StoreReservaRequest $request)
    {
        $data = $request->validated();
        $data['hora_reserva'] = ReservationRules::normalizeTime($data['hora_reserva']);

        $fecha = $data['fecha_reserva'];
        $hora  = $data['hora_reserva'];

        $exists = Reserva::where('usuario_id', auth()->id())
            ->where('fecha_reserva', $fecha)
            ->where('estado', '!=', 'Cancelada')
            ->exists();

        if ($exists) {
            return response()->json([
                'mensaje' => 'Ya dispone de una reserva para esta fecha.',
            ], 422);
        }

        $totalOccupancy = Reserva::where('fecha_reserva', $fecha)
            ->where('hora_reserva', $hora)
            ->where('estado', '!=', 'Cancelada')
            ->sum('comensales');

        $estado = ($totalOccupancy + $data['comensales']) > ReservationRules::CAPACITY
            ? 'Pendiente'
            : 'Confirmada';

        $res = Reserva::create([
            'usuario_id'            => auth()->id(),
            'fecha_reserva'         => $fecha,
            'hora_reserva'          => $hora,
            'comensales'            => $data['comensales'],
            'estado'                => $estado,
            'peticiones_especiales' => $data['peticiones_especiales'] ?? null,
            'codigo_reserva'        => strtoupper(Str::random(8)),
        ]);

        $mensaje = $estado === 'Pendiente'
            ? 'Su reserva ha quedado PENDIENTE de aprobación.'
            : 'Reserva confirmada correctamente';

        return response()->json(['mensaje' => $mensaje, 'reserva' => new ReservaResource($res)], 201);
    }

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
            ->paginate(request()->integer('per_page', 50));

        return ReservaResource::collection($reservas);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'estado' => 'sometimes|required|in:Pendiente,Confirmada,Cancelada',
        ]);

        $res = Reserva::findOrFail($id);

        if ($request->has('estado')) {
            $res->estado = $request->input('estado');
        }

        $res->save();

        return response()->json(['mensaje' => 'Reserva actualizada correctamente']);
    }

    public function destroy($id)
    {
        $res = Reserva::findOrFail($id);
        $res->delete();

        return response()->json(['mensaje' => 'Reserva eliminada correctamente']);
    }
}
