<?php
/**
 * @file AuthController.php
 * @author Alex V. (DAW)
 * @date 2026-04-06
 * @description Controlador encargado de gestionar la autenticación de usuarios (registro, login, logout).
 */

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
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
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:usuarios',
            'password' => 'required|string|min:8',
            'telefono' => 'required|string|max:20',
        ], [
            'nombre.required' => 'El nombre es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'telefono.required' => 'El teléfono es obligatorio.',
            'telefono.max' => 'El teléfono no puede tener más de 20 caracteres.',
        ]);

        // Crear el usuario con rol 'client' por defecto
        $usuario = Usuario::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telefono' => $request->telefono,
            'rol' => 'client',
        ]);

        // Generar token de acceso
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
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

        $usuario = Usuario::where('email', $request->email)->first();

        // Verificar que las credenciales son correctas
        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales son incorrectas.'],
            ]);
        }

        // Generar token de acceso
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
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
        return response()->json(['mensaje' => 'Sesión cerrada correctamente']);
    }

    /**
     * @function me
     * @description Obtiene los datos del usuario autenticado actualmente.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
