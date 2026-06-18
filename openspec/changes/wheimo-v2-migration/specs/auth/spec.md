## ADDED Requirements

### Requirement: Registro de usuario
El sistema SHALL permitir crear nuevos usuarios mediante email y contraseña. La contraseña SHALL almacenarse como hash bcrypt. El nivel por defecto SHALL ser `user`. El campo `active` SHALL inicializarse a `false`.

#### Scenario: Registro exitoso
- **WHEN** se realiza POST /api/auth/signup con email único, password y name válidos
- **THEN** el sistema crea el usuario en PostgreSQL con password hasheada y devuelve 201 con el objeto usuario (sin password)

#### Scenario: Email duplicado
- **WHEN** se realiza POST /api/auth/signup con un email ya registrado
- **THEN** el sistema devuelve 409 Conflict

#### Scenario: Datos inválidos
- **WHEN** se realiza POST /api/auth/signup con email malformado o password vacío
- **THEN** el sistema devuelve 400 Bad Request con detalle de validación

### Requirement: Inicio de sesión
El sistema SHALL autenticar usuarios por email y contraseña. En caso de éxito SHALL devolver un JWT de acceso (15 minutos) y establecer un refresh token en cookie HttpOnly (30 días).

#### Scenario: Login exitoso
- **WHEN** se realiza POST /api/auth/login con email y password correctos
- **THEN** el sistema devuelve 200 con `{ token, user: { id, email, name, lang, theme, level } }` y cookie `refresh_token` HttpOnly

#### Scenario: Credenciales incorrectas
- **WHEN** se realiza POST /api/auth/login con email no existente o password incorrecta
- **THEN** el sistema devuelve 401 Unauthorized

### Requirement: Renovación de token
El sistema SHALL permitir obtener un nuevo access token usando el refresh token almacenado en cookie, sin requerir reautenticación.

#### Scenario: Refresh exitoso
- **WHEN** se realiza POST /api/auth/refresh con cookie `refresh_token` válida y no expirada
- **THEN** el sistema devuelve 200 con nuevo `{ token }` (access token)

#### Scenario: Refresh con token expirado o inválido
- **WHEN** se realiza POST /api/auth/refresh con cookie ausente, expirada o manipulada
- **THEN** el sistema devuelve 401 Unauthorized

### Requirement: Protección de endpoints con JWT
El sistema SHALL rechazar cualquier petición a endpoints protegidos que no incluya un JWT válido en el header `Authorization: Bearer <token>`.

#### Scenario: Petición sin token
- **WHEN** se realiza una petición a cualquier endpoint protegido sin header Authorization
- **THEN** el sistema devuelve 401 Unauthorized

#### Scenario: Petición con token válido
- **WHEN** se realiza una petición con JWT válido y no expirado
- **THEN** el sistema procesa la petición normalmente y asocia el `userId` del token al request

#### Scenario: Petición con token expirado
- **WHEN** se realiza una petición con JWT cuyo `exp` ha pasado
- **THEN** el sistema devuelve 401 Unauthorized

### Requirement: Cierre de sesión
El sistema SHALL eliminar el refresh token del cliente al hacer logout.

#### Scenario: Logout exitoso
- **WHEN** se realiza POST /api/auth/logout (autenticado)
- **THEN** el sistema elimina la cookie `refresh_token` y devuelve 204 No Content

### Requirement: Roles de usuario
El sistema SHALL soportar dos roles: `user` y `admin`. Los endpoints de administración SHALL requerir rol `admin`.

#### Scenario: Acceso de admin a recursos propios y ajenos
- **WHEN** un usuario con rol `admin` accede a un recurso de otro usuario
- **THEN** el sistema permite la operación

#### Scenario: Acceso de user a recursos ajenos
- **WHEN** un usuario con rol `user` intenta acceder a recursos de otro usuario
- **THEN** el sistema devuelve 403 Forbidden
