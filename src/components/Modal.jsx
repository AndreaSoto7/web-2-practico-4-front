export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  )
}
