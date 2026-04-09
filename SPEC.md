---
uid: cora-product-spec
type: spec
tags: [cora, product-spec, teletherapy, BetterHelp, spec]
created: 2026-04-04
---

# Cora - Especificación de Producto: Plataforma de Teleterapia

> **Documento vivo** - Versión 1.0 basada en investigación BetterHelp
> Este documento sirve como SPEC.md funcional para implementar una plataforma de teleterapia tipo BetterHelp

---

## Tabla de Contenidos

1. [Visión del Producto](#1-visión-del-producto)
2. [Mercado Objetivo](#2-mercado-objetivo)
3. [Core Features (MVP)](#3-core-features-mvp)
4. [User Flows](#4-user-flows)
5. [Flujo del Terapeuta](#5-flujo-del-terapeuta)
6. [Arquitectura Técnica](#6-arquitectura-técnica)
7. [Modelo de Datos](#7-modelo-de-datos)
8. [Seguridad y Privacidad (CRÍTICO)](#8-seguridad-y-privacidad-crítico)
9. [Modelo de Negocio](#9-modelo-de-negocio)
10. [Compliance y Regulatorio](#10-compliance-y-regulatorio)
11. [Diferenciación Competitiva](#11-diferenciación-competitiva)
12. [Roadmap de Desarrollo](#12-roadmap-de-desarrollo)
13. [Métricas de Éxito](#13-métricas-de-éxito)
14. [User Stories](#14-user-stories)
15. [Requisitos No Funcionales](#15-requisitos-no-funcionales)

---

## 1. Visión del Producto

### 1.1 Qué Es

**Cora** es una plataforma D2C (direct-to-consumer) de teleterapia que conecta pacientes con terapeutas licenciados a través de sesiones de video, chat, teléfono y mensajería asincrónica.

### 1.2 Qué No Es

- No es un sustituto de emergencia crisis
- No prescribe medicamentos (diferenciador vs Cerebral/Talkspace)
- No acepta seguro inicialmente (modelo subscription puro)

### 1.3 Why Now

| Factor | Detalle |
|--------|---------|
| Market growth | Teletherapy creció 300%+ post-COVID |
| Gap de acceso | Costa Rica/LatAm tiene shortage de terapeutas |
| Regulación | Ley 8968 + tendencia pro-privacidad |
| Lecciones | FTC settlement de BetterHelp = warning de qué NO hacer |

---

## 2. Mercado Objetivo

### 2.1 Geográfico Inicial

| Región | Justificación |
|--------|---------------|
| **Costa Rica** | Home market, Ley 8968 compliance, primer mercado |
| **Latinoamérica** | Expansión fase 2 (México, Colombia, Chile) |

### 2.2 Perfil de Usuario

| Segmento | Edad | Necesidad |
|----------|------|-----------|
| Young professionals | 25-40 | Anxiety, stress, work-life balance |
| Parents | 30-50 | Parenting, relationships |
| Remote workers | 25-45 | Isolation, burnout |
| Adolescents | 13-17 | Depression, bullying (con parental consent) |

### 2.3 Perfil de Terapeuta

| Requisito | Detalle |
|-----------|---------|
| Grado | Master's o Doctorate en psicología/psychotherapy |
| Experiencia | Mínimo 3 años práctica clínica |
| Horas | 1,000+ horas experiencia hands-on |
| Licencia | CPJ (Colegio de Psicólogos de Costa Rica) o equivalente |
| Idioma | Español nativo + inglés deseable |

---

## 3. Core Features (MVP)

### 3.1 Para Pacientes

| Feature | Prioridad | Descripción |
|---------|-----------|-------------|
| Registro + Cuestionario | P0 | Quiz inicial de 5-8 preguntas sobre objetivos, preferencias |
| Matching algorítmico | P0 | Match con terapeuta basado en perfil + disponibilidad |
| Messaging asincrónico | P0 | Chat unlimited con terapeuta asignado |
| Video sessions | P0 | Videollamadas 30-45 min via WebRTC |
| Audio sessions | P1 | Llamadas telefónicas via VoIP |
| Live chat | P1 | Chat en tiempo real scheduled |
| Cambio de terapeuta | P0 | Free, instant, cualquier momento |
| Cancellation self-service | P0 | Sin llamar, sin loops |
| Progress tracking | P1 | PHQ-9, GAD-7 assessments cada 45 días |
| Worksheets | P2 | 150+ worksheets interactivos |
| Billing transparent | P0 | Precios claros, no surprises |

### 3.2 Para Terapeutas

| Feature | Prioridad | Descripción |
|---------|-----------|-------------|
| Provider dashboard | P0 | Ver clientes, mensajes, schedule |
| Client management | P0 | Lista de pacientes asignados |
| Session scheduling | P0 | Calendar integration, reminders |
| Documentation | P1 | Notas de sesión, progress tracking |
| Messaging response | P0 | Respond to async messages |
| Earnings tracking | P0 | Dashboard de pagos |
| Profile management | P0 | Especialidades, disponibilidad, bio |

### 3.3 Para Admin

| Feature | Prioridad | Descripción |
|---------|-----------|-------------|
| User management | P0 | CRUD de usuarios y terapeutas |
| Therapist verification | P0 | Workflow de aprobación |
| Reporting | P1 | Analytics básicos |
| Support tickets | P1 | Sistema de helpdesk |
| Audit logs | P0 | Compliance + security |

---

## 4. User Flows

### 4.1 Onboarding Flow (Paciente)

```
[1. Landing] → [2. Quiz] → [3. Match Preview] → [4. Payment] → [5. Welcome]

[1. Landing]
    ├── Hero: "Terapia profesional desde tu casa"
    └── CTA: "Encontrá tu terapeuta"

[2. Quiz (5-8 preguntas)]
    ├── Tipo de terapia: Individual / Parejas / Adolescentes
    ├── Objetivos: ¿Qué te trae aquí?
    ├── Preferencias terapeuta: Género, edad, enfoque
    ├── Formato preferido: Video / Audio / Chat / Mensajes
    └── Horarios disponibles
    ⚠️ NO requiere account creation hasta después del quiz

[3. Match Preview]
    ├── Ver perfil del terapeuta asignado (foto, bio, specialties)
    └── "No es lo que buscabas? Podés cambiar gratis"

[4. Payment]
    ├── Plan selection (Weekly / Monthly)
    ├── Price prominently displayed: "$XX/semana"
    └── Cancel anytime - claramente visible

[5. Welcome]
    ├── Confirmation email con receipt
    └── Primer mensaje de tu terapeuta
```

### 4.2 Cancellation Flow (ANTI-BETTERHELP)

```
UX PRINCIPLE: "Tan fácil cancelar como suscribirse"

[Account Settings] → [Cancel Membership] → [Confirm] → [Done]

[Confirm Cancellation]
    ├── "¿Estás seguro?" - NO dark patterns
    ├── "Tu acceso continúa hasta [fecha]"
    └── [Cancel Now] + [Keep Access] buttons equal size

[Done]
    ├── Confirmation email INMEDIATO
    └── "Tu cancelación fue procesada"

⚠️ RULES:
- Cancellation takes max 3 clicks
- Confirmation within 1 minute via email
- NO phone calls required
- NO retention loops
```

### 4.3 Therapy Session Flow

```
[Pre-Session]
    ├── Reminder 24h: "Tu sesión es mañana a las [hora]"
    └── Reminder 15min: "Entrá a tu sesión"

[During Session]
    ├── [Video/Audio/Chat]
    ├── Timer visible (30-45 min)
    └── "Session will end in 5 minutes" warning

[Post-Session]
    ├── Follow-up message from therapist (within 24-48h)
    └── Next session scheduled (if recurring)
```

---

## 5. Flujo del Terapeuta

### 5.1 Therapist Onboarding

```
[1. Application] → [2. Verification] → [3. Approval] → [4. Profile] → [5. Training] → [6. First Client]

[Verification]
    ├── Document upload: License, ID, Degree
    ├── Background check
    └── Case study submission

[Approval]
    ├── Timeline: 5-7 business days
    └── Status: "En revisión" → "Aprobado"

[Training]
    ├── Platform walkthrough (30 min)
    ├── Privacy & security training (REQUIRED)
    └── Support channels
```

### 5.2 Therapist Daily Workflow

```
[Morning]
    ├── Check dashboard
    ├── Review overnight messages
    └── Respond to async messages (SLA: <24h)

[Scheduled Sessions]
    ├── Pre-session prep
    ├── Live session (video/audio/chat)
    └── Post-session documentation
```

---

## 6. Arquitectura Técnica

### 6.1 Stack Propuesto

| Capa | Tecnología |
|------|------------|
| **Frontend** | React + TypeScript |
| **Mobile** | React Native |
| **Backend** | Node.js + Fastify |
| **Database** | PostgreSQL + Redis |
| **Video** | Daily.co / Twilio / Jitsi |
| **Messaging** | Apache Kafka + PostgreSQL |
| **Auth** | Clerk / Auth0 + MFA |
| **Payments** | Stripe |
| **Storage** | AWS S3 + CloudFront |
| **Monitoring** | Datadog + Sentry |

### 6.2 Microservicios

| Servicio | Responsabilidad |
|----------|----------------|
| `user-service` | Registration, auth, profiles |
| `match-service` | Algorithm, assignment |
| `session-service` | Video/audio/webRTC |
| `messaging-service` | Async messages |
| `billing-service` | Subscriptions, payments |
| `therapist-service` | Profiles, verification |
| `admin-service` | Dashboard, support, audit |

---

## 7. Modelo de Datos

### 7.1 Entidades Principales

- **User**: id, email, password_hash, role, created_at
- **Patient**: user_id, first_name (encrypted), subscription_status, therapist_id
- **Therapist**: user_id, license_type, verification_status, specializations
- **Match**: patient_id, therapist_id, match_score, status
- **Session**: match_id, session_type, scheduled_at, duration_minutes, status
- **Message**: match_id, sender_id, content (encrypted), sent_at
- **Subscription**: patient_id, plan, price_cents, status, current_period_end
- **Invoice**: subscription_id, amount_cents, status, stripe_payment_intent_id
- **AuditLog**: user_id, action, entity_type, entity_id, created_at

---

## 8. Seguridad y Privacidad (CRÍTICO)

> **LECCIÓN DE BETTERHELP: $7.8M FTC Settlement**
> BetterHelp shared sensitive mental health data with Facebook, Snapchat, Criteo for advertising.
> **NUESTRO ENFOQUE: ZERO trust con datos de salud mental**

### 8.1 Lo QUE NO HAREMOS

```
🚫 NO compartir emails con anunciantes
🚫 NO compartir IPs con third parties
🚫 NO usar datos de health questionnaires para targeted ads
🚫 NO Facebook/Meta, Snapchat, Criteo, Pinterest
🚫 NO data brokers de ningún tipo
```

### 8.2 Lo QUE SÍ HAREMOS

```
✅ Consentimiento explícito antes de ANY data sharing
✅ Auditorías de terceros cada 2 años
✅ Bug bounty para security researchers
✅ HIPAA-style controls aunque no sea legalmente requerido
✅ Data processing agreements con todos los vendors
✅ Right to deletion (GDPR-style) para usuarios
```

---

## 9. Modelo de Negocio

### 9.1 Pricing Strategy

| Tier | Precio | Descripción |
|------|--------|-------------|
| **Básico** | $45-60/semana | Mensajería + 1 sesión/mes |
| **Estándar** | $65-80/semana | Mensajería + 1 sesión/semana |
| **Premium** | $90-100/semana | Todo + 2 sesiones/semana + workshops |

### 9.2 Unit Economics Target

| Métrica | Target |
|---------|--------|
| CAC | < $150 |
| LTV | > $1,500 |
| LTV:CAC Ratio | > 10:1 |
| Churn Rate | < 5% monthly |

---

## 10. Compliance y Regulatorio

### 10.1 Costa Rica - Ley 8968

| Requisito | Implementación |
|-----------|----------------|
| Consentimiento informado | Checkbox obligatorio + registro |
| Derecho de acceso | Portal para exportar datos |
| Derecho de supresión | "Delete account" funcional |
| Notificación de brechas | 72h SLA |
| DPO | Data Protection Officer |

---

## 11. Diferenciación Competitiva

| Aspecto | BetterHelp | Cora |
|---------|-----------|------|
| Privacy | FTC settlement 2023 | Privacy-first, zero ads |
| Billing | Confuso | Transparent, 1-click cancel |
| Support | Difícil | Chat + email + phone |
| Mercado | USA-centric | LatAm-first |

---

## 12. Roadmap de Desarrollo

```
[FASE 0: Foundation] - Mes 1-2
    └── Tech stack, Auth, DB, Security

[FASE 1: MVP - Core Loop] - Mes 3-4
    ├── Registration + Quiz
    ├── Therapist onboarding
    ├── Matching (v1)
    ├── Messaging async
    ├── Billing (Stripe)
    └── WebRTC video

[FASE 2: Polish] - Mes 5-6
    ├── Audio sessions
    ├── Live chat
    ├── Assessments
    └── Better onboarding UX

[FASE 3: Scale] - Mes 7-9
    ├── Mobile apps
    ├── Couples therapy
    ├── Teen therapy
    └── Group sessions

[FASE 4: Expansion] - Mes 10-12
    ├── Segunda región LatAm
    └── Insurance API
```

---

## 13. Métricas de Éxito

| Métrica | Target |
|---------|--------|
| MRR | $100K para M12 |
| Subscribers | 2,000 para M12 |
| Match success rate | >90% |
| Session completion | >85% |
| NPS | >40 |
| Churn rate | <5% monthly |

---

## 14. User Stories

### Como Paciente

```
COMO paciente
QUIERO completar un quiz inicial
PARA que me matcheen con un terapeuta apropiado

COMO paciente
QUIERO enviar mensajes a mi terapeuta a cualquier hora
PARA recibir guidance cuando lo necesite

COMO paciente
QUIERO cancelar mi suscripción fácilmente
PARA no sentirme atrapado/a

COMO paciente
QUIERO saber exactamente cuánto pago
PARA no tener sorpresas en mi tarjeta
```

### Como Terapeuta

```
COMO terapeuta
QUIERO verificar mi licencia en la plataforma
PARA asegurar a mis pacientes que soy legítimo

COMO terapeuta
QUIERO gestionar mi calendario de disponibilidad
PARA que los pacientes puedan agendar sesiones
```

---

## 15. Errores de BetterHelp a Evitar

| Error de BetterHelp | Cómo lo evitaremos |
|--------------------|--------------------|
| Compartir datos con Facebook | Zero third-party ads |
| Facturación confusa | Price prominently displayed |
| Cancelación difícil | 1-click cancellation |
| No responder soporte | 24/7 chat + phone |
| Terapeutas inconsistentes | Vetting riguroso |
