<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reserva extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'reservas';
    const CREATED_AT = 'creado_a';
    const UPDATED_AT = 'actualizado_a';
    const DELETED_AT = 'eliminado_a';

    protected $fillable = [
        'usuario_id',
        'codigo_reserva',
        'fecha_reserva',
        'hora_reserva',
        'comensales',
        'menu_degustacion_id',
        'estado',
        'peticiones_especiales'
    ];

    // Relación con el usuario que ha realizado la reserva
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
