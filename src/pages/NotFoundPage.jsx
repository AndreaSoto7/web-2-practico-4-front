import { Link } from 'react-router'
import StateMessage from '../components/StateMessage.jsx'
export default function NotFoundPage() {
  return (
    <div className="container section">
      <StateMessage
        title="404 · Esta función no existe"
        action={
          <Link className="button" to="/">
            Volver a cartelera
          </Link>
        }
      >
        Parece que llegaste después de los créditos.
      </StateMessage>
    </div>
  )
}
