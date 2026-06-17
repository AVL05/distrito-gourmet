<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PlatoController;
use App\Http\Controllers\API\ReservaController;
use App\Http\Controllers\API\PedidoController;
use App\Http\Controllers\API\VinoController;
use App\Http\Controllers\API\BebidaController;
use App\Http\Controllers\API\MenuDegustacionController;
use App\Http\Controllers\API\UsuarioController;
use App\Http\Controllers\API\AdminMetricsController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\ReservationAvailabilityController;
use App\Http\Controllers\API\PasswordResetController;
use App\Http\Controllers\API\PickupTimesController;

// Rutas públicas
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])->middleware('throttle:auth');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
Route::get('/dishes', [PlatoController::class, 'index']);
Route::get('/pickup-times', PickupTimesController::class);
Route::get('/reservation-availability', ReservationAvailabilityController::class);
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:auth');

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/profile', [UsuarioController::class, 'update']);

    Route::get('/reservations', [ReservaController::class, 'index']);
    Route::post('/reservations', [ReservaController::class, 'store']);

    Route::post('/orders', [PedidoController::class, 'store']);
    Route::get('/orders', [PedidoController::class, 'index']);

    // Rutas de staff (sala y cocina: Administrador + Staff)
    Route::group(['prefix' => 'staff', 'middleware' => 'staff'], function () {
        Route::get('/orders', [PedidoController::class, 'all']);
        Route::patch('/orders/{id}', [PedidoController::class, 'updateStatus']);
        Route::get('/reservations', [ReservaController::class, 'all']);
    });

    // Panel de administración (solo Administrador)
    Route::group(['prefix' => 'admin', 'middleware' => 'admin'], function () {
        Route::get('/metrics', AdminMetricsController::class);

        Route::apiResource('dishes', PlatoController::class)->except(['index', 'show']);
        Route::apiResource('wines', VinoController::class);
        Route::apiResource('beverages', BebidaController::class);
        Route::apiResource('tasting-menus', MenuDegustacionController::class);

        Route::get('/reservations', [ReservaController::class, 'all']);
        Route::patch('/reservations/{id}', [ReservaController::class, 'updateStatus']);
        Route::delete('/reservations/{id}', [ReservaController::class, 'destroy']);

        Route::get('/orders', [PedidoController::class, 'all']);
        Route::patch('/orders/{id}', [PedidoController::class, 'updateStatus']);
        Route::delete('/orders/{id}', [PedidoController::class, 'destroy']);

        Route::get('/users', [UsuarioController::class, 'index']);
        Route::post('/users', [UsuarioController::class, 'store']);
        Route::put('/users/{id}', [UsuarioController::class, 'update']);
        Route::delete('/users/{id}', [UsuarioController::class, 'destroy']);
    });
});
