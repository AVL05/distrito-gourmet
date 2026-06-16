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
            'date' => 'required|date|after_or_equal:today',
        ]);

        return response()->json([
            'date' => $validated['date'],
            'capacity' => ReservationRules::CAPACITY,
            'turns' => ReservationRules::availabilityForDate($validated['date']),
        ]);
    }
}
