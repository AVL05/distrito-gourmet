<?php
/**
 * @file DishController.php
 * @author Alex V. (DAW)
 * @date 2026-04-06
 * @description Controlador para gestionar los platos de la carta y el menú degustación del restaurante.
 */

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
    /**
     * @function index
     * @description Obtiene el listado completo de la carta, incluyendo categorías, platos, vinos, bebidas y menús degustación.
     */
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

    /**
     * @function store
     * @description Crea un nuevo plato validando los campos y vinculándolo a una categoría existente.
     */
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

    /**
     * @function show
     * @description Recupera la información detallada de un plato por ID.
     */
    public function show($id)
    {
        return response()->json(Plato::with('categoria')->findOrFail($id));
    }

    /**
     * @function update
     * @description Actualiza los datos de un plato existente tras validar las entradas.
     */
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

    /**
     * @function destroy
     * @description Elimina un plato del sistema de forma permanente.
     */
    public function destroy($id)
    {
        $plato = Plato::findOrFail($id);
        $plato->delete();
        return response()->json(['mensaje' => 'Plato eliminado correctamente']);
    }
}
