# Cora - Diagramas de Arquitectura

> Plataforma de Terapia Online | Documentacion de Diagramas

## Descripcion

Este directorio contiene todos los diagramas de arquitectura del proyecto Cora, organizados por nivel de detalle.

## Estructura

```
modulos/
├── nivel0/                    # Arquitectura General
│   └── Cora_Arquitectura_General.drawio
├── nivel1/                    # Detalle por Modulo
│   ├── 01_Autenticacion_Usuarios/
│   │   └── Cora_Autenticacion_Detallado.drawio
│   ├── 02_Sesiones_Terapeuticas/
│   │   └── Cora_Sesiones_Detallado.drawio
│   ├── 03_Gestion_de_Citas/
│   │   └── Cora_Citas_Detallado.drawio
│   ├── 04_Pagos_y_Suscripciones/
│   │   └── Cora_Pagos_Detallado.drawio
│   ├── 05_Comunidad_y_Contenido/
│   │   └── Cora_Comunidad_Detallado.drawio
│   ├── 06_Calificaciones_y_Feedback/
│   │   └── Cora_Calificaciones_Detallado.drawio
│   ├── 07_Sala_de_Reunion_Virtual/
│   │   └── Cora_SalaVirtual_Detallado.drawio
│   └── 08_Panel_Administracion/
│       └── Cora_Panel_Administracion_Detallado.drawio
├── flujos/                    # Diagramas de Flujo
│   └── aplicacion/
│       └── Flujo_Principal_Aplicacion.drawio
└── negocio/                   # Diagramas de Negocio (futuro)
```

## Convenciones

### Nombramiento
- Patron: `Cora_[Modulo]_[Nivel]_[Descripcion].drawio`
- Ejemplo: `Cora_Autenticacion_Detallado.drawio`

### Colores
- **Azul (#4A90E2)**: Modulos Core
- **Verde (#7ED321)**: Modulos de Soporte
- **Naranja (#F5A623)**: Modulos Transversales
- **Gris Oscuro (#2C3E50)**: Panel de Administracion
- **Rojo (#DC3545)**: Componentes Criticos/Seguridad

### Metadata
Cada diagrama incluye: titulo, version (YYYYMMDD), fecha, autor

## Diagramas Creados

### Nivel 0 - Arquitectura General
- [Cora_Arquitectura_General.drawio](nivel0/Cora_Arquitectura_General.drawio) - Vista de los 8 modulos principales (incluye Panel de Admin) y sus interacciones

### Nivel 1 - Detalle por Modulo
1. [Autenticacion y Gestion de Usuarios](nivel1/01_Autenticacion_Usuarios/Cora_Autenticacion_Detallado.drawio)
2. [Sesiones Terapeuticas](nivel1/02_Sesiones_Terapeuticas/Cora_Sesiones_Detallado.drawio)
3. [Gestion de Citas y Calendario](nivel1/03_Gestion_de_Citas/Cora_Citas_Detallado.drawio)
4. [Pagos y Suscripciones](nivel1/04_Pagos_y_Suscripciones/Cora_Pagos_Detallado.drawio)
5. [Comunidad y Contenido (Blog)](nivel1/05_Comunidad_y_Contenido/Cora_Comunidad_Detallado.drawio)
6. [Calificaciones y Feedback](nivel1/06_Calificaciones_y_Feedback/Cora_Calificaciones_Detallado.drawio)
7. [Sala de Reunion Virtual](nivel1/07_Sala_de_Reunion_Virtual/Cora_SalaVirtual_Detallado.drawio)
8. **[Panel de Administracion](nivel1/08_Panel_Administracion/Cora_Panel_Administracion_Detallado.drawio)** - Dashboard, gestion de usuarios, aprobaciones, reportes, auditoria

### Flujo de Aplicacion
- [Flujo Principal de la Aplicacion](flujos/aplicacion/Flujo_Principal_Aplicacion.drawio) - Flujo completo: registro → busqueda → agendamiento → pago → sesion → calificacion

## Documentos de Requisitos (Word)

Los documentos Word detallados de requisitos para cada modulo estan en:
`D:\cora\requisitos\word\`

| # | Modulo | Documento |
|---|--------|-----------|
| 1 | Autenticacion y Gestion de Usuarios | [01_Autenticacion_Usuarios_Requisitos.docx](../requisitos/word/01_Autenticacion_Usuarios_Requisitos.docx) |
| 2 | Sesiones Terapeuticas | [02_Sesiones_Terapeuticas_Requisitos.docx](../requisitos/word/02_Sesiones_Terapeuticas_Requisitos.docx) |
| 3 | Gestion de Citas y Calendario | [03_Gestion_de_Citas_Requisitos.docx](../requisitos/word/03_Gestion_de_Citas_Requisitos.docx) |
| 4 | Pagos y Suscripciones | [04_Pagos_y_Suscripciones_Requisitos.docx](../requisitos/word/04_Pagos_y_Suscripciones_Requisitos.docx) |
| 5 | Comunidad y Contenido (Blog) | [05_Comunidad_y_Contenido_Requisitos.docx](../requisitos/word/05_Comunidad_y_Contenido_Requisitos.docx) |
| 6 | Calificaciones y Feedback | [06_Calificaciones_y_Feedback_Requisitos.docx](../requisitos/word/06_Calificaciones_y_Feedback_Requisitos.docx) |
| 7 | Sala de Reunion Virtual | [07_Sala_de_Reunion_Virtual_Requisitos.docx](../requisitos/word/07_Sala_de_Reunion_Virtual_Requisitos.docx) |
| 8 | Panel de Administracion | [08_Panel_Administracion_Requisitos.docx](../requisitos/word/08_Panel_Administracion_Requisitos.docx) |

## Documentacion en Obsidian

Las notas detalladas de cada modulo estan en:
`D:\global\mi-second-brain\Proyectos\Cora\Arquitectura\`

- [00_Indice.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/00_Indice.md) - Indice principal
- [01_Modulo_01_Autenticacion.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/01_Modulo_01_Autenticacion.md)
- [02_Modulo_02_Sesiones.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/02_Modulo_02_Sesiones.md)
- [03_Modulo_03_Citas.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/03_Modulo_03_Citas.md)
- [04_Modulo_04_Pagos.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/04_Modulo_04_Pagos.md)
- [05_Modulo_05_Comunidad.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/05_Modulo_05_Comunidad.md)
- [06_Modulo_06_Calificaciones.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/06_Modulo_06_Calificaciones.md)
- [07_Modulo_07_SalaVirtual.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/07_Modulo_07_SalaVirtual.md)
- [08_Modulo_08_PanelAdministracion.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/08_Modulo_08_PanelAdministracion.md)
- [09_Flujos_Criticos.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/09_Flujos_Criticos.md)
- [10_Modelo_Negocio.md](../../D:/global/mi-second-brain/Proyectos/Cora/Arquitectura/10_Modelo_Negocio.md)

## Metadata
- **Version**: 1.1 (incluye Panel de Administracion y Flujo de Aplicacion)
- **Fecha**: 04/04/2026
- **Autor**: Joan Mora Rojas
- **Proyecto**: Cora - Plataforma de Terapia Online
