<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mesa extends Model
{
    use HasFactory;

    protected $table = 'mesas';
    const CREATED_AT = 'creado_a';
    const UPDATED_AT = 'actualizado_a';

    protected $fillable = [
        'numero_mesa',
        'capacidad',
        'zona',
        'estado',
        'esta_activo'
    ];
}
