<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PlatoController;
use App\Http\Controllers\API\ReservaController;
use App\Http\Controllers\API\PedidoController;
use App\Http\Controllers\API\VinoController;
use App\Http\Controllers\API\BebidaController;
use App\Http\Controllers\API\MenuDegustacionController;
use App\Http\Controllers\API\UsuarioController;

/*
|--------------------------------------------------------------------------
| Rutas de la API
|--------------------------------------------------------------------------
*/

// Rutas públicas (no requieren autenticación)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/dishes', [PlatoController::class, 'index']); // Ver carta sin estar logueado

// Rutas protegidas (requieren estar logueado)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/profile', [UsuarioController::class, 'update']); // Actualizar perfil propio

    // Reservas del usuario
    Route::get('/reservations', [ReservaController::class, 'index']);
    Route::post('/reservations', [ReservaController::class, 'store']);

    // Pedidos del usuario
    Route::post('/orders', [PedidoController::class, 'store']);
    Route::get('/orders', [PedidoController::class, 'index']);

    // Panel de administración (requieren login + rol admin)
    Route::group(['prefix' => 'admin'], function () {
        // Gestión de platos
        Route::apiResource('dishes', PlatoController::class)->except(['index', 'show']);
        Route::apiResource('wines', VinoController::class);
        Route::apiResource('beverages', BebidaController::class);
        Route::apiResource('tasting-menus', MenuDegustacionController::class);

        // Gestión de reservas
        Route::get('/reservations', [ReservaController::class, 'all']);
        Route::patch('/reservations/{id}', [ReservaController::class, 'updateStatus']);
        Route::delete('/reservations/{id}', [ReservaController::class, 'destroy']);

        // Gestión de pedidos
        Route::get('/orders', [PedidoController::class, 'all']);
        Route::patch('/orders/{id}', [PedidoController::class, 'updateStatus']);
        Route::delete('/orders/{id}', [PedidoController::class, 'destroy']);

        // Gestión de usuarios
        Route::get('/users', [UsuarioController::class, 'index']);
        Route::put('/users/{id}', [UsuarioController::class, 'update']);
        Route::delete('/users/{id}', [UsuarioController::class, 'destroy']);
    });
});
