<?php
/**
 * @file AuthController.php
 * @author Alex V. (DAW)
 * @date 2026-04-06
 * @description Controlador encargado de gestionar la autenticación de usuarios (registro, login, logout).
 */

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * @function register
     * @description Procesa el registro de nuevos usuarios, asignándoles el rol de 'client' por defecto.
     */
    public function register(Request $request)
    {
        // Validar datos del formulario de registro
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // Crear el usuario con rol 'client' por defecto
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
        ]);

        // Generar token de acceso
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * @function login
     * @description Autentica al usuario mediante email y password, devolviendo un token de acceso personal.
     */
    public function login(Request $request)
    {
        // Validar email y contraseña
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Verificar que las credenciales son correctas
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        // Generar token de acceso
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * @function logout
     * @description Cierra la sesión activa revocando el token de acceso del usuario autenticado.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    /**
     * @function user
     * @description Recupera el perfil del usuario autenticado actualmente por el token Bearer.
     */
    public function user(Request $request)
    {
        return $request->user();
    }
}
