## 1. Inicialización y rama v2

- [x] 1.1 Crear rama `v2` desde `master` en el repositorio
- [x] 1.2 Crear estructura de directorios: `backend/` (wheimo-api), `fetcher/` (wheimo-fetcher), `frontend/` (Angular)
- [x] 1.3 Actualizar `docker-compose.yml` con servicios: wheimo-api (8080), wheimo-fetcher (8081), frontend (Nginx 4200), PostgreSQL 16, Redis

## 2. wheimo-api: Scaffolding Spring Boot

- [x] 2.1 Crear proyecto Maven Spring Boot 4.1.0 (o 3.4.x si no está GA) en `backend/` con dependencias: spring-boot-starter-web, spring-boot-starter-security, spring-boot-starter-data-jpa, spring-boot-starter-data-redis, postgresql driver, flyway-core, jjwt (JWT), lombok, validation
- [x] 2.2 Configurar `application.yml` con datasource PostgreSQL, Redis, JPA (Hibernate dialect), Flyway, y variables de entorno para secrets (JWT secret, AES passphrase)
- [x] 2.3 Crear estructura de paquetes: `config`, `domain/entity`, `domain/repository`, `domain/service`, `domain/dto`, `web/controller`, `web/exception`, `security`, `messaging`

## 3. Base de datos: Esquema PostgreSQL con Flyway

- [x] 3.1 Crear migración Flyway `V1__create_users.sql` con tabla `users`
- [x] 3.2 Crear migración `V2__create_tags.sql` con tabla `tags`
- [x] 3.3 Crear migración `V3__create_accounts.sql` con tabla `accounts` (FK a users)
- [x] 3.4 Crear migración `V4__create_transactions.sql` con tabla `transactions` (FK a accounts)
- [x] 3.5 Crear migración `V5__create_transaction_tags.sql` con tabla join `transaction_tags`
- [x] 3.6 Crear migración `V6__create_rules.sql` con tabla `rules` y `rule_tags`
- [x] 3.7 Crear migración `V7__create_budgets.sql` con tabla `budgets` (FK a tags)
- [x] 3.8 Crear migración `V8__create_attachments.sql` con tabla `attachments` (FK a transactions CASCADE)
- [x] 3.9 Crear migración `V9__create_recurrents.sql` con tabla `recurrents`
- [x] 3.10 Añadir FK `users.ignored_tag_id → tags.id` en migración de ajuste `V10__add_user_ignored_tag.sql`

## 4. wheimo-api: Entidades JPA y Repositorios

- [x] 4.1 Crear entidad `User` con campos del esquema, anotaciones JPA y relaciones (`@OneToMany accounts`, `@ManyToOne ignoredTag`)
- [x] 4.2 Crear entidad `Account` con campos del esquema, `settings` como `@Column(columnDefinition = "jsonb")` y relaciones (`@ManyToOne user`, `@OneToMany transactions`)
- [x] 4.3 Crear entidad `Transaction` con campos del esquema y relaciones (`@ManyToOne account`, `@ManyToMany tags`, `@OneToMany attachments`)
- [x] 4.4 Crear entidad `Tag` con relaciones (`@ManyToOne user`, `@ManyToMany transactions`, `@ManyToMany rules`)
- [x] 4.5 Crear entidad `Rule` con campos del esquema y relaciones (`@ManyToOne user`, `@ManyToMany tags`)
- [x] 4.6 Crear entidades `Budget`, `Attachment`, `Recurrent` con sus relaciones
- [x] 4.7 Crear repositorios Spring Data JPA para cada entidad con queries personalizadas necesarias (findByUserId, findByAccountIdAndUserId, etc.)

## 5. wheimo-api: Seguridad y Autenticación

- [x] 5.1 Implementar `EncryptionService` con AES-256 para cifrar/descifrar contraseñas bancarias
- [x] 5.2 Implementar `JwtService` con generación y validación de JWT (RS256 o HMAC-SHA256): método `generateToken(userId, roles)`, `validateToken(token)`, `extractUserId(token)`
- [x] 5.3 Implementar `UserDetailsServiceImpl` que carga usuarios por email desde la DB
- [x] 5.4 Implementar `JwtAuthenticationFilter` (OncePerRequestFilter) que extrae y valida JWT del header Authorization
- [x] 5.5 Configurar `SecurityConfig`: filter chain con `JwtAuthenticationFilter`, endpoints públicos (`/api/auth/**`), CORS, CSRF desactivado (stateless)
- [x] 5.6 Implementar `AuthService` con métodos `signUp`, `signIn` (retorna access token + establece refresh token en cookie HttpOnly), `refresh`, `logout`
- [x] 5.7 Implementar `AuthController` con endpoints POST `/api/auth/signup`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- [x] 5.8 Implementar `GlobalExceptionHandler` (`@ControllerAdvice`) para traducir excepciones a respuestas HTTP correctas (400, 401, 403, 404, 409, 500)

