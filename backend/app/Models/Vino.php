<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vino extends Model
{
    use HasFactory;

    protected $table = 'vinos';
    const CREATED_AT = 'creado_a';
    const UPDATED_AT = 'actualizado_a';

    protected $fillable = [
        'nombre',
        'bodega',
        'añada',
        'pais',
        'region',
        'uva',
        'tipo',
        'notas_maridaje',
        'descripcion',
        'imagen',
        'porcentaje_alcohol',
        'temperatura_servicio',
        'precio_botella',
        'precio_copa',
        'disponible',
        'destacado',
        'maximo_por_pedido'
    ];
}
