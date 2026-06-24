import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AdminPage, FormField } from './AdminMoviesPage.jsx'
import Modal from '../../components/Modal.jsx'
import Loading from '../../components/Loading.jsx'
import StateMessage from '../../components/StateMessage.jsx'
import { cinemaService } from '../../services/cinemaService.js'
import { errorMessage } from '../../services/api.js'
import { useToast } from '../../context/ToastContext.jsx'
import { asArray } from '../../utils/format.js'
export default function AdminRoomsPage() {
  const [items, setItems] = useState([]),
    [editing, setEditing] = useState(null),
    [open, setOpen] = useState(false),
    [loading, setLoading] = useState(true)
  const toast = useToast()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()
  const load = () =>
    cinemaService
      .rooms()
      .then((r) => setItems(asArray(r)))
      .catch((e) => toast(errorMessage(e), 'error'))
      .finally(() => setLoading(false))
  useEffect(() => {
    load()
  }, [])
  const show = (x) => {
    setEditing(x || null)
    reset(x || { nombre: '', filas: 8, columnas: 10 })
    setOpen(true)
  }
  const save = async (d) => {
    try {
      await cinemaService.saveRoom(editing?.id, {
        nombre: d.nombre,
        filas: Number(d.filas),
        columnas: Number(d.columnas),
      })
      toast(editing ? 'Sala actualizada' : 'Sala creada')
      setOpen(false)
      load()
    } catch (e) {
      toast(errorMessage(e), 'error')
    }
  }
  const remove = async (x) => {
    if (!confirm(`¿Eliminar ${x.nombre}?`)) return
    try {
      await cinemaService.deleteRoom(x.id)
      toast('Sala eliminada')
      load()
    } catch (e) {
      toast(errorMessage(e), 'error')
    }
  }
  return (
    <AdminPage title="Salas" onNew={() => show()}>
      {loading ? (
        <Loading />
      ) : !items.length ? (
        <StateMessage title="No hay salas registradas" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Filas</th>
                <th>Columnas</th>
                <th>Capacidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td>
                    <strong>{x.nombre}</strong>
                  </td>
                  <td>{x.filas}</td>
                  <td>{x.columnas}</td>
                  <td>{x.filas * x.columnas} asientos</td>
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
        <Modal title={editing ? 'Editar sala' : 'Nueva sala'} onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit(save)}>
            <FormField label="Nombre" error={errors.nombre}>
              <input {...register('nombre', { required: true })} />
            </FormField>
            <div className="form-grid">
              <FormField label="Filas" error={errors.filas}>
                <input type="number" min="1" {...register('filas', { required: true, min: 1 })} />
              </FormField>
              <FormField label="Columnas" error={errors.columnas}>
                <input
                  type="number"
                  min="1"
                  {...register('columnas', { required: true, min: 1 })}
                />
              </FormField>
            </div>
            <p className="capacity">
              Capacidad:{' '}
              <strong>
                {Number(watch('filas') || 0) * Number(watch('columnas') || 0)} asientos
              </strong>
            </p>
            <button className="button wide" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : 'Guardar sala'}
            </button>
          </form>
        </Modal>
      )}
    </AdminPage>
  )
}
