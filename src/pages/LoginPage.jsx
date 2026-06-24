import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { errorMessage } from '../services/api.js'
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [busy, setBusy] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const location = useLocation()
  const submit = async (d) => {
    setBusy(true)
    try {
      const user = await login(d)
      toast('Bienvenido de nuevo')
      nav(location.state?.from?.pathname || (user?.role === 'admin' ? '/admin' : '/'), {
        replace: true,
      })
    } catch (e) {
      toast(errorMessage(e, 'Credenciales incorrectas'), 'error')
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthCard title="Bienvenido de nuevo" subtitle="Ingresa para reservar tus asientos.">
      <form onSubmit={handleSubmit(submit)}>
        <Field label="Correo electrónico" error={errors.email?.message}>
          <input
            type="email"
            autoComplete="email"
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Ingresa un correo válido' },
            })}
          />
        </Field>
        <Field label="Contraseña" error={errors.password?.message}>
          <input
            type="password"
            autoComplete="current-password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
          />
        </Field>
        <button className="button wide" disabled={busy}>
          {busy ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
      <p className="auth-switch">
        ¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </AuthCard>
  )
}
export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-page">
      <section className="auth-card">
        <Link to="/" className="brand centered">
          ◉ CINE<span>NOVA</span>
        </Link>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </section>
    </div>
  )
}
export function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  )
}
