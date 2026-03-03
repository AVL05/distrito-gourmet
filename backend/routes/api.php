<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DishController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\OrderController;

/*
|--------------------------------------------------------------------------
| Rutas de la API
|--------------------------------------------------------------------------
*/

// Rutas públicas (no requieren autenticación)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/dishes', [DishController::class, 'index']); // Ver carta sin estar logueado

// Rutas protegidas (requieren estar logueado)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [\App\Http\Controllers\API\UserController::class, 'update']); // Actualizar perfil propio

    // Reservas del usuario
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);

    // Pedidos del usuario
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);

    // Panel de administración (requieren login + rol admin)
    Route::group(['prefix' => 'admin'], function () {
        // Gestión de platos
        Route::apiResource('dishes', DishController::class)->except(['index', 'show']);

        // Gestión de reservas
        Route::get('/reservations', [ReservationController::class, 'all']);
        Route::patch('/reservations/{id}', [ReservationController::class, 'updateStatus']);

        // Gestión de pedidos
        Route::get('/orders', [OrderController::class, 'all']);
        Route::patch('/orders/{id}', [OrderController::class, 'updateStatus']);

        // Gestión de usuarios
        Route::get('/users', [\App\Http\Controllers\API\UserController::class, 'index']);
        Route::put('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'update']);
        Route::delete('/users/{id}', [\App\Http\Controllers\API\UserController::class, 'destroy']);
    });
});
