## Context

La app usa Angular 18 standalone + PrimeNG en el frontend y Spring Boot + Spring Security en el backend. Las contraseñas se almacenan con BCrypt en `users.password_hash`. El `PasswordEncoder` ya está en el contexto de Spring. El sidebar y el header móvil actualmente tienen el botón de logout expuesto directamente; no existe pantalla de perfil ni endpoint de cambio de contraseña.

## Goals / Non-Goals

**Goals:**
- Añadir ruta `/profile` con pantalla de usuario (nombre, email, logout, cambio de contraseña)
- Reemplazar el botón de logout del sidebar y header móvil por un botón que navega a `/profile`
- Implementar `POST /users/me/password` en el backend (valida contraseña actual, actualiza hash)
- Diálogo de cambio de contraseña en el frontend con validación de confirmación

**Non-Goals:**
- Edición de nombre o email del usuario
- Recuperación de contraseña por email (reset flow)
- Gestión de sesiones múltiples o revocación de tokens al cambiar contraseña

## Decisions

### 1. Pantalla de perfil como ruta dedicada vs. modal/overlay

**Decisión**: Ruta `/profile` como página completa dentro del layout autenticado.

**Alternativas consideradas**:
- Dropdown en el sidebar: más compacto pero no escala si se añaden más acciones de cuenta.
- Modal: misma navegación que ahora pero sin URL propia, difícil de linkear o recargar.

**Rationale**: Una ruta dedicada es coherente con el patrón de navegación existente (cada sección tiene su ruta), da URL propia y es extensible.

### 2. Endpoint de cambio de contraseña: `POST /users/me/password`

**Decisión**: `POST /users/me/password` con body `{ currentPassword, newPassword, confirmPassword }`. La validación de `confirmPassword == newPassword` se hace en el frontend; el backend valida `currentPassword` contra el hash y actualiza.

**Alternativas consideradas**:
- `PATCH /users/me` extendiendo `UpdateUserRequest`: mezclaría semánticas distintas y expondría campos sensibles en un endpoint general.
- Confirmar contraseña solo en backend: redundante dado que el frontend ya lo puede validar; el backend confía en que la nueva contraseña es la deseada.

**Rationale**: Endpoint específico con responsabilidad única. El backend NO necesita `confirmPassword` porque es validación de UX.

### 3. Diálogo de cambio de contraseña: `p-dialog` de PrimeNG

**Decisión**: `p-dialog` inline en `UserProfileComponent` (no componente separado).

**Rationale**: El formulario es simple (3 campos) y solo se usa en esta pantalla. Un componente separado añadiría indirección sin beneficio.

### 4. Manejo de error de contraseña actual incorrecta

**Decisión**: El backend devuelve 400 con mensaje descriptivo; el frontend muestra un toast de error con `p-toast` (ya disponible globalmente).

## Risks / Trade-offs

- **No invalidación de tokens al cambiar contraseña** → Aceptado como no-goal por ahora; las sesiones existentes siguen válidas hasta expiración del JWT.
- **Validación de fortaleza de contraseña ausente** → Se delega al criterio futuro; por ahora solo se requiere que no sea vacía.
- **Confirmación de contraseña solo en frontend** → Si alguien llama directamente a la API puede omitirla, pero el backend aplica la nueva contraseña correctamente; no es un riesgo de seguridad.
