import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import AdminNav from '../../components/AdminNav.jsx'
import Modal from '../../components/Modal.jsx'
import Loading from '../../components/Loading.jsx'
import StateMessage from '../../components/StateMessage.jsx'
import { cinemaService } from '../../services/cinemaService.js'
import { errorMessage, posterUrl } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import { asArray } from '../../utils/format.js'
const empty = { titulo: '', sinopsis: '', genero: '', duracion: '', clasificacion: 'Todo público' }
export default function AdminMoviesPage() {
  const [items, setItems] = useState([]),
    [editing, setEditing] = useState(null),
    [open, setOpen] = useState(false),
    [loading, setLoading] = useState(true)
  const toast = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: empty })
  const load = () =>
    cinemaService
      .movies()
      .then((r) => setItems(asArray(r)))
      .catch((e) => toast(errorMessage(e), 'error'))
      .finally(() => setLoading(false))
  useEffect(() => {
    load()
  }, [])
  const showForm = (item) => {
    setEditing(item || null)
    reset(item || empty)
    setOpen(true)
  }
  const save = async (d) => {
    const fd = new FormData()
    ;['titulo', 'sinopsis', 'genero', 'duracion', 'clasificacion'].forEach((k) =>
      fd.append(k, k === 'duracion' ? String(Number(d[k])) : d[k]),
    )
    if (d.imagen?.[0]) fd.append('imagen', d.imagen[0])
    try {
      await cinemaService.saveMovie(editing?.id, fd)
      toast(editing ? 'Película actualizada' : 'Película creada')
      setOpen(false)
      load()
    } catch (e) {
      toast(errorMessage(e), 'error')
    }
  }
  const remove = async (item) => {
    if (!confirm(`¿Eliminar “${item.titulo}”? Esta acción no se puede deshacer.`)) return
    try {
      await cinemaService.deleteMovie(item.id)
      toast('Película eliminada')
      load()
    } catch (e) {
      toast(errorMessage(e), 'error')
    }
  }
  return (
    <AdminPage title="Películas" onNew={() => showForm()}>
      {loading ? (
        <Loading />
      ) : !items.length ? (
        <StateMessage title="No hay películas registradas" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Póster</th>
                <th>Título</th>
                <th>Género</th>
                <th>Duración</th>
                <th>Clasificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td>
                    <img className="thumb" src={posterUrl(x)} alt="" />
                  </td>
                  <td>
                    <strong>{x.titulo}</strong>
                  </td>
                  <td>{x.genero}</td>
                  <td>{x.duracion} min</td>
                  <td>{x.clasificacion}</td>
                  <td className="actions">
                    <button onClick={() => showForm(x)}>Editar</button>
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
        <Modal
          title={editing ? 'Editar película' : 'Nueva película'}
          onClose={() => setOpen(false)}
        >
          <form onSubmit={handleSubmit(save)}>
            <FormField label="Título" error={errors.titulo}>
              <input {...register('titulo', { required: true })} />
            </FormField>
            <FormField label="Sinopsis" error={errors.sinopsis}>
              <textarea rows="4" {...register('sinopsis', { required: true })} />
            </FormField>
            <div className="form-grid">
              <FormField label="Género" error={errors.genero}>
                <input {...register('genero', { required: true })} />
              </FormField>
              <FormField label="Duración (min)" error={errors.duracion}>
                <input
                  type="number"
                  min="1"
                  {...register('duracion', { required: true, min: 1 })}
                />
              </FormField>
            </div>
            <FormField label="Clasificación">
              <select {...register('clasificacion')}>
                <option>Todo público</option>
                <option>+14</option>
                <option>R</option>
              </select>
            </FormField>
            <FormField
              label={`Póster ${editing ? '(opcional)' : '(archivo)'}`}
              error={errors.imagen}
            >
              <input
                type="file"
                accept="image/*"
                {...register('imagen', {
                  validate: (v) => editing || v?.length > 0 || 'Selecciona una imagen',
                })}
              />
            </FormField>
            <button className="button wide" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : 'Guardar película'}
            </button>
          </form>
        </Modal>
      )}
    </AdminPage>
  )
}
export function AdminPage({ title, onNew, children }) {
  return (
    <div className="container section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Administración</p>
          <h1>{title}</h1>
        </div>
        {onNew && (
          <button className="button" onClick={onNew}>
            + Nuevo
          </button>
        )}
      </div>
      <AdminNav />
      {children}
    </div>
  )
}
export function FormField({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">Este campo es obligatorio o no es válido.</small>}
    </label>
  )
}
