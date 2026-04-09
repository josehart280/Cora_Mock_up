import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'

const schema = z.object({
  firstName: z.string().min(2, 'Mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').regex(/[A-Z]/, 'Debe tener mayúscula').regex(/[0-9]/, 'Debe tener un número'),
  role: z.enum(['patient', 'psychologist']),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Debés aceptar los términos' }) }),
  acceptPrivacy: z.literal(true, { errorMap: () => ({ message: 'Debés aceptar la política' }) }),
})

export default function Register() {
  const navigate = useNavigate()
  const { register: registerUser, loading } = useAuthStore()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'patient' },
  })

  const role = watch('role')

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data)
      // Supabase may require email confirmation
      if (result?.user && !result.session) {
        // Email confirmation required
        navigate('/login', { state: { message: 'Revisá tu email para confirmar tu cuenta antes de iniciar sesión.' } })
      } else if (data.role === 'patient') {
        navigate('/quiz')
      } else {
        navigate('/psicologo/onboarding')
      }
    } catch (err) {
      console.error('Register error:', err)
      setError('root', { type: 'server', message: err.message || 'Error al conectar con el servidor.' })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sage-500 to-teal-600 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="relative text-white max-w-md">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
            </div>
            <span className="text-2xl font-bold">Cora</span>
          </div>
          <h2 className="text-4xl font-black mb-6 leading-tight">
            Empezá tu camino <br />al bienestar hoy
          </h2>
          <div className="space-y-6">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="font-semibold mb-1">🎯 Match personalizado</p>
              <p className="text-sm text-teal-100">Te conectamos con el terapeuta ideal basado en tus necesidades</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="font-semibold mb-1">⚡ Empezá en minutos</p>
              <p className="text-sm text-teal-100">Registro, quiz y primera sesión en menos de 24hs</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="font-semibold mb-1">🔒 Tu privacidad primero</p>
              <p className="text-sm text-teal-100">Cumplimos Ley 8968. Nunca vendemos tus datos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-surface-950 overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-cora flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
            </div>
            <span className="text-xl font-bold gradient-text">Cora</span>
          </Link>

          <h1 className="text-3xl font-black text-surface-900 dark:text-white mb-2">Creá tu cuenta</h1>
          <p className="text-surface-500 mb-8">Gratuito para empezar. Sin tarjeta requerida.</p>

          {/* Role toggle */}
          <div className="flex gap-2 p-1 bg-surface-100 dark:bg-surface-900 rounded-2xl mb-8">
            <label className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium text-center cursor-pointer transition-all ${role === 'patient' ? 'bg-white dark:bg-surface-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-surface-400 hover:text-surface-600'}`}>
              <input type="radio" value="patient" className="sr-only" {...register('role')} />
              🙋 Soy paciente
            </label>
            <label className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium text-center cursor-pointer transition-all ${role === 'psychologist' ? 'bg-white dark:bg-surface-800 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-surface-400 hover:text-surface-600'}`}>
              <input type="radio" value="psychologist" className="sr-only" {...register('role')} />
              👩‍⚕️ Soy psicólogo/a
            </label>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre" placeholder="María" error={errors.firstName?.message} {...register('firstName')} />
              <Input label="Apellido" placeholder="González" error={errors.lastName?.message} {...register('lastName')} />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="maria@email.com"
              error={errors.email?.message}
              leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type={showPass ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              error={errors.password?.message}
              hint="Debe tener mayúscula y número"
              rightIcon={
                <button type="button" onClick={() => setShowPass(!showPass)}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              }
              {...register('password')}
            />

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-0.5 rounded border-surface-300 text-teal-600 focus:ring-teal-500" {...register('acceptTerms')} />
                <span className="text-sm text-surface-500 group-hover:text-surface-700 dark:group-hover:text-surface-300 transition-colors">
                  Acepto los{' '}
                  <a href="#" className="text-teal-600 hover:underline font-medium">Términos y Condiciones</a>
                </span>
              </label>
              {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-0.5 rounded border-surface-300 text-teal-600 focus:ring-teal-500" {...register('acceptPrivacy')} />
                <span className="text-sm text-surface-500 group-hover:text-surface-700 dark:group-hover:text-surface-300 transition-colors">
                  Acepto la{' '}
                  <a href="#" className="text-teal-600 hover:underline font-medium">Política de Privacidad</a>
                </span>
              </label>
              {errors.acceptPrivacy && <p className="text-xs text-red-500">{errors.acceptPrivacy.message}</p>}
            </div>

            {errors.root && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50">
                {errors.root.message}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              {role === 'patient' ? 'Crear cuenta y empezar quiz' : 'Registrarme como psicólogo'}
            </Button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
