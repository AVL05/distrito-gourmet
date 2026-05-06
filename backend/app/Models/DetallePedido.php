<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetallePedido extends Model
{
    use HasFactory;

    protected $table = 'detalles_pedido';
    public $timestamps = false;

    protected $fillable = [
        'pedido_id',
        'plato_id',
        'vino_id',
        'bebida_id',
        'menu_degustacion_id',
        'cantidad',
        'precio_unitario',
        'precio_total'
    ];

    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }

    public function plato()
    {
        return $this->belongsTo(Plato::class, 'plato_id');
    }

    public function vino()
    {
        return $this->belongsTo(Vino::class, 'vino_id');
    }

    public function bebida()
    {
        return $this->belongsTo(Bebida::class, 'bebida_id');
    }

    public function menu_degustacion()
    {
        return $this->belongsTo(MenuDegustacion::class, 'menu_degustacion_id');
    }
}
