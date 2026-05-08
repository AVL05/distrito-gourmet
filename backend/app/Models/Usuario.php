<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';
    public $timestamps = false;

    // Atributos asignables de forma masiva
    protected $fillable = [
        'nombre',
        'email',
        'password',
        'rol',
        'telefono',
    ];

    // Atributos ocultos en la serialización (como la contraseña)
    protected $hidden = [
        'password',
    ];

    // Conversión de tipos de atributos
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}
