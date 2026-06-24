import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { AuthCard, Field } from './LoginPage.jsx'
import { authService } from '../services/authService.js'
import { errorMessage } from '../services/api.js'
import { useToast } from '../context/ToastContext.jsx'
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const nav = useNavigate()
  const submit = async (d) => {
    setBusy(true)
    try {
      await authService.register({ fullName: d.fullName, email: d.email, password: d.password })
      toast('Cuenta creada. Ya puedes iniciar sesión.')
      nav('/login')
    } catch (e) {
      toast(errorMessage(e, 'No se pudo crear la cuenta'), 'error')
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthCard title="Crea tu cuenta" subtitle="Tu próxima función está a unos pasos.">
      <form onSubmit={handleSubmit(submit)}>
        <Field label="Nombre completo" error={errors.fullName?.message}>
          <input
            autoComplete="name"
            {...register('fullName', {
              required: 'El nombre es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            })}
          />
        </Field>
        <Field label="Correo electrónico" error={errors.email?.message}>
          <input
            type="email"
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo no válido' },
            })}
          />
        </Field>
        <Field label="Contraseña" error={errors.password?.message}>
          <input
            type="password"
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
            })}
          />
        </Field>
        <Field label="Confirmar contraseña" error={errors.confirm?.message}>
          <input
            type="password"
            {...register('confirm', {
              required: 'Confirma tu contraseña',
              validate: (v) => v === watch('password') || 'Las contraseñas no coinciden',
            })}
          />
        </Field>
        <button className="button wide" disabled={busy}>
          {busy ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
      <p className="auth-switch">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </AuthCard>
  )
}
