<?php

namespace App\Services;

use Carbon\CarbonImmutable;

class RestaurantSchedule
{
    public static function times(string $date, string $kind = 'reservations'): array
    {
        $parts = explode('-', $date);
        if (! preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || ! checkdate((int) $parts[1], (int) $parts[2], (int) $parts[0])) {
            return [];
        }
        $day = CarbonImmutable::parse($date, config('app.timezone'))->startOfDay();
        if ($day->isBefore(today()) || $day->isAfter(today()->addDays(config('restaurant.booking_days'))) || in_array($date, config('restaurant.closed_dates'), true)) {
            return [];
        }
        $times = [];
        foreach (config('restaurant.services') as $service) {
            if (in_array($day->dayOfWeekIso, $service['days'], true)) {
                foreach ($service[$kind] as $time) {
                    if ($day->setTimeFromTimeString($time)->isAfter(now())) {
                        $times[] = $time;
                    }
                }
            }
        }

        return $times;
    }

    public static function calendar(): array
    {
        return collect(range(0, config('restaurant.booking_days')))->map(function ($offset) {
            $date = today()->addDays($offset)->toDateString();

            return ['date' => $date, 'reservations' => self::times($date), 'pickup' => self::times($date, 'pickup')];
        })->values()->all();
    }

    public static function isFuture(string $date, string $time): bool
    {
        return CarbonImmutable::parse("{$date} {$time}", config('app.timezone'))->isAfter(now());
    }
}