## 6. wheimo-api: Módulo de Usuarios

- [x] 6.1 Implementar `UserService` con métodos `findById`, `updateById` (lang, theme, ignoredTagId)
- [x] 6.2 Implementar `UserController` con endpoints GET `/api/users/me`, PATCH `/api/users/me`

## 7. wheimo-api: Módulo de Cuentas

- [x] 7.1 Implementar `AccountService` con métodos `create`, `findAll(userId)`, `findById(id, userId)`, `updateById`, `deleteById`, `fixBalances`
- [x] 7.2 Implementar `AccountController` con endpoints CRUD + POST `/api/accounts/{id}/resync` + POST `/api/accounts/fix-balances`
- [x] 7.3 Implementar publicación en Redis (`sync-requests`) al hacer resync: serializar `{ accountId, userId, from, bankId, accessId, encryptedPassword, settings }` como JSON

## 8. wheimo-api: Módulo de Etiquetas y Reglas

- [x] 8.1 Implementar `TagService` con métodos `create`, `findAll(userId)`, `findById`, `updateById`, `deleteById`
- [x] 8.2 Implementar `TagController` con endpoints CRUD en `/api/tags`
- [x] 8.3 Implementar `RuleService` con métodos CRUD + `findAll(userId)` con tags incluidas + lógica `evaluateRule(transaction, rule)` y `applyTags(transactions, rules)`
- [x] 8.4 Implementar `RuleController` con endpoints CRUD en `/api/rules` + POST `/api/rules/{id}/tags` + DELETE `/api/rules/{id}/tags/{tagId}`

## 9. wheimo-api: Módulo de Transacciones

- [x] 9.1 Implementar `TransactionService` con métodos `create`, `findAll` (con todos los filtros), `findById`, `updateById`, `deleteById`, `deleteByIds`
- [x] 9.2 Implementar método `resync` en `TransactionService` para procesar resultados del fetcher (deduplicación por importId, persistencia masiva, aplicación de reglas)
- [x] 9.3 Implementar métodos de analítica en `TransactionService`: `calculateExpensesByTags`, `getTransactionsCalendar`, `calculateStatistics`
- [x] 9.4 Implementar `TransactionController` con todos los endpoints definidos en spec (CRUD, tags, apply-tags, apply-specific-tags, /tags, /calendar, /statistics)
- [x] 9.5 Implementar consumidor Redis (`sync-results`) en `TransactionService` que procesa resultados del fetcher

## 10. wheimo-api: Módulos de Presupuestos, Adjuntos y Recurrentes

- [x] 10.1 Implementar `BudgetService` + `BudgetController` (CRUD + GET `/api/budgets/{id}/status`)
- [x] 10.2 Implementar `AttachmentService` con almacenamiento de archivos en disco local (configurable por variable de entorno) + `AttachmentController` (POST upload, GET download, PATCH, DELETE)
- [x] 10.3 Implementar `RecurrentService` + `RecurrentController` (CRUD en `/api/recurrents`)

## 11. wheimo-fetcher: Microservicio de Importación

- [x] 11.1 Crear proyecto Maven Spring Boot en `fetcher/` con dependencias: spring-boot-starter, spring-boot-starter-data-redis, spring-web (cliente HTTP), lombok
- [x] 11.2 Configurar `application.yml` del fetcher: Redis, AES passphrase
- [x] 11.3 Implementar `EncryptionService` (igual que en wheimo-api) para descifrar passwords
- [x] 11.4 Implementar `RedisConsumer` que escucha el canal `sync-requests` y despacha al `ImportService`
- [x] 11.5 Implementar `NordigenImporter`: autenticación, obtención de transacciones, parseo de `remittanceInformationUnstructured` (emisor, receptor, concepto, tarjeta), cálculo de saldos parciales
- [x] 11.6 Implementar `OpenbankImporter`: autenticación, obtención de transacciones por contrato/producto
- [x] 11.7 Implementar `OpenbankPrepaidImporter`: autenticación, obtención de transacciones de tarjeta prepago por PAN
- [x] 11.8 Implementar `ImportService`: selección de importer por bankId, generación de `importId` (hash de accountId+balance+date+description), publicación de resultados en `sync-results`
- [x] 11.9 Implementar `RedisPublisher` que serializa y publica en canal `sync-results`

## 12. Frontend Angular: Scaffolding y configuración

- [x] 12.1 Crear proyecto Angular 21 con Angular CLI en `frontend/` con Node 24 y configurar standalone components
- [x] 12.2 Instalar y configurar PrimeNG 21: tema Aura/Lara, `providePrimeNG()` en `app.config.ts`, importar `PrimeIcons`
- [x] 12.3 Configurar estructura de módulos/features: `core/`, `shared/`, `features/auth/`, `features/accounts/`, `features/transactions/`, `features/tags/`, `features/charts/`, `features/heatmap/`, `features/budgets/`
- [x] 12.4 Configurar `HttpClient` con `provideHttpClient(withFetch())` y crear interceptor JWT que añade `Authorization: Bearer <token>` a todas las peticiones
- [x] 12.5 Crear `AuthService` con signals: `currentUser = signal<User|null>(null)`, métodos `login`, `logout`, `refresh`; configurar `AuthGuard` para rutas protegidas
- [x] 12.6 Configurar routing con lazy loading por feature y guard de autenticación

