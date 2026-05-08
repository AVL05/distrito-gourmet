<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuDegustacion;

// Gestión de menús degustación: administración de experiencias gastronómicas por pasos
class MenuDegustacionController extends Controller
{
    // Listar todos los menús degustación con sus platos asociados
    public function index()
    {
        return response()->json(MenuDegustacion::with('platos')->get());
    }

    // Crear una nueva experiencia de menú degustación y sincronizar sus platos
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'precio_maridaje' => 'nullable|numeric',
            'pasos' => 'required|integer',
            'duracion_estimada_minutos' => 'nullable|integer',
            'disponible' => 'boolean',
            'platos' => 'nullable|array',
        ]);

        $menu = MenuDegustacion::create($request->only([
            'nombre', 'descripcion', 'precio', 'precio_maridaje', 'pasos', 
            'duracion_estimada_minutos', 'disponible', 'slug'
        ]));
        
        if ($request->has('platos')) {
            $syncData = [];
            foreach ($request->platos as $p) {
                $syncData[$p['id']] = [
                    'numero_paso' => $p['pivot']['numero_paso'] ?? 1
                ];
            }
            $menu->platos()->sync($syncData);
        }

        return response()->json(['mensaje' => 'Menú degustación creado correctamente', 'menu' => $menu->load('platos')], 201);
    }

    // Actualizar la configuración y los platos de un menú degustación existente
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'precio_maridaje' => 'nullable|numeric',
            'pasos' => 'required|integer',
            'duracion_estimada_minutos' => 'nullable|integer',
            'disponible' => 'boolean',
            'platos' => 'nullable|array',
        ]);

        $menu = MenuDegustacion::findOrFail($id);
        $menu->update($request->only([
            'nombre', 'descripcion', 'precio', 'precio_maridaje', 'pasos', 
            'duracion_estimada_minutos', 'disponible', 'slug'
        ]));

        if ($request->has('platos')) {
            $syncData = [];
            foreach ($request->platos as $p) {
                $syncData[$p['id']] = [
                    'numero_paso' => $p['pivot']['numero_paso'] ?? 1
                ];
            }
            $menu->platos()->sync($syncData);
        }

        return response()->json(['mensaje' => 'Menú degustación actualizado correctamente', 'menu' => $menu->load('platos')]);
    }

    // Eliminar un menú degustación del sistema
    public function destroy($id)
    {
        MenuDegustacion::destroy($id);
        return response()->json(['mensaje' => 'Menú degustación eliminado correctamente']);
    }
}
