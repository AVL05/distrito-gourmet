<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetallePedido extends Model
{
    use HasFactory;

    protected $table = 'detalles_pedido';
    const CREATED_AT = 'creado_a';
    const UPDATED_AT = 'actualizado_a';

    protected $fillable = [
        'pedido_id',
        'plato_id',
        'vino_id',
        'bebida_id',
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
}
