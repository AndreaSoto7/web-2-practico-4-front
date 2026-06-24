import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AdminPage, FormField } from './AdminMoviesPage.jsx'
import Modal from '../../components/Modal.jsx'
import Loading from '../../components/Loading.jsx'
import StateMessage from '../../components/StateMessage.jsx'
import { cinemaService } from '../../services/cinemaService.js'
import { errorMessage } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import { asArray, dateTime, money, toLocalInput } from '../../utils/format.js'
export default function AdminShowsPage() {
  const [items, setItems] = useState([]),
    [movies, setMovies] = useState([]),
    [rooms, setRooms] = useState([]),
    [editing, setEditing] = useState(null),
    [open, setOpen] = useState(false),
    [loading, setLoading] = useState(true)
  const toast = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const load = async () => {
    try {
      const [f, p, s] = await Promise.all([
        cinemaService.shows(),
        cinemaService.movies(),
        cinemaService.rooms(),
      ])
      setItems(asArray(f))
      setMovies(asArray(p))
      setRooms(asArray(s))
    } catch (e) {
      toast(errorMessage(e), 'error')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])
  const show = (x) => {
    setEditing(x || null)
    reset(
      x
        ? {
            peliculaId: x.pelicula?.id || x.peliculaId,
            salaId: x.sala?.id || x.salaId,
            fechaHora: toLocalInput(x.fechaHora),
            precio: x.precio,
          }
        : { peliculaId: '', salaId: '', fechaHora: '', precio: '' },
    )
    setOpen(true)
  }
  const save = async (d) => {
    try {
      await cinemaService.saveShow(editing?.id, {
        peliculaId: Number(d.peliculaId),
        salaId: Number(d.salaId),
        fechaHora: new Date(d.fechaHora).toISOString(),
        precio: Number(d.precio),
      })
      toast(editing ? 'Función actualizada' : 'Función creada')
      setOpen(false)
      load()
    } catch (e) {
      toast(
        errorMessage(e, 'No se pudo guardar. Revisa si el horario se superpone con otra función.'),
        'error',
      )
    }
  }
  const remove = async (x) => {
    if (!confirm('¿Eliminar esta función?')) return
    try {
      await cinemaService.deleteShow(x.id)
      toast('Función eliminada')
      load()
    } catch (e) {
      toast(errorMessage(e), 'error')
    }
  }
  return (
    <AdminPage title="Funciones" onNew={() => show()}>
      {loading ? (
        <Loading />
      ) : !items.length ? (
        <StateMessage title="No hay funciones programadas" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Película</th>
                <th>Sala</th>
                <th>Fecha y hora</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td>
                    <strong>
                      {x.pelicula?.titulo ||
                        movies.find((p) => p.id === x.peliculaId)?.titulo ||
                        x.peliculaId}
                    </strong>
                  </td>
                  <td>
                    {x.sala?.nombre || rooms.find((s) => s.id === x.salaId)?.nombre || x.salaId}
                  </td>
                  <td>{dateTime(x.fechaHora)}</td>
                  <td>{money(x.precio)}</td>
                  <td className="actions">
                    <button onClick={() => show(x)}>Editar</button>
                    <button className="danger-link" onClick={() => remove(x)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {open && (
        <Modal title={editing ? 'Editar función' : 'Nueva función'} onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit(save)}>
            <FormField label="Película" error={errors.peliculaId}>
              <select {...register('peliculaId', { required: true })}>
                <option value="">Selecciona una película</option>
                {movies.map((x) => (
                  <option value={x.id} key={x.id}>
                    {x.titulo}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Sala" error={errors.salaId}>
              <select {...register('salaId', { required: true })}>
                <option value="">Selecciona una sala</option>
                {rooms.map((x) => (
                  <option value={x.id} key={x.id}>
                    {x.nombre} ({x.filas * x.columnas})
                  </option>
                ))}
              </select>
            </FormField>
            <div className="form-grid">
              <FormField label="Fecha y hora" error={errors.fechaHora}>
                <input
                  type="datetime-local"
                  {...register('fechaHora', {
                    required: true,
                    validate: (v) => new Date(v) > new Date() || 'Debe ser futura',
                  })}
                />
              </FormField>
              <FormField label="Precio (Bs)" error={errors.precio}>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  {...register('precio', { required: true, min: 0.01 })}
                />
              </FormField>
            </div>
            <button className="button wide" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : 'Guardar función'}
            </button>
          </form>
        </Modal>
      )}
    </AdminPage>
  )
}
