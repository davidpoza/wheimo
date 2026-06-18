## 1. Inicialización y rama v2

- [ ] 1.1 Crear rama `v2` desde `master` en el repositorio
- [ ] 1.2 Crear estructura de directorios: `backend/` (wheimo-api), `fetcher/` (wheimo-fetcher), `frontend/` (Angular)
- [ ] 1.3 Actualizar `docker-compose.yml` con servicios: wheimo-api (8080), wheimo-fetcher (8081), frontend (Nginx 4200), PostgreSQL 16, Redis

## 2. wheimo-api: Scaffolding Spring Boot

- [ ] 2.1 Crear proyecto Maven Spring Boot 4.1.0 (o 3.4.x si no está GA) en `backend/` con dependencias: spring-boot-starter-web, spring-boot-starter-security, spring-boot-starter-data-jpa, spring-boot-starter-data-redis, postgresql driver, flyway-core, jjwt (JWT), lombok, validation
- [ ] 2.2 Configurar `application.yml` con datasource PostgreSQL, Redis, JPA (Hibernate dialect), Flyway, y variables de entorno para secrets (JWT secret, AES passphrase)
- [ ] 2.3 Crear estructura de paquetes: `config`, `domain/entity`, `domain/repository`, `domain/service`, `domain/dto`, `web/controller`, `web/exception`, `security`, `messaging`

## 3. Base de datos: Esquema PostgreSQL con Flyway

- [ ] 3.1 Crear migración Flyway `V1__create_users.sql` con tabla `users`
- [ ] 3.2 Crear migración `V2__create_tags.sql` con tabla `tags`
- [ ] 3.3 Crear migración `V3__create_accounts.sql` con tabla `accounts` (FK a users)
- [ ] 3.4 Crear migración `V4__create_transactions.sql` con tabla `transactions` (FK a accounts)
- [ ] 3.5 Crear migración `V5__create_transaction_tags.sql` con tabla join `transaction_tags`
- [ ] 3.6 Crear migración `V6__create_rules.sql` con tabla `rules` y `rule_tags`
- [ ] 3.7 Crear migración `V7__create_budgets.sql` con tabla `budgets` (FK a tags)
- [ ] 3.8 Crear migración `V8__create_attachments.sql` con tabla `attachments` (FK a transactions CASCADE)
- [ ] 3.9 Crear migración `V9__create_recurrents.sql` con tabla `recurrents`
- [ ] 3.10 Añadir FK `users.ignored_tag_id → tags.id` en migración de ajuste `V10__add_user_ignored_tag.sql`

## 4. wheimo-api: Entidades JPA y Repositorios

- [ ] 4.1 Crear entidad `User` con campos del esquema, anotaciones JPA y relaciones (`@OneToMany accounts`, `@ManyToOne ignoredTag`)
- [ ] 4.2 Crear entidad `Account` con campos del esquema, `settings` como `@Column(columnDefinition = "jsonb")` y relaciones (`@ManyToOne user`, `@OneToMany transactions`)
- [ ] 4.3 Crear entidad `Transaction` con campos del esquema y relaciones (`@ManyToOne account`, `@ManyToMany tags`, `@OneToMany attachments`)
- [ ] 4.4 Crear entidad `Tag` con relaciones (`@ManyToOne user`, `@ManyToMany transactions`, `@ManyToMany rules`)
- [ ] 4.5 Crear entidad `Rule` con campos del esquema y relaciones (`@ManyToOne user`, `@ManyToMany tags`)
- [ ] 4.6 Crear entidades `Budget`, `Attachment`, `Recurrent` con sus relaciones
- [ ] 4.7 Crear repositorios Spring Data JPA para cada entidad con queries personalizadas necesarias (findByUserId, findByAccountIdAndUserId, etc.)

## 5. wheimo-api: Seguridad y Autenticación

- [ ] 5.1 Implementar `EncryptionService` con AES-256 para cifrar/descifrar contraseñas bancarias
- [ ] 5.2 Implementar `JwtService` con generación y validación de JWT (RS256 o HMAC-SHA256): método `generateToken(userId, roles)`, `validateToken(token)`, `extractUserId(token)`
- [ ] 5.3 Implementar `UserDetailsServiceImpl` que carga usuarios por email desde la DB
- [ ] 5.4 Implementar `JwtAuthenticationFilter` (OncePerRequestFilter) que extrae y valida JWT del header Authorization
- [ ] 5.5 Configurar `SecurityConfig`: filter chain con `JwtAuthenticationFilter`, endpoints públicos (`/api/auth/**`), CORS, CSRF desactivado (stateless)
- [ ] 5.6 Implementar `AuthService` con métodos `signUp`, `signIn` (retorna access token + establece refresh token en cookie HttpOnly), `refresh`, `logout`
- [ ] 5.7 Implementar `AuthController` con endpoints POST `/api/auth/signup`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- [ ] 5.8 Implementar `GlobalExceptionHandler` (`@ControllerAdvice`) para traducir excepciones a respuestas HTTP correctas (400, 401, 403, 404, 409, 500)

