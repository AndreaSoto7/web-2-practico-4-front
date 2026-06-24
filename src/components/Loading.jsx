export default function Loading({ full = false, text = 'Cargando…' }) {
  return (
    <div className={full ? 'state full' : 'state'}>
      <span className="spinner" />
      {text}
    </div>
  )
}
