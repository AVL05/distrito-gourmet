<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\DetallePedido;
use App\Models\Pedido;
use App\Models\Reserva;
use App\Services\ReservationRules;
use Illuminate\Support\Carbon;

class AdminMetricsController extends Controller
{
    public function __invoke()
    {
        $today = Carbon::today()->toDateString();

        $activeOrders = Pedido::whereNotIn('estado', ['Entregado', 'Cancelado'])->count();
        $pendingReservations = Reserva::where('estado', 'Pendiente')->count();
        $upcomingReservations = Reserva::whereDate('fecha_reserva', '>=', $today)
            ->where('estado', '!=', 'Cancelada')
            ->count();
        $todaySeats = (int) Reserva::where('fecha_reserva', $today)
            ->where('estado', '!=', 'Cancelada')
            ->sum('comensales');
        $averageTicket = (float) Pedido::where('estado', '!=', 'Cancelado')->avg('total');

        $topDishes = DetallePedido::query()
            ->selectRaw('plato_id, SUM(cantidad) as unidades')
            ->whereNotNull('plato_id')
            ->groupBy('plato_id')
            ->with('plato:id,nombre')
            ->orderByDesc('unidades')
            ->limit(5)
            ->get()
            ->map(fn(DetallePedido $detail) => [
                'name' => $detail->plato?->nombre ?? 'Plato eliminado',
                'units' => (int) $detail->unidades,
            ])
            ->values();

        $occupancyByTurn = Reserva::where('fecha_reserva', $today)
            ->where('estado', '!=', 'Cancelada')
            ->selectRaw('hora_reserva, SUM(comensales) as ocupacion')
            ->groupBy('hora_reserva')
            ->pluck('ocupacion', 'hora_reserva');

        $turnOccupancy = collect(ReservationRules::TURNS)->map(fn(string $turn) => [
            'time' => substr($turn, 0, 5),
            'occupied' => (int) ($occupancyByTurn[$turn] ?? 0),
            'capacity' => ReservationRules::CAPACITY,
        ])->values();

        return response()->json([
            'active_orders' => $activeOrders,
            'pending_reservations' => $pendingReservations,
            'upcoming_reservations' => $upcomingReservations,
            'today_seats' => $todaySeats,
            'capacity' => ReservationRules::CAPACITY,
            'average_ticket' => round($averageTicket, 2),
            'top_dishes' => $topDishes,
            'turn_occupancy' => $turnOccupancy,
        ]);
    }
}