## 6. wheimo-api: Módulo de Usuarios

- [ ] 6.1 Implementar `UserService` con métodos `findById`, `updateById` (lang, theme, ignoredTagId)
- [ ] 6.2 Implementar `UserController` con endpoints GET `/api/users/me`, PATCH `/api/users/me`

## 7. wheimo-api: Módulo de Cuentas

- [ ] 7.1 Implementar `AccountService` con métodos `create`, `findAll(userId)`, `findById(id, userId)`, `updateById`, `deleteById`, `fixBalances`
- [ ] 7.2 Implementar `AccountController` con endpoints CRUD + POST `/api/accounts/{id}/resync` + POST `/api/accounts/fix-balances`
- [ ] 7.3 Implementar publicación en Redis (`sync-requests`) al hacer resync: serializar `{ accountId, userId, from, bankId, accessId, encryptedPassword, settings }` como JSON

## 8. wheimo-api: Módulo de Etiquetas y Reglas

- [ ] 8.1 Implementar `TagService` con métodos `create`, `findAll(userId)`, `findById`, `updateById`, `deleteById`
- [ ] 8.2 Implementar `TagController` con endpoints CRUD en `/api/tags`
- [ ] 8.3 Implementar `RuleService` con métodos CRUD + `findAll(userId)` con tags incluidas + lógica `evaluateRule(transaction, rule)` y `applyTags(transactions, rules)`
- [ ] 8.4 Implementar `RuleController` con endpoints CRUD en `/api/rules` + POST `/api/rules/{id}/tags` + DELETE `/api/rules/{id}/tags/{tagId}`

## 9. wheimo-api: Módulo de Transacciones

- [ ] 9.1 Implementar `TransactionService` con métodos `create`, `findAll` (con todos los filtros), `findById`, `updateById`, `deleteById`, `deleteByIds`
- [ ] 9.2 Implementar método `resync` en `TransactionService` para procesar resultados del fetcher (deduplicación por importId, persistencia masiva, aplicación de reglas)
- [ ] 9.3 Implementar métodos de analítica en `TransactionService`: `calculateExpensesByTags`, `getTransactionsCalendar`, `calculateStatistics`
- [ ] 9.4 Implementar `TransactionController` con todos los endpoints definidos en spec (CRUD, tags, apply-tags, apply-specific-tags, /tags, /calendar, /statistics)
- [ ] 9.5 Implementar consumidor Redis (`sync-results`) en `TransactionService` que procesa resultados del fetcher

## 10. wheimo-api: Módulos de Presupuestos, Adjuntos y Recurrentes

- [ ] 10.1 Implementar `BudgetService` + `BudgetController` (CRUD + GET `/api/budgets/{id}/status`)
- [ ] 10.2 Implementar `AttachmentService` con almacenamiento de archivos en disco local (configurable por variable de entorno) + `AttachmentController` (POST upload, GET download, PATCH, DELETE)
- [ ] 10.3 Implementar `RecurrentService` + `RecurrentController` (CRUD en `/api/recurrents`)

## 11. wheimo-fetcher: Microservicio de Importación

- [ ] 11.1 Crear proyecto Maven Spring Boot en `fetcher/` con dependencias: spring-boot-starter, spring-boot-starter-data-redis, spring-web (cliente HTTP), lombok
- [ ] 11.2 Configurar `application.yml` del fetcher: Redis, AES passphrase
- [ ] 11.3 Implementar `EncryptionService` (igual que en wheimo-api) para descifrar passwords
- [ ] 11.4 Implementar `RedisConsumer` que escucha el canal `sync-requests` y despacha al `ImportService`
- [ ] 11.5 Implementar `NordigenImporter`: autenticación, obtención de transacciones, parseo de `remittanceInformationUnstructured` (emisor, receptor, concepto, tarjeta), cálculo de saldos parciales
- [ ] 11.6 Implementar `OpenbankImporter`: autenticación, obtención de transacciones por contrato/producto
- [ ] 11.7 Implementar `OpenbankPrepaidImporter`: autenticación, obtención de transacciones de tarjeta prepago por PAN
- [ ] 11.8 Implementar `ImportService`: selección de importer por bankId, generación de `importId` (hash de accountId+balance+date+description), publicación de resultados en `sync-results`
- [ ] 11.9 Implementar `RedisPublisher` que serializa y publica en canal `sync-results`

## 12. Frontend Angular: Scaffolding y configuración

- [ ] 12.1 Crear proyecto Angular 21 con Angular CLI en `frontend/` con Node 24 y configurar standalone components
- [ ] 12.2 Instalar y configurar PrimeNG 21: tema Aura/Lara, `providePrimeNG()` en `app.config.ts`, importar `PrimeIcons`
- [ ] 12.3 Configurar estructura de módulos/features: `core/`, `shared/`, `features/auth/`, `features/accounts/`, `features/transactions/`, `features/tags/`, `features/charts/`, `features/heatmap/`, `features/budgets/`
- [ ] 12.4 Configurar `HttpClient` con `provideHttpClient(withFetch())` y crear interceptor JWT que añade `Authorization: Bearer <token>` a todas las peticiones
- [ ] 12.5 Crear `AuthService` con signals: `currentUser = signal<User|null>(null)`, métodos `login`, `logout`, `refresh`; configurar `AuthGuard` para rutas protegidas
- [ ] 12.6 Configurar routing con lazy loading por feature y guard de autenticación

