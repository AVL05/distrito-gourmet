<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Modelo de reserva de mesa
class Reservation extends Model
{
    protected $fillable = ['user_id', 'restaurant_table_id', 'reservation_time', 'people', 'status', 'experience_type', 'special_requests', 'allergies_noted'];

    // Relación: cada reserva pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
