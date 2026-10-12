<?php

return [
    'capacity' => 44,
    'booking_days' => 60,
    'closed_dates' => array_values(array_filter(array_map('trim', explode(',', env('RESTAURANT_CLOSED_DATES', ''))))),
    'services' => [
        'lunch' => ['days' => [2, 3, 4, 5, 6, 7], 'reservations' => ['13:30', '14:00', '14:30'], 'pickup' => ['13:30', '14:00', '14:30', '15:00', '15:30']],
        'dinner' => ['days' => [2, 3, 4, 5, 6], 'reservations' => ['20:30', '21:00', '21:30'], 'pickup' => ['20:30', '21:00', '21:30', '22:00', '22:30']],
    ],
];
