## ADDED Requirements

### Requirement: Botón de perfil en sidebar y header móvil
El layout autenticado SHALL reemplazar el botón de logout por un botón de perfil (icono `pi-user`) que navega a `/profile`, tanto en el sidebar de escritorio como en el header móvil.

#### Scenario: Click en botón de perfil (desktop)
- **WHEN** el usuario hace click en el botón de perfil del sidebar
- **THEN** la aplicación navega a la ruta `/profile`

#### Scenario: Click en botón de perfil (móvil)
- **WHEN** el usuario hace click en el botón de perfil del header móvil
- **THEN** la aplicación navega a la ruta `/profile`

#### Scenario: Botón de logout ya no está en sidebar ni header
- **WHEN** el usuario está en cualquier pantalla de la app
- **THEN** no existe botón de logout directo en el sidebar ni en el header móvil

### Requirement: Pantalla de perfil muestra información del usuario
El componente `UserProfileComponent` en la ruta `/profile` SHALL mostrar el nombre y el email del usuario autenticado, obtenidos de `AuthService.currentUser()`.

#### Scenario: Ver datos del usuario
- **WHEN** el usuario navega a `/profile`
- **THEN** se muestran su nombre y su email

#### Scenario: Datos ausentes no rompen la pantalla
- **WHEN** `currentUser()` tiene `name` null
- **THEN** la pantalla muestra el email y omite o deja vacío el nombre sin error

### Requirement: Botón de logout en pantalla de perfil
La pantalla de perfil SHALL incluir un botón de cerrar sesión que llame a `AuthService.logout()` y redirija a `/login`.

#### Scenario: Click en logout desde perfil
- **WHEN** el usuario hace click en "Cerrar sesión" en la pantalla de perfil
- **THEN** se ejecuta el logout y el usuario es redirigido a `/login`

### Requirement: Botón de cambio de contraseña en pantalla de perfil
La pantalla de perfil SHALL incluir un botón "Cambiar contraseña" que abra el diálogo de cambio de contraseña.

#### Scenario: Abrir diálogo de cambio de contraseña
- **WHEN** el usuario hace click en "Cambiar contraseña"
- **THEN** se muestra el diálogo de cambio de contraseña con los tres campos vacíos

### Requirement: Ruta /profile protegida por authGuard
La ruta `/profile` SHALL estar protegida por el `authGuard` existente, igual que el resto de rutas del layout.

#### Scenario: Usuario no autenticado intenta acceder a /profile
- **WHEN** un usuario no autenticado navega directamente a `/profile`
- **THEN** el guard redirige a `/login`
