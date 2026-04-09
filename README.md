# Cora - Plataforma de Teleterapia

> Plataforma digital que conecta personas con psicólogos certificados en Costa Rica y Latinoamérica. Incluye sesiones por video/chat, pagos seguros, agendamiento, comunidad y reseñas.

![Estado del Proyecto](https://img.shields.io/badge/estado-planning-blue)
![Versión](https://img.shields.io/badge/versión-0.1.0-green)
![Licencia](https://img.shields.io/badge/licencia-propietaria-red)

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18+ (Vite) |
| Backend | Node.js + Express.js |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Pagos | Stripe |
| Video | WebRTC (SimplePeer) |
| Email | SendGrid/Resend |

## Tabla de Contenidos

- [Primeros Pasos](#primeros-pasos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Desarrollo](#desarrollo)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contribuir](#contribuir)
- [Documentación](#documentación)
- [Licencia](#licencia)

## Primeros Pasos

### Requisitos Previos

- **Node.js** v18+ ([Descargar](https://nodejs.org/))
- **npm** v9+ (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))
- **Cuenta de Supabase** ([Registrarse](https://supabase.com/))
- **Cuenta de Stripe** (para desarrollo: [Stripe Dashboard](https://dashboard.stripe.com/))

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/cora.git
cd cora
```

### Instalación de Dependencias

```bash
# Instalar dependencias del frontend
cd frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install
```

## Estructura del Proyecto

```
cora/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/          # Vistas principales
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # Integraciones (Supabase, API)
│   │   ├── store/          # Estado global (Zustand)
│   │   └── utils/          # Funciones helper
│   ├── .env.example
│   └── package.json
├── backend/                  # API Node.js/Express
│   ├── src/
│   │   ├── routes/        # Endpoints de API
│   │   ├── controllers/   # Lógica de controladores
│   │   ├── middleware/     # Auth, rate limiting, etc.
│   │   ├── services/      # Lógica de negocio
│   │   └── utils/         # Helpers
│   ├── .env.example
│   └── package.json
├── docs/                    # Documentación adicional
│   ├── API.md
│   ├── SETUP.md
│   └── TESTING.md
├── modulos/                # Diagramas de arquitectura
├── requisitos/              # Documentos de requisitos
├── EDT/                    # Estructuras de desglose de trabajo
└── README.md
```

## Configuración

### 1. Configurar Supabase

1. Crear un proyecto en [Supabase](https://supabase.com/dashboard)
2. Ir a **Settings > API** y copiar:
   - `Project URL`
   - `anon/public` key (para frontend)
   - `service_role` key (solo para backend, NUNCA exponer)

3. Ejecutar el schema inicial en **SQL Editor** de Supabase:

```sql
-- El schema completo está en docs/database/schema.sql
```

4. Configurar **Row Level Security (RLS)** para cada tabla

### 2. Configurar Variables de Entorno

```bash
# Backend
cd backend
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Backend (.env)
NODE_ENV=development
PORT=3001

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu-sendgrid-api-key
EMAIL_FROM=noreply@tucora.com
```

```bash
# Frontend
cd ../frontend
cp .env.example .env
```

```env
# Frontend (.env)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_API_URL=http://localhost:3001/api
```

### 3. Configurar Stripe (Webhook Local)

Para desarrollo local, usar [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# Instalar Stripe CLI
# Windows:
winget install stripe.stripe-cli

# Login
stripe login

# Reenviar webhooks a localhost
stripe listen --forward-to localhost:3001/webhooks/stripe
```

Copiar el **webhook signing secret** (`whsec_...`) a tu `.env`

## Scripts Disponibles

### Frontend

```bash
cd frontend

npm run dev          # Iniciar servidor de desarrollo (Vite)
npm run build        # Build para producción
npm run preview      # Previsualizar build de producción
npm run lint         # Linting con ESLint
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
```

### Backend

```bash
cd backend

npm run dev          # Iniciar servidor con hot reload (nodemon)
npm run start        # Iniciar servidor de producción
npm run lint         # Linting con ESLint
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con cobertura
npm run db:migrate   # Ejecutar migraciones (si aplica)
npm run db:seed      # Poblar base de datos con datos de prueba
```

## Desarrollo

### Flujo de Trabajo

1. **Crear una rama** para tu feature/fix:

```bash
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

2. **Hacer cambios** y commits atómicos:

```bash
git add .
git commit -m "feat: agregar validación de email en registro"
```

3. **Push y crear Pull Request** en GitHub:

```bash
git push origin feature/nombre-descriptivo
```

### Convenciones de Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, punto y coma, etc.
refactor: refactorización de código
test: agregar tests
chore: mantenimiento, dependencias
```

Ejemplos:
- `feat: agregar login con Google OAuth`
- `fix: corregir redirección después de logout`
- `docs: actualizar README con nuevas variables de entorno`

### Reglas de Código

- **ESLint** para JavaScript/TypeScript
- **Prettier** para formateo automático
- **Husky** para pre-commit hooks (linting automático)
- Longitud máxima de línea: 100 caracteres

## Testing

### Estrategia de Testing

```
        ┌─────────────────────────────────────────┐
        │              PIRÁMIDE DE TESTS           │
        └─────────────────────────────────────────┘

                    ▲
                   / \
                  / E2E\        ← Pocos, críticos (Cypress)
                 /-------\
                / Integración \  ← Algunos, flujos completos
               /--------------\
              /   Unitarios     \ ← Muchos, funciones individuales
             /------------------\
            ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔

```

### Herramientas

| Tipo | Herramienta | Ubicación |
|------|-------------|-----------|
| Unit | Vitest | frontend/src/__tests__/ |
| Unit | Jest + Supertest | backend/src/__tests__/ |
| E2E | Playwright | tests/e2e/ |
| Mock | MSW | frontend + backend |

### Ejecutar Tests

```bash
# Todos los tests
npm run test

# Solo frontend
cd frontend && npm run test

# Solo backend
cd backend && npm run test

# Con coverage
npm run test:coverage

# E2E (requiere que backend y frontend estén corriendo)
npx playwright test
```

### Coverage Mínimo

- **Backend**: 80% de cobertura en líneas
- **Frontend**: 70% de cobertura en componentes críticos
- **E2E**: Flujos principales de usuario

## Deployment

### Entornos

| Entorno | URL | Propósito |
|---------|-----|-----------|
| Development | localhost:5173 (FE) / localhost:3001 (BE) | Desarrollo local |
| Staging | staging.tucora.com | Pruebas pre-producción |
| Production | tucora.com | Uso real |

### Guía de Deploy

**Frontend (Vercel)**:
```bash
cd frontend
vercel --prod
```

**Backend (Railway/Render/Fly.io)**:
```bash
cd backend
# Railway
railway up

# Render
render deploy

# Fly.io
fly deploy
```

### Variables de Producción

Ver `.env.example` y configurar en el panel del proveedor de hosting.

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guías detalladas.

### Quick Summary

1. Fork el repositorio
2. Crear rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m "feat: mi feature"`
4. Push: `git push origin feature/mi-feature`
5. Abrir Pull Request

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [docs/API.md](docs/API.md) | Especificación de endpoints de API |
| [docs/SETUP.md](docs/SETUP.md) | Guía detallada de configuración |
| [docs/TESTING.md](docs/TESTING.md) | Estrategia y guías de testing |
| [Arquitectura Obsidian](../mi-second-brain/Proyectos/Cora/Arquitectura/) | Diagramas y notas de diseño |
| [EDT Obsidian](../mi-second-brain/Proyectos/Cora/EDT/) | Desglose de trabajo detallado |

### Artefactos Principales

- **EDT Maestra**: `EDT/word/00_EDT_Maestra_Cora.docx`
- **Requisitos Word**: `requisitos/word/`
- **Diagramas**: `modulos/nivel0/` y `modulos/nivel1/`

## Seguridad

### Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, **NO** uses el tracker de Issues. Envía un email a:

```
seguridad@tucora.com
```

Incluir:
- Descripción del problema
- Pasos para reproducir
- Impacto potencial
- Sugerencias de remediación (opcional)

### Notas de Seguridad

- La `SERVICE_ROLE_KEY` de Supabase **NUNCA** debe estar en el frontend
- Todos los endpoints de API deben verificar JWT
- Rate limiting activo en todas las rutas públicas
- Headers de seguridad con Helmet.js
- RLS habilitado en todas las tablas de Supabase

## Normas de Convivencia

Ver [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Roadmap

- [x] Planificación y documentación (EDT, arquitectura)
- [ ] Sprint 1: Fundamentos (Auth + Dashboard)
- [ ] Sprint 2: Módulo de Citas
- [ ] Sprint 3: Pagos (Stripe)
- [ ] Sprint 4: Sesiones de Terapia (WebRTC)
- [ ] Sprint 5: Comunidad + Reseñas
- [ ] Sprint 6: Panel Admin + Polish
- [ ] Lanzamiento MVP

## Autores

- **Joan Mora Rojas** - Arquitecto y Lead Developer

## Licencia

Proprietario - Todos los derechos reservados.

---

Hecho con ❤️ para la comunidad de Costa Rica y Latinoamérica.
