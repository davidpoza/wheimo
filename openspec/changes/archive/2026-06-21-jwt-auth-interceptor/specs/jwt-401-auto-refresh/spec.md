## ADDED Requirements

### Requirement: Refresco automático de token en respuesta 401
El interceptor HTTP SHALL detectar respuestas con código 401 e intentar refrescar el access token antes de reintentar la petición original. Si el refresco tiene éxito, la petición se reintentará de forma transparente para el llamador. Si el refresco falla, el interceptor SHALL redirigir al usuario a la pantalla de login.

#### Scenario: Token expirado - refresh exitoso
- **WHEN** el servidor devuelve 401 para una petición autenticada
- **THEN** el interceptor llama a `AuthService.refresh()`
- **THEN** tras el refresh exitoso, el interceptor reintenta la petición original con el nuevo token
- **THEN** el llamador recibe la respuesta exitosa sin ser consciente del reintento

#### Scenario: Token expirado - refresh fallido
- **WHEN** el servidor devuelve 401 para una petición autenticada
- **AND** `AuthService.refresh()` también falla
- **THEN** el interceptor redirige al usuario a `/login`
- **THEN** el error se propaga al llamador

### Requirement: Exclusión de la petición de refresh del manejo de 401
El interceptor SHALL identificar las peticiones al endpoint de refresh (`/auth/refresh`) y NO intentar volver a refrescar si estas devuelven 401, evitando bucles infinitos.

#### Scenario: La petición de refresh devuelve 401
- **WHEN** la petición al endpoint `/auth/refresh` devuelve 401
- **THEN** el interceptor NO reintenta el refresh
- **THEN** el error se propaga normalmente y `AuthService.refresh()` gestiona la redirección

### Requirement: Inyección del token en cabecera Authorization
El interceptor SHALL añadir la cabecera `Authorization: Bearer <token>` a todas las peticiones HTTP salientes cuando existe un access token válido en `AuthService`.

#### Scenario: Petición con token disponible
- **WHEN** se realiza cualquier petición HTTP y `AuthService.accessToken()` contiene un valor
- **THEN** la petición incluye la cabecera `Authorization: Bearer <token>`

#### Scenario: Petición sin token
- **WHEN** se realiza cualquier petición HTTP y `AuthService.accessToken()` es `null`
- **THEN** la petición se envía sin cabecera `Authorization`
