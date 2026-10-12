<?php

namespace App\Notifications;

use App\Models\Usuario;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RestaurantUpdate extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $subject, public string $reference, public string $details)
    {
        $this->afterCommit();
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)->subject($this->subject.' | Distrito Gourmet')
            ->greeting('Hola, '.$notifiable->nombre)->line($this->subject)
            ->line('Referencia: '.$this->reference)->line($this->details)
            ->action('Consultar mi cuenta', rtrim(config('app.frontend_url'), '/').'/dashboard');
    }

    public static function send(Usuario $user, string $subject, string $reference, string $details): void
    {
        try {
            $user->notify(new self($subject, $reference, $details));
        } catch (\Throwable $error) {
            // El fallo del correo no debe convertir una operación guardada en un error reintentable.
            report($error);
        }
    }
}
