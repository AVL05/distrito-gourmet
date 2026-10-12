<?php

namespace App\Services;

use App\Models\Reserva;
use Illuminate\Support\Facades\DB;

class ReservationRules
{
    public static function normalizeTime(?string $time): ?string
    {
        if (! $time) {
            return $time;
        }

        return preg_match('/^\d{2}:\d{2}$/', $time) ? "{$time}:00" : $time;
    }

    public static function availabilityForDate(string $date): array
    {
        $occupancy = ['lunch' => self::occupancy($date, '13:30:00'), 'dinner' => self::occupancy($date, '20:30:00')];

        return collect(RestaurantSchedule::times($date))->map(function (string $time) use ($occupancy) {
            $turn = self::normalizeTime($time);
            $occupied = $occupancy[$time >= '20:00' ? 'dinner' : 'lunch'];
            $capacity = config('restaurant.capacity');
            $availableSeats = max($capacity - $occupied, 0);

            return [
                'time' => substr($turn, 0, 5),
                'time_value' => $turn,
                'occupied' => $occupied,
                'available_seats' => $availableSeats,
                'capacity' => $capacity,
                'status' => match (true) {
                    $availableSeats === 0 => 'complete',
                    $availableSeats <= 8 => 'limited',
                    default => 'available',
                },
            ];
        })->values()->all();
    }

    public static function occupancy(string $date, string $time, ?int $except = null): int
    {
        return (int) Reserva::where('fecha_reserva', $date)->where('estado', 'Confirmada')
            ->where('hora_reserva', $time >= '20:00:00' ? '>=' : '<', '20:00:00')
            ->when($except, fn ($query) => $query->where('id', '!=', $except))->sum('comensales');
    }

    public static function synchronized(callable $operation): mixed
    {
        return DB::transaction(function () use ($operation) {
            // Una fila estable protege también la primera reserva de un servicio vacío.
            DB::table('restaurant_locks')->where('id', 1)->lockForUpdate()->firstOrFail();

            return $operation();
        }, 3);
    }
}
