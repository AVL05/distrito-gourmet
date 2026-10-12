import { useServiceCalendar } from '@/hooks/useServiceCalendar';

const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
export default function ServiceHours() {
  const { calendar, loading, error, retry } = useServiceCalendar();
  if (loading) return <p role="status" className="text-sm">Consultando horarios…</p>;
  if (error) return <div className="text-sm"><p>Horario no disponible.</p><button type="button" className="underline min-h-11" onClick={retry}>Reintentar horario</button></div>;
  return <dl className="text-sm space-y-3 text-text-muted">
    {Object.entries(calendar.services).map(([name, service]) => <div key={name}>
      <dt className="font-semibold text-text-main">{name === 'lunch' ? 'Comidas' : 'Cenas'}</dt>
      <dd>{service.days.map((day) => dayNames[day - 1]).join(' · ')}<br />{service.pickup[0]}–{service.pickup.at(-1)}</dd>
    </div>)}
  </dl>;
}
