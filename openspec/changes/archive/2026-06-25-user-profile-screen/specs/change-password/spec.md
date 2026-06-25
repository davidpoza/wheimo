## ADDED Requirements

### Requirement: Endpoint POST /users/me/password
El backend SHALL exponer `POST /users/me/password` (autenticado) que acepta `{ currentPassword, newPassword }`, valida la contraseña actual contra el hash almacenado, y si es correcta actualiza `password_hash` con el hash de `newPassword`.

#### Scenario: Cambio de contraseña exitoso
- **WHEN** se hace `POST /users/me/password` con `currentPassword` correcto y `newPassword` no vacío
- **THEN** el sistema devuelve 200 y actualiza `password_hash` en la BD con el hash de `newPassword`

#### Scenario: Contraseña actual incorrecta
- **WHEN** se hace `POST /users/me/password` con `currentPassword` incorrecto
- **THEN** el sistema devuelve 400 con mensaje de error descriptivo

#### Scenario: Nueva contraseña vacía
- **WHEN** se hace `POST /users/me/password` con `newPassword` vacío o en blanco
- **THEN** el sistema devuelve 400

#### Scenario: Usuario no autenticado
- **WHEN** se hace `POST /users/me/password` sin token de autenticación
- **THEN** el sistema devuelve 401

### Requirement: Diálogo de cambio de contraseña en el frontend
El `UserProfileComponent` SHALL incluir un `p-dialog` con tres campos: contraseña actual, nueva contraseña y confirmación de nueva contraseña.

#### Scenario: Validación de coincidencia de contraseñas
- **WHEN** el usuario introduce valores distintos en "nueva contraseña" y "confirmar contraseña"
- **THEN** el botón de guardar está deshabilitado o se muestra error de validación, y no se llama a la API

#### Scenario: Campos vacíos bloquean el envío
- **WHEN** alguno de los tres campos está vacío
- **THEN** el botón de guardar está deshabilitado

#### Scenario: Cambio exitoso muestra toast y cierra diálogo
- **WHEN** el usuario rellena los tres campos correctamente y hace click en guardar
- **AND** el backend devuelve 200
- **THEN** el diálogo se cierra y se muestra un toast de éxito

#### Scenario: Error de contraseña actual muestra toast de error
- **WHEN** el backend devuelve 400 (contraseña actual incorrecta)
- **THEN** se muestra un toast de error con el mensaje recibido y el diálogo permanece abierto

#### Scenario: Cerrar diálogo limpia los campos
- **WHEN** el usuario cierra el diálogo sin guardar
- **THEN** los tres campos quedan vacíos al volver a abrir el diálogo

### Requirement: Método changePassword en AuthService (o UserService frontend)
El servicio de autenticación del frontend SHALL exponer un método `changePassword(currentPassword, newPassword)` que haga `POST /users/me/password` con las credenciales y devuelva un Observable.

#### Scenario: Llamada correcta a la API
- **WHEN** se llama a `changePassword('old', 'new')`
- **THEN** se realiza `POST /users/me/password` con body `{ currentPassword: 'old', newPassword: 'new' }` y cabecera Authorization
