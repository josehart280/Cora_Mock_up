import { Link } from 'react-router-dom'

const footerLinks = {
  'Plataforma': [
    { label: 'Cómo funciona', href: '/#como-funciona' },
    { label: 'Nuestros psicólogos', href: '/psicologos' },
    { label: 'Precios', href: '/#precios' },
    { label: 'Comunidad', href: '/comunidad' },
  ],
  'Soporte': [
    { label: 'Centro de ayuda', href: '#' },
    { label: 'Contacto', href: '#' },
    { label: 'Reportar un problema', href: '#' },
    { label: 'Estado del servicio', href: '#' },
  ],
  'Legal': [
    { label: 'Términos y condiciones', href: '#' },
    { label: 'Política de privacidad', href: '#' },
    { label: 'Política de cookies', href: '#' },
    { label: 'Cancelación y reembolsos', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-white mt-20">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-cora flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                </svg>
              </div>
              <span className="text-xl font-bold gradient-text">Cora</span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed max-w-xs mb-6">
              Terapia profesional accesible desde donde estés. Conectamos personas con psicólogos certificados en Costa Rica y Latinoamérica.
            </p>
            <div className="bg-teal-900/30 border border-teal-800 rounded-2xl p-4">
              <p className="text-teal-400 text-xs font-semibold mb-1">🔒 Privacidad garantizada</p>
              <p className="text-surface-400 text-xs">Cumplimos con la Ley 8968 de Costa Rica. Zero ads. Tus datos nunca se venden.</p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-bold text-white mb-4">{section}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-surface-400 hover:text-teal-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-surface-500 text-sm">
            © 2026 Cora. Todos los derechos reservados. Hecho con ❤️ para Latinoamérica.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-surface-500 text-xs">📍 San José, Costa Rica</p>
            <p className="text-surface-500 text-xs">📧 soporte@tucora.com</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
