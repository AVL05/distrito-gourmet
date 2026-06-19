<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlatoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'nombre'                  => $this->nombre,
            'slug'                    => $this->slug,
            'descripcion'             => $this->descripcion,
            'precio'                  => (float) $this->precio,
            'alergenos'               => $this->alergenos,
            'disponible'              => (bool) $this->disponible,
            'visible_en_carta'        => (bool) $this->visible_en_carta,
            'visible_en_degustacion'  => (bool) $this->visible_en_degustacion,
            'disponible_para_llevar'  => (bool) $this->disponible_para_llevar,
            'es_por_unidad'           => (bool) $this->es_por_unidad,
            'maximo_por_pedido'       => $this->maximo_por_pedido,
            'categoria'               => $this->whenLoaded('categoria', fn () => [
                'id'     => $this->categoria->id,
                'nombre' => $this->categoria->nombre,
            ]),
        ];
    }
}
