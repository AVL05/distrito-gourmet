<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlatoRequest;
use App\Http\Requests\UpdatePlatoRequest;
use App\Http\Resources\PlatoResource;
use App\Models\Bebida;
use App\Models\CategoriaMenu;
use App\Models\MenuDegustacion;
use App\Models\Plato;
use App\Models\Vino;

class PlatoController extends Controller
{
    public function index()
    {
        $platos          = Plato::with('categoria')->get();
        $categorias      = CategoriaMenu::orderBy('orden_visualizacion')->get();
        $vinos           = Vino::all();
        $bebidas         = Bebida::all();
        $menusDegustacion = MenuDegustacion::with('platos')->get();

        return response()->json([
            'categorias'        => $categorias,
            'platos'            => PlatoResource::collection($platos),
            'vinos'             => $vinos,
            'bebidas'           => $bebidas,
            'menus_degustacion' => $menusDegustacion,
        ]);
    }

    public function store(StorePlatoRequest $request)
    {
        $plato = Plato::create($request->validated());

        return response()->json([
            'mensaje' => 'Plato creado correctamente',
            'plato'   => new PlatoResource($plato->load('categoria')),
        ], 201);
    }

    public function show($id)
    {
        return new PlatoResource(Plato::with('categoria')->findOrFail($id));
    }

    public function update(UpdatePlatoRequest $request, $id)
    {
        $plato = Plato::findOrFail($id);
        $plato->update($request->validated());

        return response()->json([
            'mensaje' => 'Plato actualizado correctamente',
            'plato'   => new PlatoResource($plato->load('categoria')),
        ]);
    }

    public function destroy($id)
    {
        Plato::findOrFail($id)->delete();

        return response()->json(['mensaje' => 'Plato eliminado correctamente']);
    }
}
