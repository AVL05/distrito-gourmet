<?php

namespace App\Http\Requests;

use App\Services\ReservationRules;
use App\Services\RestaurantSchedule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservaRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('hora_reserva')) {
            $this->merge([
                'hora_reserva' => ReservationRules::normalizeTime($this->input('hora_reserva')),
            ]);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fecha_reserva' => 'required|date_format:Y-m-d|after_or_equal:today',
            'hora_reserva' => ['required', Rule::in(array_map(fn ($time) => ReservationRules::normalizeTime($time),
                preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $this->fecha_reserva) ? RestaurantSchedule::times($this->fecha_reserva) : []))],
            'comensales' => 'required|integer|min:1|max:8',
            'peticiones_especiales' => 'nullable|string|max:500',
        ];
    }
}
