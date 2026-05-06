<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    // Obtener todos los usuarios (solo admin)
    public function index()
    {
        $users = Usuario::all();
        return response()->json($users);
    }

    // Actualizar perfil propio o actualizar usuario por admin
    public function update(Request $request, $id = null)
    {
        $userId = $id ? $id : auth()->id();
        $user = Usuario::findOrFail($userId);

        // Si intenta editar otro usuario, verificar que sea admin
        if ($userId != auth()->id() && auth()->user()->rol !== 'Administrador') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Validar datos del usuario
        $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('usuarios')->ignore($user->id)],
            'telefono' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8'
        ]);

        $data = $request->only(['nombre', 'email', 'telefono']);

        // Si se envía contraseña nueva, encriptarla
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        // Solo un admin puede cambiar roles de usuario
        if ($request->filled('rol') && auth()->user()->rol === 'Administrador') {
            $data['rol'] = $request->rol;
        }

        $user->update($data);

        return response()->json(['message' => 'Usuario actualizado correctamente', 'user' => $user]);
    }

    // Eliminar un usuario (solo admin)
    public function destroy($id)
    {
        try {
            $user = Usuario::findOrFail($id);
            $user->delete();
            return response()->json(['message' => 'Usuario eliminado correctamente']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar usuario'], 500);
        }
    }
}
