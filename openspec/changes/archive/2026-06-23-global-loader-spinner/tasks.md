## 1. LoaderService

- [x] 1.1 Crear `frontend/src/app/core/services/loader.service.ts` con `WritableSignal<number>` como contador, `computed` signal `isLoading`, métodos `show()` y `hide()` (con guardia para no decrementar a negativo), y `providedIn: 'root'`

## 2. LoaderInterceptor

- [x] 2.1 Crear `frontend/src/app/core/interceptors/loader.interceptor.ts` como `HttpInterceptorFn` que inyecta `LoaderService`, llama a `show()` antes de `next(req)` y usa `finalize()` para llamar a `hide()`

## 3. LoaderComponent

- [x] 3.1 Crear `frontend/src/app/shared/components/loader/loader.component.ts` como componente standalone que inyecta `LoaderService` y usa `ProgressSpinner` de PrimeNG
- [x] 3.2 Crear `frontend/src/app/shared/components/loader/loader.component.html` con overlay `@if(loaderService.isLoading())` y `p-progress-spinner` centrado
- [x] 3.3 Crear `frontend/src/app/shared/components/loader/loader.component.scss` con estilos del overlay (`position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center`)

## 4. Integración en App

- [x] 4.1 Registrar `loaderInterceptor` en `frontend/src/app/app.config.ts` en la posición anterior a `authInterceptor` dentro de `withInterceptors([loaderInterceptor, authInterceptor])`
- [x] 4.2 Añadir `<app-loader />` en `frontend/src/app/app.html` antes de `<router-outlet>` e importar `LoaderComponent` en el componente raíz
