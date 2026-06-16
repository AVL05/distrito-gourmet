<?php

namespace App\Services;

use App\Models\Reserva;

class ReservationRules
{
    public const CAPACITY = 44;

    public const TURNS = [
        '13:00:00',
        '13:30:00',
        '14:00:00',
        '14:30:00',
        '20:00:00',
        '20:30:00',
        '21:00:00',
        '21:30:00',
    ];

    public static function normalizeTime(?string $time): ?string
    {
        if (! $time) {
            return $time;
        }

        return preg_match('/^\d{2}:\d{2}$/', $time) ? "{$time}:00" : $time;
    }

    public static function availabilityForDate(string $date): array
    {
        $occupancyByTurn = Reserva::where('fecha_reserva', $date)
            ->where('estado', '!=', 'Cancelada')
            ->selectRaw('hora_reserva, SUM(comensales) as ocupacion')
            ->groupBy('hora_reserva')
            ->pluck('ocupacion', 'hora_reserva');

        return collect(self::TURNS)->map(function (string $turn) use ($occupancyByTurn) {
            $occupied = (int) ($occupancyByTurn[$turn] ?? 0);
            $availableSeats = max(self::CAPACITY - $occupied, 0);

            return [
                'time' => substr($turn, 0, 5),
                'time_value' => $turn,
                'occupied' => $occupied,
                'available_seats' => $availableSeats,
                'capacity' => self::CAPACITY,
                'status' => match (true) {
                    $availableSeats === 0 => 'complete',
                    $availableSeats <= 8 => 'limited',
                    default => 'available',
                },
            ];
        })->values()->all();
    }
}
