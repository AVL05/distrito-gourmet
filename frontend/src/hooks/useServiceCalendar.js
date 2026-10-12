import { useEffect, useState } from 'react';
import api from '@/services/api';
import { IS_PUBLIC_DEMO } from '@/config/demo';

const demoCalendar = () => {
  const services = {
    lunch: { days: [2, 3, 4, 5, 6, 7], reservations: ['13:30', '14:00', '14:30'], pickup: ['13:30', '14:00', '14:30', '15:00', '15:30'] },
    dinner: { days: [2, 3, 4, 5, 6], reservations: ['20:30', '21:00', '21:30'], pickup: ['20:30', '21:00', '21:30', '22:00', '22:30'] },
  };
  const days = Array.from({ length: 61 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const weekday = date.getDay() || 7;
    const open = Object.values(services).filter((service) => service.days.includes(weekday));
    return { date: date.toLocaleDateString('en-CA'), reservations: open.flatMap((service) => service.reservations), pickup: open.flatMap((service) => service.pickup) };
  });
  return { days, services, capacity: 44, timezone: 'Europe/Madrid' };
};

export const useServiceCalendar = () => {
  const [calendar, setCalendar] = useState(() => IS_PUBLIC_DEMO ? demoCalendar() : null);
  const [loading, setLoading] = useState(!IS_PUBLIC_DEMO);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (IS_PUBLIC_DEMO) return;
    let cancelled = false;
    api.get('/service-calendar').then(({ data }) => {
      if (!Array.isArray(data.days) || !data.services) throw new Error('Invalid calendar');
      if (!cancelled) { setCalendar(data); setError(''); }
    }).catch(() => { if (!cancelled) setError('No pudimos consultar el calendario de servicio.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt]);
  return { calendar, loading, error, retry: () => { setLoading(true); setAttempt((value) => value + 1); } };
};
