import { Link } from 'react-router'
import { posterUrl } from '../services/api.js'
export default function MovieCard({ movie }) {
  return (
    <article className="movie-card">
      <Link to={`/peliculas/${movie.id}`} className="poster-wrap">
        <img
          src={posterUrl(movie)}
          alt={`Póster de ${movie.titulo}`}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.classList.add('poster-fallback')
          }}
        />
        <span className="rating">{movie.clasificacion}</span>
      </Link>
      <div className="movie-info">
        <p className="eyebrow">{movie.genero}</p>
        <h2>{movie.titulo}</h2>
        <p className="muted">◷ {movie.duracion} min</p>
        <Link className="text-link" to={`/peliculas/${movie.id}`}>
          Ver funciones →
        </Link>
      </div>
    </article>
  )
}
