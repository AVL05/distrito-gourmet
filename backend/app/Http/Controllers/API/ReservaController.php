<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservaRequest;
use App\Http\Resources\ReservaResource;
use App\Models\Reserva;
use App\Notifications\RestaurantUpdate;
use App\Services\ReservationRules;
use App\Services\RestaurantSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReservaController extends Controller
{
    public function index()
    {
        $reservas = Reserva::where('usuario_id', auth()->id())->latest('fecha_reserva')->get();

        return ReservaResource::collection($reservas);
    }

    public function store(StoreReservaRequest $request)
    {
        $data = $request->validated();
        $data['hora_reserva'] = ReservationRules::normalizeTime($data['hora_reserva']);

        $fecha = $data['fecha_reserva'];
        $hora = $data['hora_reserva'];

        $response = ReservationRules::synchronized(function () use ($data, $fecha, $hora) {
            $exists = Reserva::where('usuario_id', auth()->id())
                ->where('fecha_reserva', $fecha)
                ->where('estado', '!=', 'Cancelada')
                ->exists();

            if ($exists) {
                return response()->json([
                    'mensaje' => 'Ya dispone de una reserva para esta fecha.',
                ], 422);
            }

            $totalOccupancy = ReservationRules::occupancy($fecha, $hora);

            $estado = ($totalOccupancy + $data['comensales']) > config('restaurant.capacity')
                ? 'Pendiente'
                : 'Confirmada';

            $res = Reserva::create([
                'usuario_id' => auth()->id(),
                'fecha_reserva' => $fecha,
                'hora_reserva' => $hora,
                'comensales' => $data['comensales'],
                'estado' => $estado,
                'peticiones_especiales' => $data['peticiones_especiales'] ?? null,
                'codigo_reserva' => strtoupper(Str::random(8)),
            ]);

            $mensaje = $estado === 'Pendiente'
                ? 'Su reserva ha quedado PENDIENTE de aprobación.'
                : 'Reserva confirmada correctamente';

            return response()->json(['mensaje' => $mensaje, 'reserva' => new ReservaResource($res)], 201);
        });
        if ($response->getStatusCode() === 201) {
            $res = $response->getData()->reserva;
            RestaurantUpdate::send(auth()->user(), 'Reserva '.$res->estado, $res->codigo_reserva, $fecha.' '.substr($hora, 0, 5));
        }

        return $response;
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

        $res = ReservationRules::synchronized(function () use ($request, $id) {
            $res = Reserva::findOrFail($id);
            if ($request->input('estado') === 'Confirmada' && $res->estado !== 'Confirmada') {
                if (! in_array(substr($res->hora_reserva, 0, 5), RestaurantSchedule::times($res->fecha_reserva), true)
                    || ReservationRules::occupancy($res->fecha_reserva, $res->hora_reserva, $res->id) + $res->comensales > config('restaurant.capacity')) {
                    throw ValidationException::withMessages(['estado' => 'El servicio no tiene aforo disponible o ya no admite reservas.']);
                }
            }
            $res->fill($request->only('estado'))->save();

            return $res;
        });
        if ($res->wasChanged('estado')) {
            RestaurantUpdate::send($res->usuario, 'Reserva '.$res->estado, $res->codigo_reserva, $res->fecha_reserva.' '.substr($res->hora_reserva, 0, 5));
        }

        return response()->json(['mensaje' => 'Reserva actualizada correctamente']);
    }

    public function destroy($id)
    {
        ReservationRules::synchronized(fn () => Reserva::findOrFail($id)->delete());

        return response()->json(['mensaje' => 'Reserva eliminada correctamente']);
    }

    public function cancel($id)
    {
        $res = ReservationRules::synchronized(function () use ($id) {
            $res = Reserva::where('usuario_id', auth()->id())->findOrFail($id);
            if (! RestaurantSchedule::isFuture($res->fecha_reserva, $res->hora_reserva)) {
                throw ValidationException::withMessages(['reserva' => 'Solo puede cancelar reservas antes de su hora de inicio.']);
            }
            $res->update(['estado' => 'Cancelada']);

            return $res;
        });
        if ($res->wasChanged('estado')) {
            RestaurantUpdate::send($res->usuario, 'Reserva cancelada', $res->codigo_reserva, $res->fecha_reserva.' '.substr($res->hora_reserva, 0, 5));
        }

        return response()->json(['mensaje' => 'Reserva cancelada correctamente', 'reserva' => new ReservaResource($res)]);
    }
}
