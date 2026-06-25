## 1. Backend: Cambio de contraseña

- [x] 1.1 Crear DTO `ChangePasswordRequest` con campos `currentPassword` y `newPassword` (con validación `@NotBlank`)
- [x] 1.2 Añadir método `changePassword(Long userId, ChangePasswordRequest req)` en `UserService` que verifique la contraseña actual con `passwordEncoder.matches()` y actualice `password_hash` con `passwordEncoder.encode(newPassword)`
- [x] 1.3 Añadir endpoint `POST /users/me/password` en `UserController` que llame a `userService.changePassword()` y devuelva 200 OK

## 2. Frontend: Servicio de usuario

- [x] 2.1 Añadir método `changePassword(currentPassword: string, newPassword: string)` en `AuthService` que haga `POST /users/me/password` usando el `HttpClient` autenticado (a través del interceptor existente)

## 3. Frontend: Componente de perfil

- [x] 3.1 Crear componente standalone `UserProfileComponent` en `features/user/user-profile/` con template que muestre nombre y email del usuario desde `AuthService.currentUser()`
- [x] 3.2 Añadir botón "Cerrar sesión" en `UserProfileComponent` que llame a `authService.logout().subscribe()`
- [x] 3.3 Añadir botón "Cambiar contraseña" que abra un `p-dialog` con los tres campos: contraseña actual, nueva contraseña y confirmación
- [x] 3.4 Implementar validación reactiva en el diálogo: botón guardar deshabilitado si algún campo está vacío o nueva contraseña ≠ confirmación
- [x] 3.5 Al guardar, llamar a `authService.changePassword()`, cerrar el diálogo en éxito (toast de éxito) o mostrar toast de error en caso de 400; limpiar campos al cerrar el diálogo

## 4. Frontend: Navegación y rutas

- [x] 4.1 Añadir ruta lazy `/profile` en `app.routes.ts` apuntando a `UserProfileComponent`, como ruta hija del layout autenticado
- [x] 4.2 Reemplazar el botón de logout del sidebar (desktop) en `app-layout.component.html` por un `p-button` con icono `pi-user` que use `[routerLink]="'/profile'"`
- [x] 4.3 Reemplazar el botón de logout del header móvil en `app-layout.component.html` por el mismo botón de perfil con `[routerLink]="'/profile'"`
- [x] 4.4 Eliminar el método `logout()` de `AppLayoutComponent` ya que no se usa directamente desde el layout
