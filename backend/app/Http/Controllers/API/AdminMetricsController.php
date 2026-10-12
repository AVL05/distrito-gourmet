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
            ->where('estado', 'Confirmada')
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
            ->map(fn (DetallePedido $detail) => [
                'name' => $detail->plato?->nombre ?? 'Plato eliminado',
                'units' => (int) $detail->unidades,
            ])
            ->values();

        $turnOccupancy = collect(ReservationRules::availabilityForDate($today))->map(fn ($turn) => [
            'time' => $turn['time'], 'occupied' => $turn['occupied'], 'capacity' => $turn['capacity'],
        ])->values();

        return response()->json([
            'active_orders' => $activeOrders,
            'pending_reservations' => $pendingReservations,
            'upcoming_reservations' => $upcomingReservations,
            'today_seats' => $todaySeats,
            'capacity' => config('restaurant.capacity'),
            'average_ticket' => round($averageTicket, 2),
            'top_dishes' => $topDishes,
            'turn_occupancy' => $turnOccupancy,
        ]);
    }
}
