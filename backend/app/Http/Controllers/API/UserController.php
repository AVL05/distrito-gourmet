<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // Obtener todos los usuarios (Solo Admin)
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Actualizar propio perfil o por Admin
    public function update(Request $request, $id = null)
    {
        $userId = $id ? $id : auth()->id();
        $user = User::findOrFail($userId);

        // Si es otro usuario, asegurar que quien lo cambia es admin
        if ($userId != auth()->id() && auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'allergies' => 'nullable|string',
            'preferences' => 'nullable|string',
            'password' => 'nullable|string|min:8'
        ]);

        $data = $request->only(['name', 'email', 'phone', 'allergies', 'preferences']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->filled('role') && auth()->user()->role === 'admin') {
            $data['role'] = $request->role; // Sólo un admin puede nombrar a otro admin o cambiar roles
        }

        $user->update($data);

        return response()->json(['message' => 'Usuario actualizado correctamente', 'user' => $user]);
    }

    // Eliminar usuario
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(['message' => 'Usuario eliminado correctamente']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar usuario'], 500);
        }
    }
}
