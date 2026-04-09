# Guía de Contribución a Cora

¡Gracias por tu interés en contribuir a Cora! Este documento proporciona guías y estándares para asegurar un proceso de desarrollo colaborativo y de alta calidad.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Code Review](#code-review)
- [Testing](#testing)
- [Documentación](#documentación)
- [Git Flow](#git-flow)
- [Ambientes](#ambientes)
- [Seguridad](#seguridad)

## Código de Conducta

Este proyecto adhiere al [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, te comprometes a mantener un ambiente de respeto y profesionalismo.

## ¿Cómo Puedo Contribuir?

### Reportar Bugs

Antes de crear un issue, verifica que:

1. El bug no esté reportado [anteriormente](../../issues)
2. Estés usando la última versión del código
3. Tengas información suficiente para reproducirlo

Formato de reporte de bug:

```markdown
## Descripción
Descripción clara y concisa del bug.

## Pasos para Reproducir
1. Ir a '...'
2. Click en '...'
3. Scroll down a '...'
4. Ver error

## Comportamiento Esperado
Descripción de lo que debería pasar.

## Comportamiento Actual
Descripción de lo que realmente pasa.

## Screenshots/Logs
Si aplica, incluir screenshots o logs relevantes.

## Ambiente
- OS: [ej: Windows 10, macOS 13]
- Node: [ej: 18.17.0]
- Navegador: [ej: Chrome 116]

## Etiquetas sugeridas
bug, priority-high, needs-triage
```

### Sugerir Features

Las sugerencias de nuevas funcionalidades son bienvenidas. Usa issues con la etiqueta `enhancement`.

Formato de sugerencia:

```markdown
## Problema/Motivación
Describe el problema que resuelve esta feature o por qué es necesaria.

## Propuesta de Solución
Descripción clara de qué quieres que pase.

## Alternativas Consideradas
Otras soluciones que consideredaste y por qué no funcionaron.

## Información Adicional
Cualquier otro contexto relevante.
```

## Proceso de Desarrollo

### 1. Setup Inicial

```bash
# 1. Fork el repositorio (usando GitHub UI)

# 2. Clonar tu fork
git clone https://github.com/tu-usuario/cora.git
cd cora

# 3. Agregar upstream remote
git remote add upstream https://github.com/usuario-oficial/cora.git

# 4. Instalar dependencias
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### 2. Mantener tu Fork Actualizado

```bash
# Traer cambios de upstream
git fetch upstream

# Mergear o rebasar tu branch main con upstream
git checkout main
git merge upstream/main

# Actualizar tu feature branch
git checkout feature/mi-feature
git rebase main
```

### 3. Trabajar en tu Feature

```bash
# Crear branch desde main actualizado
git checkout -b feature/nombre-descriptivo

# Hacer cambios y commits frecuentes
git add .
git commit -m "feat: descripción clara del cambio"

# Push a tu fork
git push origin feature/nombre-descriptivo
```

## Estándares de Código

### General

- Usar **ESLint** y **Prettier** (configuración incluida)
- Longitud máxima de línea: **100 caracteres**
- Indentación: **2 espacios** (no tabs)
- Usar `const` por defecto, `let` solo cuando sea necesario, **nunca `var`**
- Usar **arrow functions** para callbacks
- Usar **template literals** para strings con variables
- Usar **destructuring** para objetos y arrays
- Usar **async/await** en lugar de callbacks encadenados

### Naming Conventions

```javascript
// Variables y funciones: camelCase
const userProfile = {};
function getUserById() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = '/api';

// Clases: PascalCase
class UserService {}
class AppointmentController {}

// Archivos: kebab-case (frontend) o camelCase (backend modules)
// frontend: user-profile.component.jsx
// backend: userService.js

// Booleanos: prefix con is, has, can, should
const isActive = true;
const hasPermission = false;
const canEdit = true;
```

### React Components

```jsx
// ✅ Bueno: Componente funcional con hooks
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const UserProfile = ({ userId, onUpdate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Skeleton />;
  if (!user) return <NotFound />;

  return (
    <div className="user-profile">
      <Avatar src={user.avatarUrl} alt={user.name} />
      <h2>{user.name}</h2>
    </div>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
};

// ❌ Evitar: Componentes de clase (a menos que haya razón específica)
```

### Backend (Node.js/Express)

```javascript
// ✅ Bueno: Usar async/await con try/catch o asyncHandler
import asyncHandler from '../utils/asyncHandler.js';

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.findById(id);
  
  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }
  
  res.json({ success: true, data: user });
});

// ❌ Evitar: Callbacks o .then() encadenados sin manejo de errores
```

### Validación

```javascript
// ✅ Usar Zod para validación de schemas
import { z } from 'zod';

export const createAppointmentSchema = z.object({
  psychologist_id: z.string().uuid(),
  scheduled_at: z.string().datetime(),
  duration_minutes: z.number().min(30).max(120).default(50),
});

// ❌ Evitar: Validación manual con if/else
if (!data.email || !data.email.includes('@')) {
  return res.status(400).json({ error: 'Email inválido' });
}
```

## Commits

### Formato

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

| Tipo | Descripción |
|------|-------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Cambios en documentación |
| `style` | Formateo, punto y coma, etc. (sin cambio de lógica) |
| `refactor` | Refactorización de código (sin cambio de funcionalidad) |
| `perf` | Mejoras de performance |
| `test` | Agregar o modificar tests |
| `build` | Cambios en build system o dependencias |
| `ci` | Cambios en CI/CD |
| `chore` | Tareas de mantenimiento |
| `revert` | Revertir un commit anterior |

### Ejemplos

```bash
# Feature simple
git commit -m "feat: agregar login con Google OAuth"

# Feature con scope
git commit -m "feat(auth): agregar 2FA con TOTP"

# Fix
git commit -m "fix(appointments): corregir timezone en recordatorios"

# Docs
git commit -m "docs: actualizar guía de setup local"

# Refactor
git commit -m "refactor(payments): extraer lógica de Stripe a servicio"

# Con cuerpo explicativo
git commit -m "feat(webhook): manejar eventos de Stripe
- Agregar endpoint /webhooks/stripe
- Validar firma del webhook
- Procesar eventos de payment_intent.succeeded
- Crear registro de pago en DB"
```

### Reglas

- Usar imperativo presente: "agregar" no "agregado", "arreglar" no "arreglado"
- Primera línea: max 72 caracteres
- Cuerpo: explicar "qué" y "por qué", no "cómo"
- Referenciar issues: `Closes #123` o `Refs #456`

## Pull Requests

### Antes de Crear un PR

1. **Asegurar que todos los tests pasen**
2. **Ejecutar linter**: `npm run lint`
3. **Actualizar documentación** si es necesario
4. **Rebasar** tu branch sobre `main` (no merge)
5. **Verificar** que no haya conflictos

### Template de PR

```markdown
## Descripción
Resumen breve de los cambios (1-3 oraciones).

## Tipo de Cambio
- [ ] Bug fix (cambio que arregla un issue)
- [ ] Nueva feature (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que rompe compatibilidad)
- [ ] Refactor (cambio que no arregla bugs ni agrega features)

## ¿Cómo Se Probó?
- [ ] Tests unitarios agregados/actualizados
- [ ] Tests de integración
- [ ] Tests manuales

## Checklist
- [ ] Mi código sigue los estándares de este proyecto
- [ ] Mis cambios no generan warnings de linter
- [ ] He добавил tests que prueban mis cambios
- [ ] Todos los tests existentes pasan
- [ ] He actualizado la documentación relevante

## Screenshots (si aplica)

## Issues Relacionados
Closes #123
Refs #456
```

### Proceso de PR

```
1. Crear PR
   ↓
2. CI checks (lint, test, build)
   ↓
3. Code Review (mínimo 1 aprobación)
   ↓
4. Correcciones si hay comentarios
   ↓
5. Merge (squash merge recomendado)
   ↓
6. Delete branch
```

## Code Review

### Para Autores

- **PRs pequeños**: Máximo 400 líneas cambiadas (dividir si es más)
- **Descripción clara**: Explicar el "qué" y "por qué", no solo el "cómo"
- **Responder comentarios**: No dejar comentarios sin atender
- **Ser receptivo**: Aceptar feedback constructivo

### Para Reviewers

- **Ser respetuoso**: Crítica al código, no a la persona
- **Ser específico**: Sugerir cambios concretos, no solo "esto está mal"
- **Explicar el "por qué"**: No solo decir qué cambiar, sino por qué
- **Aprobar con condiciones**: Si hay cambios menores, aprobar con comentarios
- **Priorizar**: Enfocarse en lo importante, no en estilos menores

### Checklist de Review

- [ ] El código hace lo que dice hacer
- [ ] No introduce bugs
- [ ] Sigue los estándares del proyecto
- [ ] Tiene tests apropiados
- [ ] La documentación está actualizada
- [ ] No hay código redundante o innecesario
- [ ] La seguridad no está comprometida
- [ ] El performance es aceptable

## Testing

### Requisitos

- **Nuevo código debe tener tests**
- **Los tests deben pasar**: CI lo verificará
- **Coverage mínimo**: 80% backend, 70% frontend críticos

### Tipos de Tests

| Tipo | Ubicación | Ejecutar |
|------|----------|----------|
| Unitarios | `*.test.js` junto al archivo | `npm run test` |
| Integración | `tests/integration/` | `npm run test:integration` |
| E2E | `tests/e2e/` | `npx playwright test` |

### Escribir Tests

```javascript
// ✅ Bueno: Tests claros, descriptivos, independientes
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a user with encrypted password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const user = await userService.createUser(userData);

      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[ab]\$/); // bcrypt hash
    });

    it('should throw error for duplicate email', async () => {
      // Setup
      await userService.createUser({ email: 'test@example.com', password: 'pass' });

      // Execute & Assert
      await expect(
        userService.createUser({ email: 'test@example.com', password: 'pass' })
      ).rejects.toThrow('Email already exists');
    });
  });
});
```

## Documentación

### Cuando Actualizar

- [ ] Agregaste nueva funcionalidad → README o docs/
- [ ] Cambiaste una API → docs/API.md
- [ ] Agregaste dependencia → Documentar en README
- [ ] Cambiaste configuración → docs/SETUP.md

### Estilo de Documentación

- Usar **markdown** para documentación
- Incluir **ejemplos de código** donde sea posible
- Mantener **código ejemplos actualizados**
- Usar **capturas de pantalla** para UI (cuando ayude)

## Git Flow

```
                    feature/X
                   /
main ────────────────────────────────────────
        ↑                   ↑ merge
        |                   |
        |                   | merge
        |                   ↓
        |            develop ────────────────
        ↑              ↑                   ↑
        |              |                   |
        |              |                   |
      release/X    feature/Y            hotfix/Z
```

### Ramas

| Rama | Propósito | Ejemplo |
|------|-----------|---------|
| `main` | Producción estable | `main` |
| `develop` | Integración de features | `develop` |
| `feature/*` | Nueva funcionalidad | `feature/google-oauth` |
| `fix/*` | Corrección de bugs | `fix/login-redirect` |
| `hotfix/*` | Correcciones urgentes de producción | `hotfix/security-patch` |
| `release/*` | Preparación de release | `release/v1.0.0` |

### Convención de Nombres

```bash
# Features
feature/nombre-descriptivo
feature/123-agregar-google-oauth

# Fixes
fix/descripcion-del-bug
fix/456-corregir-timezone

# Hotfixes
hotfix/urgent-arreglar-login

# Releases
release/v1.0.0
```

## Ambientes

| Ambiente | Branch | URL | Propósito |
|----------|--------|-----|-----------|
| Local | Tu fork | localhost | Desarrollo |
| Development | `develop` | dev.tucora.com | Pruebas de integración |
| Staging | `release/*` | staging.tucora.com | QA, UAT |
| Production | `main` | tucora.com | Usuarios reales |

### Deploys

- **Development**: Automático en push a `develop`
- **Staging**: Automático en push a `release/*`
- **Production**: Solo manual con approval

## Seguridad

### Reglas Importantes

1. **NUNCA** hacer commit de credenciales reales
2. **NUNCA** exponer `SERVICE_ROLE_KEY` de Supabase
3. **NUNCA** hardcodear secrets en código
4. Usar **variables de entorno** para todo sensible
5. Si crees que expusiste una credencial, **报告alo inmediatamente**

### Si Expones Credenciales

```bash
# 1. Rotar la credencial inmediatamente en el proveedor
# (Supabase, Stripe, AWS, etc.)

# 2. Actualizar en todos los ambientes

# 3. Investigar si fue utilizada fraudulentamente

# 4. Reportar a seguridad@tucora.com si hay compromiso
```

### Validación de Inputs

- **Nunca confiar en datos del cliente**
- Validar con Zod en backend
- Sanitizar inputs antes de guardar en DB
- Escapar outputs antes de renderizar

---

## Preguntas?

Si tienes dudas sobre este proceso, puedes:

1. Abrir un issue con la etiqueta `question`
2. Preguntar en el canal interno de Slack
3. Contactar al lead developer

---

**Gracias por contributing a Cora! 💙**
