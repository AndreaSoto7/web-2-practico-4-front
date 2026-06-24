import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Loading from '../components/Loading.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { cinemaService } from '../services/cinemaService.js'
import { errorMessage } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
import { asArray, dateTime, money } from '../utils/format.js'

const keyOf = (seat) => `${Number(seat.fila)}-${Number(seat.columna)}`
export default function BookingPage() {
  const { funcionId } = useParams(),
    nav = useNavigate(),
    toast = useToast()
  const [show, setShow] = useState(null),
    [seats, setSeats] = useState([]),
    [selected, setSelected] = useState([]),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const load = async () => {
    setLoading(true)
    try {
      const [f, a] = await Promise.all([
        cinemaService.show(funcionId),
        cinemaService.seats(funcionId),
      ])
      setShow(f)
      const raw = asArray(a)
      const seatMatrix = raw.length ? raw : asArray(a?.asientos)
      setSeats(seatMatrix.flat())
    } catch (e) {
      setError(errorMessage(e, 'No se pudo cargar el mapa de asientos'))
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [funcionId])
  const normalized = useMemo(
    () =>
      seats.map((s) => ({
        ...s,
        fila: Number(s.fila),
        columna: Number(s.columna),
        occupied: Boolean(
          s.ocupado ?? s.reservado ?? (s.estado ? s.estado === 'ocupado' : s.disponible === false),
        ),
      })),
    [seats],
  )
  const rows = useMemo(() => {
    const map = {}
    normalized.forEach((s) => (map[s.fila] ??= []).push(s))
    Object.values(map).forEach((r) => r.sort((a, b) => a.columna - b.columna))
    return map
  }, [normalized])
  const toggle = (s) => {
    if (s.occupied) return
    const k = keyOf(s)
    setSelected((curr) =>
      curr.some((x) => keyOf(x) === k) ? curr.filter((x) => keyOf(x) !== k) : [...curr, s],
    )
  }
  const confirm = async () => {
    if (!selected.length) return
    setBusy(true)
    try {
      await cinemaService.book({
        funcionId: Number(funcionId),
        asientos: selected.map(({ fila, columna }) => ({ fila, columna })),
      })
      toast('Reserva confirmada. ¡Disfruta la función!')
      nav('/mis-reservas')
    } catch (e) {
      toast(errorMessage(e, 'Algún asiento dejó de estar disponible'), 'error')
      setSelected([])
      await load()
    } finally {
      setBusy(false)
    }
  }
  if (loading) return <Loading full />
  if (error)
    return (
      <div className="container section">
        <StateMessage title="No se pudo preparar tu reserva">{error}</StateMessage>
      </div>
    )
  return (
    <div className="container section booking-page">
      <Link className="back-link" to={`/peliculas/${show?.pelicula?.id || show?.peliculaId || ''}`}>
        ← Volver
      </Link>
      <div className="booking-layout">
        <section>
          <p className="eyebrow">Selección de asientos</p>
          <h1>{show?.pelicula?.titulo || 'Tu función'}</h1>
          <p className="muted">
            {dateTime(show?.fechaHora)} · {show?.sala?.nombre || `Sala ${show?.salaId}`}
          </p>
          <div className="screen">PANTALLA</div>
          <div className="seat-map">
            {Object.entries(rows).map(([row, list]) => (
              <div className="seat-row" key={row}>
                <b>{String.fromCharCode(64 + Number(row))}</b>
                {list.map((s) => {
                  const chosen = selected.some((x) => keyOf(x) === keyOf(s))
                  return (
                    <button
                      key={keyOf(s)}
                      title={`Fila ${s.fila}, asiento ${s.columna}`}
                      disabled={s.occupied}
                      className={`seat ${s.occupied ? 'occupied' : chosen ? 'selected' : ''}`}
                      onClick={() => toggle(s)}
                    >
                      {s.columna}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="seat-legend">
            <span>
              <i className="seat" />
              Disponible
            </span>
            <span>
              <i className="seat selected" />
              Seleccionado
            </span>
            <span>
              <i className="seat occupied" />
              Ocupado
            </span>
          </div>
        </section>
        <aside className="booking-summary">
          <h2>Resumen</h2>
          <p>
            Asientos{' '}
            <strong>
              {selected.length
                ? selected.map((s) => `${String.fromCharCode(64 + s.fila)}${s.columna}`).join(', ')
                : 'Ninguno'}
            </strong>
          </p>
          <p>
            Precio por asiento <strong>{money(show?.precio)}</strong>
          </p>
          <hr />
          <p className="total">
            Total <strong>{money(selected.length * Number(show?.precio || 0))}</strong>
          </p>
          <button className="button wide" disabled={!selected.length || busy} onClick={confirm}>
            {busy ? 'Confirmando…' : 'Confirmar reserva'}
          </button>
          <small>Tu selección se confirmará al completar la reserva.</small>
        </aside>
      </div>
    </div>
  )
}
