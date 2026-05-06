<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuDegustacion extends Model
{
    use HasFactory;

    protected $table = 'menus_degustacion';
    const CREATED_AT = 'creado_a';
    const UPDATED_AT = 'actualizado_a';

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'imagen',
        'precio',
        'precio_maridaje',
        'pasos',
        'duracion_estimada_minutos',
        'disponible',
        'alternativa_vegetariana',
        'menu_de_temporada'
    ];

    public function platos()
    {
        return $this->belongsToMany(Plato::class, 'platos_menu_degustacion', 'menu_degustacion_id', 'plato_id')
            ->withPivot('numero_paso', 'tamaño_porcion', 'notas');
    }
}
