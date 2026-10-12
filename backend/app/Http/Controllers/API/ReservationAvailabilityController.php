<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\ReservationRules;
use Illuminate\Http\Request;

class ReservationAvailabilityController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date_format:Y-m-d|after_or_equal:today',
        ]);

        return response()->json([
            'date' => $validated['date'],
            'capacity' => config('restaurant.capacity'),
            'turns' => ReservationRules::availabilityForDate($validated['date']),
        ]);
    }
}
