import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import api, { initializeCsrfProtection } from '@/services/api';
import { useAuthStore } from '@/store/auth';
import { IS_PUBLIC_DEMO } from '@/config/demo';
import { demoAdminData } from '@/data/demoAdmin';
import { getApiErrorMessage } from '@/utils/apiErrors';

export default function MyReservations() {
  const user = useAuthStore((state) => state.user);
  const [reservations, setReservations] = useState(() => IS_PUBLIC_DEMO ? demoAdminData.reservations : []);
  const [loading, setLoading] = useState(Boolean(user) && !IS_PUBLIC_DEMO);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(null);
  useEffect(() => {
    if (!user || IS_PUBLIC_DEMO) return;
    let cancelled = false;
    api.get('/reservations').then(({ data }) => {
      if (!Array.isArray(data.data)) throw new Error('Invalid reservations');
      if (!cancelled) { setReservations(data.data); setError(''); }
    }).catch(() => { if (!cancelled) setError('No pudimos cargar sus reservas.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, attempt]);

  const cancel = async (reservation) => {
    const result = await Swal.fire({ title: '¿Cancelar esta reserva?', text: `${reservation.fecha_reserva} · ${reservation.hora_reserva.slice(0, 5)} · ${reservation.comensales} personas`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Cancelar reserva', cancelButtonText: 'Conservar reserva', confirmButtonColor: 'var(--accent)' });
    if (!result.isConfirmed) return;
    setSaving(reservation.id);
    try {
      await initializeCsrfProtection();
      const { data } = await api.patch(`/reservations/${reservation.id}/cancel`);
      setReservations((current) => current.map((item) => item.id === reservation.id ? data.reserva : item));
      setError('');
    } catch (failure) { setError(getApiErrorMessage(failure, 'No pudimos cancelar la reserva.')); }
    finally { setSaving(null); }
  };

  if (!user) return <p>Inicie sesión para consultar sus reservas. <Link className="underline" to="/login" state={{ returnTo: '/reservations?tab=history' }}>Iniciar sesión</Link></p>;
  return <div className="space-y-5">
    {error && <div role="alert" className="border border-red-800/20 p-4 text-red-800"><p>{error}</p><button className="btn mt-3" onClick={() => { setLoading(true); setAttempt((value) => value + 1); }}>Reintentar</button></div>}
    {loading && <p role="status">Consultando sus reservas…</p>}
    {!loading && !error && reservations.length === 0 && <p className="border border-text-main/15 p-6">Aún no tiene reservas. <Link to="/reservations" className="underline">Reservar mesa</Link></p>}
    {IS_PUBLIC_DEMO && <p className="text-sm text-text-muted">Datos de ejemplo. La cancelación está desactivada en la demo.</p>}
    {reservations.map((reservation) => <article key={reservation.id} className="border border-text-main/15 bg-bg-surface p-5 sm:p-7 flex flex-wrap justify-between gap-5">
      <div>
        <h3 className="text-xl normal-case tracking-normal">{new Date(`${reservation.fecha_reserva}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {reservation.hora_reserva.slice(0, 5)}</h3>
        <p>{reservation.comensales} personas · {reservation.estado}</p>
        {reservation.estado === 'Pendiente' && <p className="text-sm mt-2">La reserva todavía no está confirmada. Consulte aquí su estado antes de acudir.</p>}
        <p className="text-sm text-text-muted">Código: {reservation.codigo_reserva || reservation.id}</p>
        {reservation.peticiones_especiales && <p className="text-sm text-text-muted mt-2">{reservation.peticiones_especiales}</p>}
      </div>
      {!IS_PUBLIC_DEMO && reservation.puede_cancelar && <button type="button" className="btn self-start" disabled={saving !== null} onClick={() => cancel(reservation)}>{saving === reservation.id ? 'Cancelando…' : 'Cancelar reserva'}</button>}
    </article>)}
  </div>;
}
