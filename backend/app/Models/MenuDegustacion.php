<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuDegustacion extends Model
{
    use HasFactory;

    protected $table = 'menus_degustacion';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'precio',
        'precio_maridaje',
        'pasos',
        'duracion_estimada_minutos',
        'disponible'
    ];

    public function platos()
    {
        return $this->belongsToMany(Plato::class, 'platos_menu_degustacion', 'menu_degustacion_id', 'plato_id')
            ->withPivot('numero_paso');
    }
}
