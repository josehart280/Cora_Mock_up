import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'

const mockMessages = [
  { id: 1, from: 'therapist', text: '¡Hola! ¿Cómo te ha ido esta semana?', time: '15:00' },
  { id: 2, from: 'patient', text: 'Hola doctor, bastante bien la verdad. Practiqué las técnicas de respiración que me recomendó.', time: '15:01' },
  { id: 3, from: 'therapist', text: 'Excelente, me alegra mucho escuchar eso. ¿Y cómo te sentiste al practicarlas?', time: '15:01' },
]

function SessionTimer({ started }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!started) return
    const interval = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [started])

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')

  return (
    <span className="font-mono text-white/90">
      {mins}:{secs}
    </span>
  )
}

export default function SessionRoom() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [sessionStarted, setSessionStarted] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState(mockMessages)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [countdown, setCountdown] = useState(50 * 60) // 50 min session

  useEffect(() => {
    const timer = setTimeout(() => setSessionStarted(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!sessionStarted) return
    const interval = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(interval)
  }, [sessionStarted])

  const sendMessage = () => {
    if (!newMessage.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), from: 'patient', text: newMessage, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }])
    setNewMessage('')
  }

  const minsLeft = Math.floor(countdown / 60)
  const lowTime = minsLeft <= 5

  return (
    <div className="bg-surface-950 min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-cora flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
          </div>
          <div>
            <span className="text-white font-semibold text-sm">Cora · Sesión con Dr. Rodríguez</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
                <span className="text-green-400 text-xs font-medium">En vivo</span>
              </span>
              {sessionStarted && <SessionTimer started={sessionStarted} />}
            </div>
          </div>
        </div>
        {lowTime && (
          <div className="flex items-center gap-2 bg-warm-500/20 border border-warm-500/30 rounded-xl px-3 py-1.5">
            <span className="text-warm-400 text-sm font-semibold">
              ⏱ {minsLeft} min restantes
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="bg-surface-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-white/60 text-xs">Sala:</span>
            <code className="text-teal-400 text-xs font-mono">{roomId || 'room-demo'}</code>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video area */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Remote video (therapist) */}
          <div className="flex-1 relative rounded-3xl overflow-hidden bg-surface-900">
            {!sessionStarted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white/70 text-sm">Conectando con tu terapeuta...</p>
              </div>
            ) : (
              <>
                {/* Therapist video feed placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-surface-900 to-sage-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-cora flex items-center justify-center text-4xl font-black text-white mx-auto mb-4 shadow-cora-lg">
                      CR
                    </div>
                    <p className="text-white font-semibold">Dr. Carlos Rodríguez</p>
                    <p className="text-white/50 text-sm">Cámara activa</p>
                  </div>
                </div>
                {/* WebRTC connection indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
                  <span className="text-white text-xs">Conexión estable</span>
                </div>
              </>
            )}
          </div>

          {/* Local video (patient) */}
          <div className="flex gap-4">
            <div className="w-48 h-36 relative rounded-2xl overflow-hidden bg-surface-800 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-sage-900 to-surface-900 flex items-center justify-center">
                {cameraOn ? (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-sage-500 flex items-center justify-center text-xl font-bold text-white mx-auto mb-1">
                      MG
                    </div>
                    <p className="text-white/70 text-xs">Tú</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-8 h-8 text-white/30 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <p className="text-white/30 text-xs mt-1">Cámara off</p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 left-2">
                <p className="text-white/70 text-xs bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-lg">Tú</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setMicOn(!micOn)}
                className={clsx(
                  'w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all',
                  micOn ? 'bg-surface-700 hover:bg-surface-600' : 'bg-red-500 hover:bg-red-600'
                )}
                title={micOn ? 'Silenciar micrófono' : 'Activar micrófono'}
              >
                {micOn ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                )}
              </button>
              <button
                onClick={() => setCameraOn(!cameraOn)}
                className={clsx(
                  'w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all',
                  cameraOn ? 'bg-surface-700 hover:bg-surface-600' : 'bg-red-500 hover:bg-red-600'
                )}
                title={cameraOn ? 'Apagar cámara' : 'Encender cámara'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
              <button
                className="w-12 h-12 rounded-2xl bg-surface-700 hover:bg-surface-600 flex items-center justify-center text-white transition-all"
                title="Compartir pantalla"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </button>
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className={clsx(
                  'w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all',
                  chatOpen ? 'bg-teal-600 hover:bg-teal-700' : 'bg-surface-700 hover:bg-surface-600'
                )}
                title="Chat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </button>
              <button
                onClick={() => setShowEndConfirm(true)}
                className="flex-1 max-w-[140px] h-12 rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 text-white font-semibold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
                Terminar
              </button>
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        {chatOpen && (
          <div className="w-80 flex-shrink-0 border-l border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm">Chat de sesión</h3>
              <p className="text-white/40 text-xs">Los mensajes son privados</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={clsx('flex', msg.from === 'patient' ? 'justify-end' : 'justify-start')}>
                  <div className={clsx(
                    'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                    msg.from === 'patient'
                      ? 'bg-teal-600 text-white rounded-br-sm'
                      : 'bg-surface-800 text-white/90 rounded-bl-sm'
                  )}>
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-50 mt-1 text-right">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-surface-800 text-white rounded-xl px-3 py-2 text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-teal-500 border border-white/10"
                />
                <button
                  onClick={sendMessage}
                  className="w-9 h-9 bg-teal-600 hover:bg-teal-700 rounded-xl flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* End session modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-900 rounded-3xl p-8 max-w-sm w-full border border-white/10 animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-2">¿Terminar la sesión?</h3>
            <p className="text-white/60 text-sm mb-8">La sesión se registrará como completada. Podrás calificar al Dr. Rodríguez después.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition-colors font-medium"
              >
                Volver
              </button>
              <button
                onClick={() => navigate('/citas')}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white transition-colors font-semibold"
              >
                Terminar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