## 13. Frontend: Feature de Autenticación

- [ ] 13.1 Crear `LoginComponent` con formulario reactivo (email + password), botón de login, mensaje de error; usar `p-button`, `p-inputtext`, `p-password` de PrimeNG

## 14. Frontend: Feature de Cuentas

- [ ] 14.1 Crear `AccountsService` con signals (`accounts = signal<Account[]>([])`) y métodos CRUD + resync
- [ ] 14.2 Crear `AccountsListComponent` que muestra las cuentas con saldo, nombre y tipo de banco
- [ ] 14.3 Crear `EditAccountDialogComponent` con formulario para crear/editar cuenta (campos condicionales según bankId: nordigen config, openbank config, prepaid config)
- [ ] 14.4 Crear `CreateTagRuleInputComponent` para añadir reglas directamente desde la vista de cuenta

## 15. Frontend: Feature de Transacciones

- [ ] 15.1 Crear `TransactionService` con signals (`transactions = signal<Transaction[]>([])`, `filters = signal<Filters>({})`) y métodos CRUD + apply-tags
- [ ] 15.2 Crear `TransactionGridComponent` con `p-table` de PrimeNG: columnas (fecha, descripción, importe, etiquetas, favorito), paginación, ordenación
- [ ] 15.3 Crear `TransactionFilterComponent` con filtros (fecha, cuenta, etiquetas, búsqueda, importe, tipo); en móvil se muestra como `p-drawer`
- [ ] 15.4 Crear `TransactionDetailsDialogComponent` con `p-dialog`: detalle completo, edición de campos, gestión de etiquetas y adjuntos
- [ ] 15.5 Crear `CreateTransactionDialogComponent` para creación manual de transacciones
- [ ] 15.6 Crear `TaggingDialogComponent` para aplicar etiquetas específicas a múltiples transacciones seleccionadas

## 16. Frontend: Feature de Etiquetas y Reglas

- [ ] 16.1 Crear `TagsService` con signals y métodos CRUD para tags y rules
- [ ] 16.2 Crear `TagsGridComponent` con listado de etiquetas, creación inline, edición y borrado
- [ ] 16.3 Crear `TagRulesComponent` con listado de reglas, formulario de creación (tipo, valor, tags asociadas) y borrado

## 17. Frontend: Feature de Gráficos y Analítica

- [ ] 17.1 Crear `ChartsService` que consume `/api/transactions/tags` y `/api/transactions` para balance evolution
- [ ] 17.2 Crear `BalanceEvolutionChartComponent` con `<p-chart type="line">` mostrando evolución de saldo por cuenta
- [ ] 17.3 Crear `TagExpensesChartComponent` con `<p-chart type="pie">` o `<p-chart type="bar">` de gastos por etiqueta con selector de periodo
- [ ] 17.4 Crear `BarChartComponent` para totales por etiqueta agrupados por día/mes con selector de agrupación
- [ ] 17.5 Crear `HeatmapComponent` con grid de días del año, color según intensidad de gasto, tooltip con fecha e importe
- [ ] 17.6 Crear `StatisticsComponent` que muestra el panel de estadísticas (día más caro, rachas, totales)

## 18. Frontend: Feature de Presupuestos

- [ ] 18.1 Crear `BudgetsService` con signals y métodos CRUD + status
- [ ] 18.2 Crear `BudgetsComponent` con listado de presupuestos, indicador de progreso (barra con % usado) y formulario de creación/edición

## 19. Frontend: Configuración de layout y responsive

- [ ] 19.1 Crear `AppLayoutComponent` con sidebar lateral (desktop) y top-bar + drawer (móvil); usar `p-sidebar` o `p-drawer` de PrimeNG
- [ ] 19.2 Implementar soporte de tema dark/light usando `PrimeNG theme switching` según preferencia guardada en el perfil de usuario
- [ ] 19.3 Verificar responsive en las vistas principales: transacciones, etiquetas, gráficos, heatmap

## 20. Docker y despliegue local

- [ ] 20.1 Crear `Dockerfile` para `wheimo-api` (multi-stage: Maven build + JRE 21)
- [ ] 20.2 Crear `Dockerfile` para `wheimo-fetcher` (multi-stage: Maven build + JRE 21)
- [ ] 20.3 Crear `Dockerfile` para frontend Angular (multi-stage: Node 24 build + Nginx)
- [ ] 20.4 Actualizar `docker-compose.yml` con todos los servicios, variables de entorno, volúmenes (PostgreSQL data, adjuntos)
- [ ] 20.5 Crear fichero `.env.example` con todas las variables de entorno necesarias documentadas
