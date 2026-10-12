<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\RestaurantSchedule;

class PickupTimesController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'horarios' => RestaurantSchedule::times(today()->toDateString(), 'pickup'),
            'timezone' => config('app.timezone'),
            'days' => collect([today(), today()->addDay()])->map(fn ($day) => [
                'date' => $day->toDateString(), 'times' => RestaurantSchedule::times($day->toDateString(), 'pickup'),
            ])->all(),
        ]);
    }
}
