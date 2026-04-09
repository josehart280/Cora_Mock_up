# Cora Teletherapy Platform — API Documentation

**Version:** 1.0.0  
**Base URL:** `https://api.cora.health/v1`  
**Content-Type:** `application/json`

---

## 1. Overview

### Base URL

| Environment | Base URL |
|-------------|----------|
| Production | `https://api.cora.health/v1` |
| Staging | `https://api-staging.cora.health/v1` |
| Development | `http://localhost:3001/v1` |

### Authentication

Cora uses **JWT (JSON Web Tokens)** for authentication. Include the token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

#### Token Lifecycle

| Token | Lifetime | Refresh |
|-------|---------|---------|
| Access Token | 15 minutes | POST `/api/auth/refresh` |
| Refresh Token | 7 days | Included in refresh response |

### Common Headers

```http
Content-Type: application/json
Authorization: Bearer <access_token>
X-Client-Version: 1.0.0
X-Request-ID: <uuid>
Accept-Language: es-CR
```

### Error Response Format

All errors follow a consistent structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "requestId": "req_abc123"
  }
}
```

#### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 422 | Unprocessable Entity |
| 429 | Rate Limited |
| 500 | Internal Server Error |

#### Error Codes

| Code | Description |
|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | Wrong email or password |
| `AUTH_TOKEN_EXPIRED` | Access token has expired |
| `AUTH_TOKEN_INVALID` | Malformed or tampered token |
| `AUTH_REFRESH_FAILED` | Refresh token invalid or expired |
| `VALIDATION_ERROR` | Request body validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource does not exist |
| `RESOURCE_CONFLICT` | Resource already exists |
| `PERMISSION_DENIED` | User lacks required role/permission |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `STRIPE_ERROR` | Payment processing error |

---

## 2. Authentication Endpoints

### POST /auth/register

Register a new user account.

**Authentication:** None

**Request Body:**

```json
{
  "email": "maria.gonzalez@email.com",
  "password": "SecurePass123!",
  "firstName": "María",
  "lastName": "Gonzalez",
  "role": "patient",
  "phone": "+50688881234",
  "acceptTerms": true,
  "acceptPrivacyPolicy": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | Min 8 chars, 1 uppercase, 1 number, 1 special |
| firstName | string | Yes | 2-50 characters |
| lastName | string | Yes | 2-50 characters |
| role | enum | Yes | `patient` or `psychologist` |
| phone | string | No | E.164 format |
| acceptTerms | boolean | Yes | Must be true |
| acceptPrivacyPolicy | boolean | Yes | Must be true |

**Success Response (201):**

```json
{
  "data": {
    "user": {
      "id": "usr_2hK9xMmN3pQr",
      "email": "maria.gonzalez@email.com",
      "firstName": "María",
      "lastName": "Gonzalez",
      "role": "patient",
      "createdAt": "2026-04-06T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

**Error Response (409 - Email exists):**

```json
{
  "error": {
    "code": "RESOURCE_CONFLICT",
    "message": "An account with this email already exists",
    "requestId": "req_abc123"
  }
}
```

---

### POST /auth/login

Authenticate and receive tokens.

**Authentication:** None

**Request Body:**

```json
{
  "email": "maria.gonzalez@email.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "data": {
    "user": {
      "id": "usr_2hK9xMmN3pQr",
      "email": "maria.gonzalez@email.com",
      "firstName": "María",
      "lastName": "Gonzalez",
      "role": "patient",
      "profileComplete": false,
      "avatar": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

**Error Response (401):**

```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "requestId": "req_abc123"
  }
}
```

---

### POST /auth/logout

Invalidate the current refresh token.

**Authentication:** Required

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**

```json
{
  "data": {
    "message": "Successfully logged out"
  }
}
```

---

### POST /auth/refresh

Exchange a refresh token for new access/refresh token pair.

**Authentication:** None

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**

```json
{
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

---

### POST /auth/forgot-password

Request a password reset email.

**Authentication:** None

**Request Body:**

```json
{
  "email": "maria.gonzalez@email.com"
}
```

**Success Response (200):**

```json
{
  "data": {
    "message": "If an account exists, a reset email has been sent"
  }
}
```

---

### POST /auth/reset-password

Reset password using token from email.

**Authentication:** None

**Request Body:**

```json
{
  "token": "res_abc123xyz",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response (200):**

```json
{
  "data": {
    "message": "Password has been reset successfully"
  }
}
```

---

## 3. User & Profile Endpoints

### GET /users/me

Get the authenticated user's profile.

**Authentication:** Required

**Success Response (200):**

```json
{
  "data": {
    "id": "usr_2hK9xMmN3pQr",
    "email": "maria.gonzalez@email.com",
    "firstName": "María",
    "lastName": "Gonzalez",
    "role": "patient",
    "phone": "+50688881234",
    "avatar": "https://cdn.cora.health/avatars/usr_2hK9xMmN3pQr.jpg",
    "profileComplete": false,
    "createdAt": "2026-04-06T10:30:00Z",
    "updatedAt": "2026-04-06T10:30:00Z"
  }
}
```

---

### PUT /users/me

Update the authenticated user's profile.

**Authentication:** Required

**Request Body:**

```json
{
  "firstName": "María",
  "lastName": "Gonzalez Perez",
  "phone": "+50688881234",
  "avatar": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Success Response (200):**

```json
{
  "data": {
    "id": "usr_2hK9xMmN3pQr",
    "email": "maria.gonzalez@email.com",
    "firstName": "María",
    "lastName": "Gonzalez Perez",
    "role": "patient",
    "phone": "+50688881234",
    "avatar": "https://cdn.cora.health/avatars/usr_2hK9xMmN3pQr.jpg",
    "profileComplete": false,
    "updatedAt": "2026-04-06T11:00:00Z"
  }
}
```

---

### GET /users/:id

Get a user's public profile (used for psychologist profiles).

**Authentication:** Optional

**Success Response (200) - Psychologist:**

```json
{
  "data": {
    "id": "usr_psy_abc123",
    "role": "psychologist",
    "firstName": "Carlos",
    "lastName": "Rodriguez",
    "avatar": "https://cdn.cora.health/avatars/usr_psy_abc123.jpg",
    "title": "Psicólogo Clínico",
    "specializations": [
      "Ansiedad",
      "Depresión",
      "Terapia de Pareja"
    ],
    "languages": ["Español", "Inglés"],
    "experience": 12,
    "rating": 4.8,
    "reviewCount": 47,
    "bio": "Especialista en terapia cognitivo-conductual con énfasis en trastornos de ansiedad...",
    "license": "CPC-2024-1234",
    "verified": true,
    "sessionPrice": 60,
    "currency": "USD"
  }
}
```

---

### PUT /users/me/patient-profile

Complete patient profile setup.

**Authentication:** Required (patient role)

**Request Body:**

```json
{
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "emergencyContact": {
    "name": "Juan Gonzalez",
    "phone": "+50688885555",
    "relationship": "spouse"
  },
  "reasonForConsultation": "ansiedad",
  "preferredLanguage": "es"
}
```

**Success Response (200):**

```json
{
  "data": {
    "profileComplete": true,
    "message": "Profile setup completed"
  }
}
```

---

### PUT /users/me/psychologist-profile

Complete psychologist profile setup.

**Authentication:** Required (psychologist role)

**Request Body:**

```json
{
  "title": "Psicólogo Clínico",
  "specializations": ["ansiedad", "depresion", "terapia-pareja"],
  "languages": ["Español", "Inglés"],
  "experience": 12,
  "bio": "Especialista en terapia cognitivo-conductual...",
  "license": "CPC-2024-1234",
  "sessionPrice": 60,
  "currency": "USD",
  "availability": {
    "monday": ["09:00-12:00", "14:00-18:00"],
    "wednesday": ["09:00-12:00", "14:00-18:00"],
    "friday": ["09:00-12:00"]
  }
}
```

---

## 4. Appointments Endpoints

### GET /appointments

List appointments for the authenticated user.

**Authentication:** Required

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| status | enum | all | `scheduled`, `completed`, `cancelled`, `all` |
| from | date | today | Start date (ISO 8601) |
| to | date | +30 days | End date (ISO 8601) |
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page (max 50) |

**Success Response (200):**

```json
{
  "data": {
    "appointments": [
      {
        "id": "apt_xyz789",
        "psychologist": {
          "id": "usr_psy_abc123",
          "firstName": "Carlos",
          "lastName": "Rodriguez",
          "avatar": "https://cdn.cora.health/avatars/usr_psy_abc123.jpg"
        },
        "patient": {
          "id": "usr_2hK9xMmN3pQr",
          "firstName": "María",
          "lastName": "Gonzalez"
        },
        "scheduledAt": "2026-04-10T15:00:00Z",
        "duration": 50,
        "status": "scheduled",
        "type": "video",
        "notes": null,
        "createdAt": "2026-04-06T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### POST /appointments

Create a new appointment.

**Authentication:** Required

**Request Body:**

```json
{
  "psychologistId": "usr_psy_abc123",
  "scheduledAt": "2026-04-10T15:00:00Z",
  "duration": 50,
  "type": "video",
  "reason": "Sesión de seguimiento - ansiedad",
  "paymentIntentId": "pi_abc123xyz"
}
```

**Success Response (201):**

```json
{
  "data": {
    "appointment": {
      "id": "apt_new456",
      "psychologistId": "usr_psy_abc123",
      "patientId": "usr_2hK9xMmN3pQr",
      "scheduledAt": "2026-04-10T15:00:00Z",
      "duration": 50,
      "status": "scheduled",
      "type": "video",
      "reason": "Sesión de seguimiento - ansiedad",
      "roomId": "room_abc123",
      "createdAt": "2026-04-06T12:00:00Z"
    }
  }
}
```

**Error Response (400 - Slot unavailable):**

```json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The requested time slot is no longer available",
    "requestId": "req_abc123"
  }
}
```

---

### GET /appointments/:id

Get a specific appointment.

**Authentication:** Required (participant only)

**Success Response (200):**

```json
{
  "data": {
    "id": "apt_xyz789",
    "psychologist": {
      "id": "usr_psy_abc123",
      "firstName": "Carlos",
      "lastName": "Rodriguez",
      "avatar": "https://cdn.cora.health/avatars/usr_psy_abc123.jpg"
    },
    "patient": {
      "id": "usr_2hK9xMmN3pQr",
      "firstName": "María",
      "lastName": "Gonzalez"
    },
    "scheduledAt": "2026-04-10T15:00:00Z",
    "duration": 50,
    "status": "scheduled",
    "type": "video",
    "roomId": "room_abc123",
    "meetingUrl": "https://app.cora.health/session/room_abc123",
    "createdAt": "2026-04-06T10:00:00Z",
    "cancelledAt": null,
    "cancellationReason": null
  }
}
```

---

### PUT /appointments/:id

Update an appointment.

**Authentication:** Required (participant only, scheduling restrictions apply)

**Request Body:**

```json
{
  "scheduledAt": "2026-04-11T16:00:00Z",
  "notes": "Paciente solicita cambio de horario"
}
```

**Success Response (200):**

```json
{
  "data": {
    "appointment": {
      "id": "apt_xyz789",
      "scheduledAt": "2026-04-11T16:00:00Z",
      "status": "scheduled",
      "updatedAt": "2026-04-06T13:00:00Z"
    }
  }
}
```

---

### DELETE /appointments/:id

Cancel an appointment.

**Authentication:** Required (participant only)

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| reason | string | No | Cancellation reason |

**Success Response (200):**

```json
{
  "data": {
    "appointment": {
      "id": "apt_xyz789",
      "status": "cancelled",
      "cancelledAt": "2026-04-06T14:00:00Z",
      "cancellationReason": "Scheduling conflict"
    },
    "refund": {
      "status": "processing",
      "amount": 60,
      "currency": "USD"
    }
  }
}
```

---

### POST /appointments/:id/complete

Mark an appointment as completed.

**Authentication:** Required (psychologist role only)

**Success Response (200):**

```json
{
  "data": {
    "appointment": {
      "id": "apt_xyz789",
      "status": "completed",
      "completedAt": "2026-04-10T15:50:00Z"
    }
  }
}
```

---

## 5. Payments Endpoints

### POST /payments/create-intent

Create a Stripe payment intent for appointment booking.

**Authentication:** Required

**Request Body:**

```json
{
  "appointmentId": "apt_new456",
  "amount": 60,
  "currency": "USD"
}
```

**Success Response (201):**

```json
{
  "data": {
    "paymentIntent": {
      "id": "pi_abc123xyz",
      "clientSecret": "pi_abc123xyz_secret_def456",
      "amount": 6000,
      "currency": "usd",
      "status": "requires_payment_method"
    }
  }
}
```

---

### POST /payments/confirm

Confirm a payment was successful (webhook handler).

**Authentication:** Webhook signature verification

**Request Body:**

```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_abc123xyz",
      "amount": 6000,
      "status": "succeeded"
    }
  }
}
```

---

### GET /payments/history

Get payment history for the authenticated user.

**Authentication:** Required

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page |

**Success Response (200):**

```json
{
  "data": {
    "payments": [
      {
        "id": "pay_xyz789",
        "appointmentId": "apt_xyz789",
        "amount": 60,
        "currency": "USD",
        "status": "succeeded",
        "method": "card",
        "createdAt": "2026-04-06T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### GET /subscriptions

Get current subscription status.

**Authentication:** Required

**Success Response (200):**

```json
{
  "data": {
    "subscription": {
      "id": "sub_abc123",
      "plan": "monthly",
      "status": "active",
      "currentPeriodStart": "2026-04-01T00:00:00Z",
      "currentPeriodEnd": "2026-05-01T00:00:00Z",
      "price": 49.99,
      "currency": "USD"
    }
  }
}
```

---

### POST /subscriptions

Create a new subscription.

**Authentication:** Required

**Request Body:**

```json
{
  "plan": "monthly",
  "paymentMethodId": "pm_abc123xyz"
}
```

**Available Plans:**

| Plan | Price | Currency |
|------|-------|----------|
| monthly | 49.99 | USD |
| annual | 399.99 | USD |

**Success Response (201):**

```json
{
  "data": {
    "subscription": {
      "id": "sub_new456",
      "plan": "monthly",
      "status": "active",
      "currentPeriodStart": "2026-04-06T00:00:00Z",
      "currentPeriodEnd": "2026-05-06T00:00:00Z"
    }
  }
}
```

---

### DELETE /subscriptions/:id

Cancel a subscription.

**Authentication:** Required

**Success Response (200):**

```json
{
  "data": {
    "subscription": {
      "id": "sub_abc123",
      "status": "cancelled",
      "cancelledAt": "2026-04-06T14:00:00Z",
      "currentPeriodEnd": "2026-05-01T00:00:00Z"
    }
  }
}
```

---

## 6. Sessions Endpoints (WebRTC Signaling)

### GET /sessions/:appointmentId/token

Get WebRTC credentials for a session.

**Authentication:** Required (participant only)

**Success Response (200):**

```json
{
  "data": {
    "roomId": "room_abc123",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "iceServers": [
      {
        "urls": "stun:stun.cora.health:3478"
      },
      {
        "urls": "turn:turn.cora.health:3478",
        "username": "user123",
        "credential": "abc123xyz"
      }
    ],
    "expiresAt": "2026-04-10T16:00:00Z"
  }
}
```

---

### POST /sessions/:roomId/signal

Send signaling data (offer/answer/ICE candidate).

**Authentication:** Required (participant only)

**Request Body:**

```json
{
  "type": "offer",
  "payload": {
    "sdp": "v=0\r\no=- 1234567890 2 IN IP4 127.0.0.1...",
    "type": "offer"
  }
}
```

**Signal Types:**

| Type | Description |
|------|-------------|
| `offer` | SDP offer from caller |
| `answer` | SDP answer from callee |
| `ice-candidate` | ICE candidate |
| `leave` | Participant leaving |

---

### POST /sessions/:roomId/recording/start

Start session recording (psychologist only).

**Authentication:** Required (psychologist role only)

**Success Response (200):**

```json
{
  "data": {
    "recordingId": "rec_abc123",
    "status": "started",
    "startedAt": "2026-04-10T15:00:00Z"
  }
}
```

---

### POST /sessions/:roomId/recording/stop

Stop session recording.

**Authentication:** Required (psychologist role only)

**Success Response (200):**

```json
{
  "data": {
    "recordingId": "rec_abc123",
    "status": "processing",
    "duration": 2940,
    "downloadUrl": null
  }
}
```

---

### GET /sessions/:appointmentId/chat

Get chat history for a session.

**Authentication:** Required (participant only)

**Success Response (200):**

```json
{
  "data": {
    "messages": [
      {
        "id": "msg_abc123",
        "senderId": "usr_psy_abc123",
        "senderName": "Carlos Rodriguez",
        "content": "Buenos días, ¿cómo te sientes hoy?",
        "sentAt": "2026-04-10T15:02:00Z"
      }
    ]
  }
}
```

---

### POST /sessions/:roomId/chat

Send a chat message during session.

**Authentication:** Required (participant only)

**Request Body:**

```json
{
  "content": "Me siento un poco mejor que la semana pasada"
}
```

**Success Response (201):**

```json
{
  "data": {
    "message": {
      "id": "msg_def456",
      "senderId": "usr_2hK9xMmN3pQr",
      "senderName": "María Gonzalez",
      "content": "Me siento un poco mejor que la semana pasada",
      "sentAt": "2026-04-10T15:05:00Z"
    }
  }
}
```

---

## 7. Reviews Endpoints

### POST /reviews

Create a review for a psychologist.

**Authentication:** Required (patient, must have completed appointment)

**Request Body:**

```json
{
  "psychologistId": "usr_psy_abc123",
  "appointmentId": "apt_xyz789",
  "rating": 5,
  "title": "Excelente profesional",
  "content": "Dr. Rodriguez es muy empático y profesional. Me ayudó mucho con mis problemas de ansiedad.",
  "recommend": true
}
```

| Field | Type | Required | Description |
|-------|------|---------|-------------|
| psychologistId | string | Yes | Psychologist's user ID |
| appointmentId | string | Yes | Completed appointment ID |
| rating | integer | Yes | 1-5 stars |
| title | string | No | Review title (max 100 chars) |
| content | string | Yes | Review content (min 20, max 1000 chars) |
| recommend | boolean | Yes | Would recommend |

**Success Response (201):**

```json
{
  "data": {
    "review": {
      "id": "rev_abc123",
      "psychologistId": "usr_psy_abc123",
      "patientId": "usr_2hK9xMmN3pQr",
      "rating": 5,
      "title": "Excelente profesional",
      "content": "Dr. Rodriguez es muy empático y profesional...",
      "recommend": true,
      "createdAt": "2026-04-10T16:00:00Z"
    }
  }
}
```

**Error Response (400 - Already reviewed):**

```json
{
  "error": {
    "code": "REVIEW_EXISTS",
    "message": "You have already reviewed this appointment",
    "requestId": "req_abc123"
  }
}
```

---

### GET /psychologists/:id/reviews

Get reviews for a psychologist.

**Authentication:** Optional

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page (max 50) |
| sort | enum | recent | `recent`, `highest`, `lowest` |

**Success Response (200):**

```json
{
  "data": {
    "reviews": [
      {
        "id": "rev_abc123",
        "rating": 5,
        "title": "Excelente profesional",
        "content": "Dr. Rodriguez es muy empático y profesional...",
        "recommend": true,
        "patient": {
          "firstName": "María",
          "avatar": null
        },
        "createdAt": "2026-04-10T16:00:00Z"
      }
    ],
    "summary": {
      "average": 4.8,
      "total": 47,
      "distribution": {
        "5": 35,
        "4": 8,
        "3": 3,
        "2": 1,
        "1": 0
      }
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 47,
      "totalPages": 5
    }
  }
}
```

---

## 8. Community Endpoints

### GET /posts

List community posts.

**Authentication:** Optional

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| category | enum | all | `all`, `experiences`, `resources`, `questions`, `support` |
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page |

**Success Response (200):**

```json
{
  "data": {
    "posts": [
      {
        "id": "post_abc123",
        "author": {
          "id": "usr_2hK9xMmN3pQr",
          "firstName": "María",
          "avatar": null,
          "role": "patient"
        },
        "title": "Mi experiencia con la terapia online",
        "content": "Quiero compartir cómo comenzó mi viaje...",
        "category": "experiences",
        "likeCount": 24,
        "commentCount": 8,
        "isLiked": false,
        "createdAt": "2026-04-05T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### POST /posts

Create a new community post.

**Authentication:** Required

**Request Body:**

```json
{
  "title": "Mi experiencia con la terapia online",
  "content": "Quiero compartir cómo comenzó mi viaje con la terapia en Cora...",
  "category": "experiences",
  "tags": ["terapia-online", "bienestar", "ansiedad"],
  "allowComments": true,
  "isAnonymous": false
}
```

**Success Response (201):**

```json
{
  "data": {
    "post": {
      "id": "post_new456",
      "title": "Mi experiencia con la terapia online",
      "content": "Quiero compartir cómo comenzó mi viaje...",
      "category": "experiences",
      "tags": ["terapia-online", "bienestar", "ansiedad"],
      "allowComments": true,
      "isAnonymous": false,
      "authorId": "usr_2hK9xMmN3pQr",
      "createdAt": "2026-04-06T15:00:00Z"
    }
  }
}
```

---

### GET /posts/:id

Get a specific post with comments.

**Authentication:** Optional

**Success Response (200):**

```json
{
  "data": {
    "post": {
      "id": "post_abc123",
      "author": {
        "id": "usr_2hK9xMmN3pQr",
        "firstName": "María",
        "avatar": null
      },
      "title": "Mi experiencia con la terapia online",
      "content": "Quiero compartir cómo comenzó mi viaje...",
      "category": "experiences",
      "tags": ["terapia-online", "bienestar", "ansiedad"],
      "likeCount": 24,
      "commentCount": 8,
      "isLiked": false,
      "createdAt": "2026-04-05T10:00:00Z",
      "updatedAt": "2026-04-05T10:00:00Z"
    },
    "comments": [
      {
        "id": "cmt_abc123",
        "author": {
          "id": "usr_xyz789",
          "firstName": "Ana",
          "avatar": null
        },
        "content": "Gracias por compartir tu experiencia...",
        "likeCount": 5,
        "isLiked": false,
        "createdAt": "2026-04-05T12:00:00Z"
      }
    ]
  }
}
```

---

### PUT /posts/:id

Update a post (author only).

**Authentication:** Required (author only)

**Request Body:**

```json
{
  "title": "Mi experiencia actualizada",
  "content": "Contenido actualizado...",
  "tags": ["terapia-online", "actualizado"]
}
```

---

### DELETE /posts/:id

Delete a post.

**Authentication:** Required (author or admin)

**Success Response (200):**

```json
{
  "data": {
    "message": "Post deleted successfully"
  }
}
```

---

### POST /posts/:id/like

Like a post.

**Authentication:** Required

**Success Response (200):**

```json
{
  "data": {
    "liked": true,
    "likeCount": 25
  }
}
```

---

### DELETE /posts/:id/like

Unlike a post.

**Authentication:** Required

**Success Response (200):**

```json
{
  "data": {
    "liked": false,
    "likeCount": 24
  }
}
```

---

### GET /posts/:id/comments

Get comments for a post.

**Authentication:** Optional

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page |

---

### POST /posts/:id/comments

Add a comment to a post.

**Authentication:** Required

**Request Body:**

```json
{
  "content": "Gracias por compartir tu experiencia, me-identifico mucho con lo que describes."
}
```

**Success Response (201):**

```json
{
  "data": {
    "comment": {
      "id": "cmt_new789",
      "postId": "post_abc123",
      "author": {
        "id": "usr_2hK9xMmN3pQr",
        "firstName": "María",
        "avatar": null
      },
      "content": "Gracias por compartir tu experiencia...",
      "likeCount": 0,
      "createdAt": "2026-04-06T16:00:00Z"
    }
  }
}
```

---

### DELETE /posts/:id/comments/:commentId

Delete a comment.

**Authentication:** Required (comment author or post author)

**Success Response (200):**

```json
{
  "data": {
    "message": "Comment deleted successfully"
  }
}
```

---

## Appendix A: Rate Limiting

| Endpoint Pattern | Limit | Window |
|-----------------|-------|--------|
| `POST /auth/*` | 10 | per minute |
| `POST /payments/*` | 20 | per minute |
| `GET /posts/*` | 100 | per minute |
| `POST /posts` | 5 | per minute |
| All others | 60 | per minute |

Rate limit headers included in responses:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 55
X-RateLimit-Reset: 1712404800
```

---

## Appendix B: Webhook Events

Subscribe to events at `POST /webhooks` with Stripe signature verification.

| Event | Description |
|-------|-------------|
| `payment_intent.succeeded` | Payment completed |
| `payment_intent.failed` | Payment failed |
| `subscription.created` | New subscription |
| `subscription.updated` | Subscription renewed/cancelled |
| `appointment.reminder` | 24h/1h before appointment |

---

## Appendix C: curl Examples

### Register

```bash
curl -X POST https://api.cora.health/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "patient",
    "acceptTerms": true,
    "acceptPrivacyPolicy": true
  }'
```

### Login

```bash
curl -X POST https://api.cora.health/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Appointment

```bash
curl -X POST https://api.cora.health/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "psychologistId": "usr_psy_abc123",
    "scheduledAt": "2026-04-10T15:00:00Z",
    "duration": 50,
    "type": "video",
    "reason": "Primera consulta"
  }'
```

---

*Document Version: 1.0.0 | Last Updated: 2026-04-06*
