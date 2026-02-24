<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = \App\Models\Reservation::where('user_id', auth()->id())->get();
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_time' => 'required|date',
            'people' => 'required|integer|min:1',
            'experience_type' => 'nullable|string'
        ]);

        $res = \App\Models\Reservation::create(array_merge($validated, [
            'user_id' => auth()->id(),
            'status' => 'pending'
        ]));

        return response()->json(['message' => 'Reservation created', 'reservation' => $res], 201);
    }

    public function all()
    {
        $reservations = \App\Models\Reservation::with('user')->orderBy('reservation_time', 'desc')->get();
        return response()->json($reservations);
    }

    public function updateStatus(Request $request, $id)
    {
        $res = \App\Models\Reservation::findOrFail($id);
        $res->status = $request->input('status');
        $res->save();
        return response()->json(['message' => 'Reservation status updated']);
    }
}
