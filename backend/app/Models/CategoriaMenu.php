<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaMenu extends Model
{
    use HasFactory;

    protected $table = 'categorias_menu';
    const CREATED_AT = 'creado_a';
    const UPDATED_AT = 'actualizado_a';

    protected $fillable = [
        'nombre',
        'descripcion',
        'orden_visualizacion'
    ];

    public function platos()
    {
        return $this->hasMany(Plato::class, 'categoria_menu_id');
    }
}
