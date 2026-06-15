<?php

namespace App\Services;

use App\Models\Reserva;
use App\Models\Usuario;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class DiscordReservationNotifier
{
    public function notify(Reserva $reserva, ?Usuario $usuario): void
    {
        $webhookUrl = config('services.discord.reservation_webhook_url');

        if (! $webhookUrl) {
            return;
        }

        try {
            $request = Http::timeout(2);

            if (! config('services.discord.verify_ssl')) {
                $request = $request->withoutVerifying();
            }

            $request->post($webhookUrl, [
                'username' => 'Distrito Gourmet Reservas',
                'embeds' => [[
                    'title' => 'Nueva reserva en Distrito Gourmet',
                    'color' => 12951641,
                    'fields' => [
                        ['name' => 'Cliente', 'value' => $usuario?->nombre ?: 'No indicado', 'inline' => true],
                        ['name' => 'Telefono', 'value' => $usuario?->telefono ?: 'No indicado', 'inline' => true],
                        ['name' => 'Email', 'value' => $usuario?->email ?: 'No indicado', 'inline' => true],
                        ['name' => 'Fecha', 'value' => (string) $reserva->fecha_reserva, 'inline' => true],
                        ['name' => 'Hora', 'value' => (string) $reserva->hora_reserva, 'inline' => true],
                        ['name' => 'Comensales', 'value' => (string) $reserva->comensales, 'inline' => true],
                        ['name' => 'Estado', 'value' => (string) $reserva->estado, 'inline' => true],
                        ['name' => 'Codigo', 'value' => $reserva->codigo_reserva ?: (string) $reserva->id, 'inline' => true],
                        ['name' => 'Comentarios', 'value' => $reserva->peticiones_especiales ?: 'Sin comentarios', 'inline' => false],
                    ],
                    'footer' => ['text' => 'Distrito Gourmet'],
                    'timestamp' => now()->toIso8601String(),
                ]],
            ]);
        } catch (Throwable $exception) {
            Log::warning('No se pudo notificar la reserva a Discord.', [
                'reserva_id' => $reserva->id,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
