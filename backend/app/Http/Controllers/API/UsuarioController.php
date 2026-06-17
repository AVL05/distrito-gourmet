<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UsuarioController extends Controller
{
    public function index()
    {
        return response()->json(Usuario::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'   => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:usuarios',
            'telefono' => 'required|string|max:20',
            'password' => 'required|string|min:8',
            'rol'      => ['required', Rule::in(['Administrador', 'Cliente', 'Staff'])],
        ]);

        $user = Usuario::create([
            'nombre'   => $request->nombre,
            'email'    => $request->email,
            'telefono' => $request->telefono,
            'password' => Hash::make($request->password),
            'rol'      => $request->rol,
        ]);

        return response()->json(['message' => 'Usuario creado correctamente', 'user' => $user], 201);
    }

    public function update(Request $request, $id = null)
    {
        $userId = $id ?? auth()->id();
        $user = Usuario::findOrFail($userId);

        if ($userId != auth()->id() && auth()->user()->rol !== 'Administrador') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'nombre'   => 'sometimes|required|string|max:255',
            'email'    => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('usuarios')->ignore($user->id)],
            'telefono' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
            'rol'      => ['sometimes', 'required', Rule::in(['Administrador', 'Cliente', 'Staff'])],
        ]);

        $data = $request->only(['nombre', 'email', 'telefono']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->filled('rol') && auth()->user()->rol === 'Administrador') {
            $data['rol'] = $request->rol;
        }

        $user->update($data);

        return response()->json(['message' => 'Usuario actualizado correctamente', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = Usuario::findOrFail($id);

        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'No puede eliminar su propio usuario administrador'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }
}
