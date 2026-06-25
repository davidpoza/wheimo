## Why

El botón de logout está directamente expuesto en el sidebar/header sin pantalla de usuario, lo que impide acceder a acciones de perfil como el cambio de contraseña. Se necesita un punto centralizado de gestión de cuenta.

## What Changes

- El botón de logout del sidebar (desktop) y del header (móvil) se reemplaza por un botón/icono que navega a `/profile`
- Se añade una nueva ruta `/profile` con un componente `UserProfileComponent` que muestra:
  - Información del usuario (nombre, email)
  - Botón de cerrar sesión
  - Botón para cambiar contraseña (abre diálogo)
- Diálogo de cambio de contraseña con tres campos: contraseña actual, nueva contraseña y confirmación
- Nuevo endpoint backend `POST /users/me/password` que valida la contraseña actual y actualiza el hash

## Capabilities

### New Capabilities
- `user-profile-page`: Página Angular en `/profile` con info de usuario, logout y acceso a cambio de contraseña
- `change-password`: Endpoint backend + diálogo frontend para cambiar la contraseña del usuario autenticado

### Modified Capabilities
- (ninguna — el comportamiento del logout no cambia, solo el punto de entrada)

## Impact

- **Backend**: Nuevo método en `UserService` + nuevo endpoint en `UserController` (`POST /users/me/password`). Nuevo DTO `ChangePasswordRequest`. Usa el `PasswordEncoder` existente.
- **Frontend**: Nuevo componente `UserProfileComponent` con ruta lazy `/profile`. Modificación de `AppLayoutComponent` (HTML + TS) para reemplazar el botón de logout. Nuevo método `changePassword()` en `AuthService` (o servicio de usuario).
- **Rutas**: Se añade `/profile` como ruta hija dentro del layout autenticado.
- **Sin cambios de BD**: La contraseña ya está en la columna `password_hash` de `users`.