## 13. Frontend: Feature de Autenticación

- [x] 13.1 Crear `LoginComponent` con formulario reactivo (email + password), botón de login, mensaje de error; usar `p-button`, `p-inputtext`, `p-password` de PrimeNG

## 14. Frontend: Feature de Cuentas

- [x] 14.1 Crear `AccountsService` con signals (`accounts = signal<Account[]>([])`) y métodos CRUD + resync
- [x] 14.2 Crear `AccountsListComponent` que muestra las cuentas con saldo, nombre y tipo de banco
- [x] 14.3 Crear `EditAccountDialogComponent` con formulario para crear/editar cuenta (campos condicionales según bankId: nordigen config, openbank config, prepaid config)
- [x] 14.4 Crear `CreateTagRuleInputComponent` para añadir reglas directamente desde la vista de cuenta

## 15. Frontend: Feature de Transacciones

- [x] 15.1 Crear `TransactionService` con signals (`transactions = signal<Transaction[]>([])`, `filters = signal<Filters>({})`) y métodos CRUD + apply-tags
- [x] 15.2 Crear `TransactionGridComponent` con `p-table` de PrimeNG: columnas (fecha, descripción, importe, etiquetas, favorito), paginación, ordenación
- [x] 15.3 Crear `TransactionFilterComponent` con filtros (fecha, cuenta, etiquetas, búsqueda, importe, tipo); en móvil se muestra como `p-drawer`
- [x] 15.4 Crear `TransactionDetailsDialogComponent` con `p-dialog`: detalle completo, edición de campos, gestión de etiquetas y adjuntos
- [x] 15.5 Crear `CreateTransactionDialogComponent` para creación manual de transacciones
- [x] 15.6 Crear `TaggingDialogComponent` para aplicar etiquetas específicas a múltiples transacciones seleccionadas

## 16. Frontend: Feature de Etiquetas y Reglas

- [x] 16.1 Crear `TagsService` con signals y métodos CRUD para tags y rules
- [x] 16.2 Crear `TagsGridComponent` con listado de etiquetas, creación inline, edición y borrado
- [x] 16.3 Crear `TagRulesComponent` con listado de reglas, formulario de creación (tipo, valor, tags asociadas) y borrado

## 17. Frontend: Feature de Gráficos y Analítica

- [x] 17.1 Crear `ChartsService` que consume `/api/transactions/tags` y `/api/transactions` para balance evolution
- [x] 17.2 Crear `BalanceEvolutionChartComponent` con `<p-chart type="line">` mostrando evolución de saldo por cuenta
- [x] 17.3 Crear `TagExpensesChartComponent` con `<p-chart type="pie">` o `<p-chart type="bar">` de gastos por etiqueta con selector de periodo
- [x] 17.4 Crear `BarChartComponent` para totales por etiqueta agrupados por día/mes con selector de agrupación
- [x] 17.5 Crear `HeatmapComponent` con grid de días del año, color según intensidad de gasto, tooltip con fecha e importe
- [x] 17.6 Crear `StatisticsComponent` que muestra el panel de estadísticas (día más caro, rachas, totales)

## 18. Frontend: Feature de Presupuestos

- [x] 18.1 Crear `BudgetsService` con signals y métodos CRUD + status
- [x] 18.2 Crear `BudgetsComponent` con listado de presupuestos, indicador de progreso (barra con % usado) y formulario de creación/edición

## 19. Frontend: Configuración de layout y responsive

- [x] 19.1 Crear `AppLayoutComponent` con sidebar lateral (desktop) y top-bar + drawer (móvil); usar `p-sidebar` o `p-drawer` de PrimeNG
- [x] 19.2 Implementar soporte de tema dark/light usando `PrimeNG theme switching` según preferencia guardada en el perfil de usuario
- [x] 19.3 Verificar responsive en las vistas principales: transacciones, etiquetas, gráficos, heatmap

## 20. Docker y despliegue local

- [x] 20.1 Crear `Dockerfile` para `wheimo-api` (multi-stage: Maven build + JRE 21)
- [x] 20.2 Crear `Dockerfile` para `wheimo-fetcher` (multi-stage: Maven build + JRE 21)
- [x] 20.3 Crear `Dockerfile` para frontend Angular (multi-stage: Node 24 build + Nginx)
- [x] 20.4 Actualizar `docker-compose.yml` con todos los servicios, variables de entorno, volúmenes (PostgreSQL data, adjuntos)
- [x] 20.5 Crear fichero `.env.example` con todas las variables de entorno necesarias documentadas
