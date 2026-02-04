# Especificación de Servicios Backend (Requerimientos)

Este documento detalla los endpoints y servicios que el frontend espera del backend (Supabase o API Custom).

## 1. Autenticación y Usuarios (`AuthService`)

- **POST /auth/login**: Iniciar sesión (Email/Password o OAuth).
  - _Input_: `{ email, password }`
  - _Output_: `{ user, session_token }`
- **POST /auth/logout**: Cerrar sesión.
- **GET /users/profile**: Obtener datos del usuario actual.
  - _Output_: `User` (incluyendo `role`, `rank`, `oasisScore`, `organizationId`).
- **PUT /users/profile**: Actualizar perfil del usuario (avatar, nombre).

## 2. Gamificación (`GamificationService`)

- **GET /gamification/stats**: Obtener puntaje, rango y medallas del usuario.
- **POST /gamification/progress**: Registrar una actividad completada para sumar puntos.
  - _Input_: `{ userId, activityType, resourceId, points }`

## 3. Viajes de Aprendizaje (`JourneyService`)

- **GET /journeys**: Obtener lista de viajes disponibles para el usuario (filtrado por rol/visibilidad).
  - _Output_: `Journey[]` (con estado `active`, `completed`, `progress`).
- **GET /journeys/:id**: Obtener detalles de un viaje, incluyendo sus nodos y conexiones.
- **POST /journeys/:id/nodes/:nodeId/complete**: Marcar un nodo como completado.
  - _Lógica Backend_: Verificar requisitos, actualizar estado del nodo, desbloquear nodos siguientes, sumar puntos al usuario.

## 4. Gestión de Contenido (`ContentService`)

- **GET /announcements**: Obtener noticias/anuncios (filtrados por fecha reciente).
- **POST /announcements** (Admin): Crear un nuevo anuncio.
- **GET /resources**: Obtener biblioteca de recursos.
- **POST /resources** (Admin): Subir/Crear nuevo recurso.
- **POST /resources/:id/read**: Marcar recurso como leído (suma puntos).

## 5. CRM y Administración (`CRMService`)

- **GET /admin/users**: Listar todos los usuarios (paginado, con filtros por Organización, Rango, Riesgo).
  - _Output_: `CRMUser[]` (versión resumida para tabla).
- **GET /admin/users/:id/details**: Obtener perfil completo de un usuario para el CRM.
  - _Output_: Detalles extendidos + `ActivityLog` + Desglose de `OasisScore`.
- **GET /admin/stats**: Obtener métricas generales para el Dashboard de Analítica (ej. usuarios activos, viajes completados).

## Modelo de Datos Clave (Referencia)

- **User**: `id, email, password_hash, role, rank, oasis_score, organization_id`
- **Journey**: `id, title, description, category, nodes (jsonb o relación)`
- **UserJourneyProgress**: `user_id, journey_id, node_status (map), percentage`
- **ActivityLog**: `id, user_id, type, description, points_earned, created_at`
