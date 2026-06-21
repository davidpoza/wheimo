## 1. Actualizar el interceptor

- [x] 1.1 Importar `catchError`, `switchMap` y `throwError` de `rxjs` en `auth.interceptor.ts`
- [x] 1.2 Importar `HttpErrorResponse` de `@angular/common/http`
- [x] 1.3 Añadir lógica `catchError` al pipeline del interceptor para detectar respuestas 401
- [x] 1.4 Excluir las peticiones a `/auth/refresh` del manejo de 401 para evitar bucles infinitos
- [x] 1.5 Implementar `switchMap` sobre `authService.refresh()` para reintentar la petición original con el nuevo token

## 2. Verificación manual

- [ ] 2.1 Arrancar backend y frontend, iniciar sesión y comprobar que las peticiones incluyen el header `Authorization`
- [ ] 2.2 Simular un 401 (token expirado o manipulado) y verificar que el refresh se dispara y la petición se reintenta
- [ ] 2.3 Simular un refresh fallido y verificar redirección a `/login`
