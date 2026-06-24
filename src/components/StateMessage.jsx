export default function StateMessage({ title, children, action }) {
  return (
    <div className="state-card">
      <div className="state-icon">◇</div>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
