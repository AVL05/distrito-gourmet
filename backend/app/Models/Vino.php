<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vino extends Model
{
    use HasFactory;

    protected $table = 'vinos';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'region',
        'uva',
        'tipo',
        'notas_maridaje',
        'descripcion',
        'precio_botella',
        'precio_copa',
        'disponible',
        'destacado',
        'maximo_por_pedido'
    ];
}
