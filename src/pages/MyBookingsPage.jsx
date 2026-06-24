import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Loading from '../components/Loading.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { cinemaService } from '../services/cinemaService.js'
import { errorMessage } from '../services/api.js'
import { asArray, dateTime, money } from '../utils/format.js'
export default function MyBookingsPage() {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('')
  useEffect(() => {
    cinemaService
      .myBookings()
      .then((r) => setItems(asArray(r)))
      .catch((e) => setError(errorMessage(e, 'No se pudieron cargar tus reservas')))
      .finally(() => setLoading(false))
  }, [])
  return (
    <div className="container section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Tu historial</p>
          <h1>Mis reservas</h1>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <StateMessage title="No pudimos cargar tus reservas">{error}</StateMessage>
      ) : !items.length ? (
        <StateMessage
          title="Aún no tienes reservas"
          action={
            <Link to="/" className="button">
              Ver cartelera
            </Link>
          }
        >
          Elige una película y asegura tus asientos.
        </StateMessage>
      ) : (
        <div className="booking-list">
          {items.map((r) => {
            const show = r.funcion || r
            const seats = asArray(r.asientos)
            return (
              <article className="booking-ticket" key={r.id}>
                <div>
                  <p className="eyebrow">Reserva #{r.id}</p>
                  <h2>{show.pelicula?.titulo || r.pelicula?.titulo || 'Película'}</h2>
                  <p>
                    {dateTime(show.fechaHora)} · {show.sala?.nombre || r.sala?.nombre || 'Sala'}
                  </p>
                </div>
                <div>
                  <span>Asientos</span>
                  <strong>
                    {seats
                      .map((s) => `${String.fromCharCode(64 + Number(s.fila))}${s.columna}`)
                      .join(', ') || '—'}
                  </strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>{money(r.total ?? r.precioTotal)}</strong>
                </div>
                <div>
                  <span>Estado</span>
                  <strong className="status">{r.estado || 'confirmada'}</strong>
                </div>
                <small>Reservada: {dateTime(r.createdAt || r.fechaReserva)}</small>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
