<?php

namespace App\Http\Requests;

use App\Services\ReservationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fecha_reserva'         => 'required|date|after_or_equal:today',
            'hora_reserva'          => ['required', Rule::in(ReservationRules::TURNS)],
            'comensales'            => 'required|integer|min:1|max:8',
            'peticiones_especiales' => 'nullable|string|max:500',
        ];
    }
}
