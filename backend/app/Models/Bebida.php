<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Modelo para la gestión de bebidas (refrescos, cafés y cócteles) en el catálogo
class Bebida extends Model
{
    use HasFactory;

    protected $table = 'bebidas';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
        'tipo',
        'precio',
        'disponible',
        'destacado'
    ];
}
