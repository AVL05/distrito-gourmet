<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlatoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre'                  => 'required|string|max:255',
            'descripcion'             => 'required|string',
            'precio'                  => 'required|numeric|min:0',
            'categoria_menu_id'       => 'required|integer|exists:categorias_menu,id',
            'alergenos'               => 'nullable|string',
            'slug'                    => 'nullable|string|max:255',
            'disponible'              => 'boolean',
            'visible_en_carta'        => 'boolean',
            'visible_en_degustacion'  => 'boolean',
            'disponible_para_llevar'  => 'boolean',
            'es_por_unidad'           => 'boolean',
            'maximo_por_pedido'       => 'nullable|integer|min:1',
        ];
    }
}
