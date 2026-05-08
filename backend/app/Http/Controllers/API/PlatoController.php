<?php
// Gestión de la carta: administración de platos, categorías, vinos y menús degustación

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Plato;
use App\Models\CategoriaMenu;
use App\Models\Vino;
use App\Models\Bebida;
use App\Models\MenuDegustacion;

class PlatoController extends Controller
{
    // Listar todos los elementos de la carta (platos, vinos, bebidas, etc.)
    public function index()
    {
        $platos = Plato::with('categoria')->get();
        $categorias = CategoriaMenu::orderBy('orden_visualizacion')->get();
        $vinos = Vino::all();
        $bebidas = Bebida::all();
        $menusDegustacion = MenuDegustacion::with('platos')->get();

        return response()->json([
            'categorias' => $categorias,
            'platos' => $platos,
            'vinos' => $vinos,
            'bebidas' => $bebidas,
            'menus_degustacion' => $menusDegustacion,
        ]);
    }

    // Registrar un nuevo plato en el sistema
    public function store(Request $request)
    {
        // Validar datos del plato
        $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'categoria_menu_id' => 'required|integer|exists:categorias_menu,id',
            'alergenos' => 'nullable|string',
            'disponible' => 'boolean',
            'slug' => 'nullable|string',
            'visible_en_carta' => 'boolean',
            'visible_en_degustacion' => 'boolean',
            'disponible_para_llevar' => 'boolean',
            'es_por_unidad' => 'boolean',
            'maximo_por_pedido' => 'nullable|integer',
        ]);

        $plato = Plato::create($request->all());
        return response()->json(['mensaje' => 'Plato creado correctamente', 'plato' => $plato->load('categoria')], 201);
    }

    // Obtener detalles de un plato específico
    public function show($id)
    {
        return response()->json(Plato::with('categoria')->findOrFail($id));
    }

    // Actualizar la información técnica de un plato existente
    public function update(Request $request, $id)
    {
        $plato = Plato::findOrFail($id);

        // Validar datos actualizados
        $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric',
            'categoria_menu_id' => 'required|integer|exists:categorias_menu,id',
            'alergenos' => 'nullable|string',
            'disponible' => 'boolean',
            'slug' => 'nullable|string',
            'visible_en_carta' => 'boolean',
            'visible_en_degustacion' => 'boolean',
            'disponible_para_llevar' => 'boolean',
            'es_por_unidad' => 'boolean',
            'maximo_por_pedido' => 'nullable|integer',
        ]);

        $plato->update($request->all());
        return response()->json(['mensaje' => 'Plato actualizado correctamente', 'plato' => $plato->load('categoria')]);
    }

    // Eliminar un plato del registro permanente
    public function destroy($id)
    {
        $plato = Plato::findOrFail($id);
        $plato->delete();
        return response()->json(['mensaje' => 'Plato eliminado correctamente']);
    }
}
