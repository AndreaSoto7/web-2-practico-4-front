import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import Loading from '../components/Loading.jsx'
import StateMessage from '../components/StateMessage.jsx'
import { cinemaService } from '../services/cinemaService.js'
import { errorMessage, posterUrl } from '../services/api.js'
import { asArray, dateTime, money } from '../utils/format.js'

export default function MovieDetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null),
    [shows, setShows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('')
  useEffect(() => {
    ;(async () => {
      try {
        const [m, s] = await Promise.all([
          cinemaService.movie(id),
          cinemaService.shows({ peliculaId: id }),
        ])
        setMovie(m)
        setShows(asArray(s))
      } catch (e) {
        setError(errorMessage(e, 'No se pudo cargar la película'))
      } finally {
        setLoading(false)
      }
    })()
  }, [id])
  if (loading) return <Loading full />
  if (error || !movie)
    return (
      <div className="container section">
        <StateMessage title="Película no disponible">{error}</StateMessage>
      </div>
    )
  return (
    <div className="container section">
      <Link to="/" className="back-link">
        ← Volver a cartelera
      </Link>
      <section className="movie-detail">
        <div className="detail-poster">
          <img src={posterUrl(movie)} alt={`Póster de ${movie.titulo}`} />
        </div>
        <div>
          <p className="eyebrow">{movie.genero}</p>
          <h1>{movie.titulo}</h1>
          <div className="chips">
            <span>{movie.clasificacion}</span>
            <span>{movie.duracion} min</span>
          </div>
          <p className="synopsis">{movie.sinopsis}</p>
          <h2>Próximas funciones</h2>
          {shows.length ? (
            <div className="show-list">
              {shows.map((show) => (
                <article className="show-row" key={show.id}>
                  <div>
                    <strong>{dateTime(show.fechaHora)}</strong>
                    <span>{show.sala?.nombre || show.salaNombre || `Sala ${show.salaId}`}</span>
                  </div>
                  <b>{money(show.precio)}</b>
                  <Link className="button" to={`/reservar/${show.id}`}>
                    Elegir asientos
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <StateMessage title="Sin funciones próximas">
              Vuelve pronto para consultar nuevos horarios.
            </StateMessage>
          )}
        </div>
      </section>
    </div>
  )
}
