# Proyecto Cora - Contexto Técnico

## Stack Detectado
- **Frontend**: Posible React/Vue/Angular (basado en requerimientos de SPA para sesiones video/chat)
- **Backend**: Node.js/Python (inferido por necesidad de WebSockets, pagos, procesamiento de video)
- **Base de Datos**: PostgreSQL/MongoDB (relacional para usuarios/citas + documentos para blog/historial)
- **Tiempo Real**: WebSocket/Socket.IO (para sesiones video/chat en tiempo real)
- **Almacenamiento de Media**: AWS S3 o similar (para grabaciones de sesiones, imágenes de blog)
- **CDN**: Cloudflare/AWS CloudFront (para entrega global de contenido)
- **Pagos**: Stripe/PayPal API (procesamiento seguro mencionado en charter)
- **Video**: WebRTC (sesiones terapéuticas encriptadas)
- **Search**: Elasticsearch/Algolia (búsqueda en blog de experiencias)
- **Deployment**: Docker/Kubernetes (escalabilidad mencionada en factores críticos de éxito)
- **Monitoring**: Prometheus/Grafana (necesario para métricas de éxito)

## Arquitectura Detectada
- **Arquitectura de Microservicios** (inferida por escalabilidad y separación de responsabilidades)
- **Event-Driven** (para notificaciones, actualizaciones de estado)
- **API Gateway** (para gestión de servicios externos e internos)
- **CQRS** (posiblemente para lecturas/escrituras separadas en módulos de alto tráfico)
- **Caching**: Redis (para sesiones, leaderboard, cache de blog)

## Estándares y Calidad
- **Testing**: Jest/PyTest (implícito por necesidad de confiabilidad en manejo de datos sensibles)
- **Linting**: ESLint/Pylint (estándar profesional)
- **CI/CD**: GitHub Actions/GitLab CI (implícito por necesidad de despliegues frecuentes y seguros)
- **Seguridad**: OWASP Top 10, GDPR/Ley 8968 compliance (mencionado explícitamente)
- **Privacidad**: Encriptación end-to-end para sesiones, manejo conforme a HIPAA-equivalente

## Patrones Observados en Requisitos
- **Separación de Contextos** (Autenticación vs Sesiones vs Pagos vs Comunidad)
- **Saga Pattern** (para transacciones distribuidas como pago + confirmación de cita)
- **Circuit Breaker** (para integraciones externas de pago y video)
- **Rate Limiting** (para prevenir abuso en sistema de citas y pagos)
- **Audit Logging** (requerido por compliance ético y legal)

## Convenciones de Proyecto
- **Naming**: camelCase para JS/TS, snake_case para Python/DB
- **API**: RESTful con versiones (v1, v2) + WebSockets para tiempo real
- **Base de Datos**: UUIDs para identificación de entidades, timestamps auditables
- **Documentación**: Swagger/OpenAPI para APIs, diagramas de arquitectura
- **Despliegue**: Blue-green o canary para minimizar riesgo en producción

## Restricciones Técnicas Identificadas
- **Latencia Baja Crítica**: Sesiones terapéuticas requieren <100ms latency
- **Concurrencia Alta**: Muchos usuarios simultáneos en video/chat
- **Almacenamiento Seguro**: Datos sensibles de salud mental requieren encriptación en reposo y tránsito
- **Escalabilidad Horizontal**: Debe soportar crecimiento rápido de usuarios
- **Disponibilidad**: Servicio crítico para salud mental - alta disponibilidad requerida
- **Compliance**: Debe cumplir con regulaciones de salud mental y protección de datos específicos de Costa Rica

## Brechas de Tecnología Identificadas
- Necesita selección definitiva de stack frontend
- Requiere definición de proveedor de video WebRTC
- Necesita estrategia de manejo de archivos médicos sensibles
- Requiere plan de recuperación ante desastres (RTO/RPO)
- Necesita estrategia de testing de rendimiento para sesiones video