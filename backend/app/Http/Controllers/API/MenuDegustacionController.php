<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuDegustacion;

class MenuDegustacionController extends Controller
{
    public function index()
    {
        return response()->json(MenuDegustacion::with('platos')->get());
    }

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

    public function destroy($id)
    {
        MenuDegustacion::destroy($id);
        return response()->json(['mensaje' => 'Menú degustación eliminado correctamente']);
    }
}
