<?php

namespace App\Http\Resources;

use App\Services\RestaurantSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'codigo_reserva' => $this->codigo_reserva,
            'fecha_reserva' => $this->fecha_reserva,
            'hora_reserva' => $this->hora_reserva,
            'comensales' => $this->comensales,
            'estado' => $this->estado,
            'puede_cancelar' => $this->estado !== 'Cancelada' && RestaurantSchedule::isFuture($this->fecha_reserva, $this->hora_reserva),
            'peticiones_especiales' => $this->peticiones_especiales,
            'creado_a' => $this->creado_a,
            'usuario' => $this->whenLoaded('usuario', fn () => [
                'id' => $this->usuario->id,
                'nombre' => $this->usuario->nombre,
                'email' => $this->usuario->email,
                'telefono' => $this->usuario->telefono,
            ]),
        ];
    }
}
