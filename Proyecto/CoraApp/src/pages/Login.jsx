import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Divider } from '../components/common/index'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      const profile = await login(data.email, data.password)
      if (profile?.role === 'admin') navigate('/admin')
      else if (profile?.role === 'psychologist') navigate('/psicologo/dashboard')
      else navigate('/paciente/dashboard')
    } catch (err) {
      const msg = err.message?.includes('Invalid login')
        ? 'Email o contraseña incorrectos'
        : err.message?.includes('Email not confirmed')
        ? 'Revisá tu email para confirmar tu cuenta'
        : err.message || 'Error al iniciar sesión'
      setError('root', { message: msg })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-cora relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        <div className="relative text-white max-w-md">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold">Cora</span>
          </div>
          <h2 className="text-4xl font-black mb-6 leading-tight">
            Tu bienestar mental, <br />nuestra prioridad
          </h2>
          <div className="space-y-4">
            {[
              '✓ Psicólogos certificados y verificados',
              '✓ Sesiones por video, audio o chat',
              '✓ Privacidad total — zero ads',
              '✓ Cancelación en cualquier momento',
            ].map(item => (
              <p key={item} className="text-teal-100 text-sm">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-surface-950">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-cora flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">Cora</span>
          </Link>

          <h1 className="text-3xl font-black text-surface-900 dark:text-white mb-2">Bienvenido de vuelta</h1>
          <p className="text-surface-500 mb-8">Ingresá a tu cuenta para continuar</p>



          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="maria@email.com"
              error={errors.email?.message}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              rightIcon={
                <button type="button" onClick={() => setShowPass(!showPass)} className="hover:text-surface-600 transition-colors">
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              }
              {...register('password')}
            />

            {errors.root && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                {errors.root.message}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-surface-500 cursor-pointer">
                <input type="checkbox" className="rounded border-surface-300 text-teal-600 focus:ring-teal-500" />
                Recordarme
              </label>
              <Link to="/recuperar-password" className="text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Iniciar sesión
            </Button>
          </form>

          <Divider label="o" className="my-6" />

          <p className="text-center text-sm text-surface-500">
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
              Registrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
