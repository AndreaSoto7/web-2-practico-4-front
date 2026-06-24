export const money = (value) =>
  new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(Number(value || 0))
export const dateTime = (value) =>
  value
    ? new Intl.DateTimeFormat('es-BO', { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(value),
      )
    : '—'
export const toLocalInput = (value) => {
  if (!value) return ''
  const d = new Date(value)
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}
export const asArray = (value) => (Array.isArray(value) ? value : value?.data || value?.items || [])
