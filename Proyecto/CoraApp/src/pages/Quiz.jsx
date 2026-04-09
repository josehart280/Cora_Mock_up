import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { Button } from '../components/common/Button'
import { ProgressBar } from '../components/common/index'
import { mockTherapists } from '../services/mockData'

const questions = [
  {
    id: 'type',
    title: '¿Qué tipo de terapia buscás?',
    subtitle: 'Podés cambiar esto más adelante',
    options: [
      { value: 'individual', label: 'Individual', icon: '🙋', desc: 'Para trabajar en ti mismo' },
      { value: 'couples', label: 'Parejas', icon: '👫', desc: 'Para mejorar tu relación' },
      { value: 'teen', label: 'Adolescentes', icon: '🧒', desc: 'Para menores de 18 (con consentimiento)' },
      { value: 'family', label: 'Familia', icon: '👨‍👩‍👧', desc: 'Para toda tu familia' },
    ],
  },
  {
    id: 'goals',
    title: '¿Qué te trae aquí?',
    subtitle: 'Seleccioná todo lo que aplique',
    multiple: true,
    options: [
      { value: 'anxiety', label: 'Ansiedad o estrés', icon: '😰' },
      { value: 'depression', label: 'Depresión o tristeza', icon: '😔' },
      { value: 'relationships', label: 'Problemas de relaciones', icon: '💔' },
      { value: 'trauma', label: 'Trauma o PTSD', icon: '🌩️' },
      { value: 'selfesteem', label: 'Autoestima', icon: '💪' },
      { value: 'grief', label: 'Duelo o pérdida', icon: '🌷' },
      { value: 'work', label: 'Estrés laboral', icon: '💼' },
      { value: 'other', label: 'Otro', icon: '✨' },
    ],
  },
  {
    id: 'therapist_gender',
    title: '¿Preferís algún género de terapeuta?',
    subtitle: 'No hay respuesta incorrecta',
    options: [
      { value: 'no_preference', label: 'Sin preferencia', icon: '✌️' },
      { value: 'female', label: 'Mujer', icon: '👩' },
      { value: 'male', label: 'Hombre', icon: '👨' },
      { value: 'nonbinary', label: 'No binario', icon: '🌈' },
    ],
  },
  {
    id: 'format',
    title: '¿Cómo preferís las sesiones?',
    subtitle: 'Podés tener varios formatos en tu plan',
    multiple: true,
    options: [
      { value: 'video', label: 'Video', icon: '🎥', desc: 'Cara a cara por llamada' },
      { value: 'audio', label: 'Audio', icon: '📞', desc: 'Solo voz, sin cámara' },
      { value: 'chat', label: 'Chat en tiempo real', icon: '💬', desc: 'Texto en vivo' },
      { value: 'async', label: 'Mensajes asincrónicos', icon: '📩', desc: 'Escribí cuando puedas' },
    ],
  },
  {
    id: 'schedule',
    title: '¿Cuándo tenés disponibilidad?',
    subtitle: 'Seleccioná todos los que apliquen',
    multiple: true,
    options: [
      { value: 'weekday_morning', label: 'Lunes-Viernes mañana', icon: '🌅' },
      { value: 'weekday_afternoon', label: 'Lunes-Viernes tarde', icon: '☀️' },
      { value: 'weekday_evening', label: 'Lunes-Viernes noche', icon: '🌙' },
      { value: 'weekend', label: 'Fines de semana', icon: '📅' },
    ],
  },
]

export default function Quiz() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [animating, setAnimating] = useState(false)

  const q = questions[step]
  const progress = ((step + 1) / questions.length) * 100
  const selected = answers[q.id] || (q.multiple ? [] : null)

  const isSelected = (val) => q.multiple ? selected.includes(val) : selected === val
  const canContinue = q.multiple ? selected.length > 0 : selected !== null

  const toggle = (val) => {
    if (q.multiple) {
      setAnswers(prev => ({
        ...prev,
        [q.id]: selected.includes(val)
          ? selected.filter(v => v !== val)
          : [...selected, val]
      }))
    } else {
      setAnswers(prev => ({ ...prev, [q.id]: val }))
    }
  }

  const next = () => {
    if (!canContinue) return
    setAnimating(true)
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(s => s + 1)
        setAnimating(false)
      } else {
        // Quiz done — go to match
        navigate('/match', { state: { answers } })
      }
    }, 200)
  }

  const back = () => {
    if (step > 0) setStep(s => s - 1)
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sage-50 dark:from-teal-950 dark:via-surface-950 dark:to-sage-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button onClick={back} className="flex items-center gap-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Atrás</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-cora flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
          </div>
          <span className="font-bold text-surface-700 dark:text-surface-300">Cora</span>
        </div>
        <span className="text-sm text-surface-400">{step + 1} / {questions.length}</span>
      </div>

      {/* Progress */}
      <div className="px-6 mb-8">
        <ProgressBar value={progress} />
      </div>

      {/* Content */}
      <div className={clsx('flex-1 flex flex-col items-center justify-center px-6 pb-24 transition-opacity duration-200', animating && 'opacity-0')}>
        <div className="w-full max-w-xl">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-black text-surface-900 dark:text-white mb-2">
              {q.title}
            </h1>
            <p className="text-surface-400">{q.subtitle}</p>
          </div>

          <div className={clsx('grid gap-3', q.options.length <= 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4')}>
            {q.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={clsx(
                  'relative p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5',
                  isSelected(opt.value)
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 shadow-cora'
                    : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 hover:border-teal-300 dark:hover:border-teal-700'
                )}
              >
                {isSelected(opt.value) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <span className="text-2xl mb-2 block">{opt.icon}</span>
                <span className={clsx('text-sm font-semibold block', isSelected(opt.value) ? 'text-teal-700 dark:text-teal-300' : 'text-surface-800 dark:text-surface-200')}>
                  {opt.label}
                </span>
                {opt.desc && (
                  <span className="text-xs text-surface-400 mt-0.5 block">{opt.desc}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md border-t border-surface-100 dark:border-surface-800">
        <div className="max-w-md mx-auto">
          <Button
            fullWidth
            size="lg"
            disabled={!canContinue}
            onClick={next}
          >
            {step === questions.length - 1 ? 'Ver mi terapeuta →' : 'Continuar'}
          </Button>
          {q.multiple && (
            <p className="text-center text-xs text-surface-400 mt-2">
              Podés seleccionar varias opciones
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
