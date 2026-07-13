<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

class PickupTimesController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'horarios' => PedidoController::getPickupTimes(),
        ]);
    }
}
