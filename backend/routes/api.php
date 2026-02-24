<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DishController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\OrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/


// Rutas Públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/dishes', [DishController::class, 'index']); // Ver menú sin estar logueado

// Rutas Protegidas (Requieren Login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [\App\Http\Controllers\API\UserController::class, 'update']); // Propio perfil

    // Reservas
    Route::get('/reservations', [ReservationController::class, 'index']); // Mis reservas
    Route::post('/reservations', [ReservationController::class, 'store']); // Crear reserva

    // Pedidos
    Route::post('/orders', [OrderController::class, 'store']); // Realizar pedido
    Route::get('/orders', [OrderController::class, 'index']); // Mis pedidos

    // Panel de Administración (simple middleware check for now, ideally 'can:admin')
    Route::group(['prefix' => 'admin'], function () {
        Route::apiResource('dishes', DishController::class)->except(['index', 'show']);
        Route::get('/reservations', [ReservationController::class, 'all']);
        Route::patch('/reservations/{id}', [ReservationController::class, 'updateStatus']); // Confirmar/Cancelar
        Route::get('/orders', [OrderController::class, 'all']);
        Route::patch('/orders/{id}', [OrderController::class, 'updateStatus']); // Cambiar estado pedido

        // Usuarios
        Route::get('/users', [\App\Http\Controllers\API\UserController::class, 'index']);
        Route::put('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'update']);
        Route::delete('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'destroy']);
    });
});
