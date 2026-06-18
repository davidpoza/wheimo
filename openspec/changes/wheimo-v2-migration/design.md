## Context

wheimo v1 es una aplicación personal de finanzas construida con Node.js/Express (API + fetcher unificado), React/Redux (frontend) y SQLite (base de datos). La arquitectura monolítica del backend mezcla la lógica de negocio con los importadores bancarios en el mismo proceso. La v2 separa estas responsabilidades en dos microservicios Java/Spring Boot, migra el frontend a Angular 21 con Signals, y adopta PostgreSQL como base de datos principal.

El objetivo de esta fase es definir el diseño técnico completo para poder implementar cada spec de forma independiente.

## Goals / Non-Goals

**Goals:**
- Definir la arquitectura de los dos microservicios Spring Boot (`wheimo-api`, `wheimo-fetcher`)
- Definir el esquema de base de datos PostgreSQL
- Definir la estrategia de autenticación con Spring Security + JWT
- Definir la arquitectura del frontend Angular 21 con Signals y PrimeNG 21
- Definir la comunicación entre microservicios (Redis)
- Definir la estructura de módulos de cada microservicio

**Non-Goals:**
- Migración de datos desde SQLite a PostgreSQL (datos de producción v1)
- Notificaciones push (se elimina el servicio notifier en v2)
- CI/CD pipelines
- Despliegue en producción (solo estructura Docker local)

## Decisions

### D1: Dos microservicios Spring Boot en lugar de uno

**Decisión**: `wheimo-api` maneja la lógica de negocio y la API REST; `wheimo-fetcher` es responsable exclusivo de conectar con bancos y publicar transacciones importadas.

**Razón**: La v1 tenía problemas de timeouts en el proceso HTTP cuando la sincronización bancaria era lenta (Openbank puede tardar 30-60 seg). Separar el fetcher permite que la sincronización sea asíncrona y no bloquee la API.

**Alternativa descartada**: Un único microservicio con jobs asíncronos internos — más simple pero no permite escalar el fetcher de forma independiente.

**Comunicación**: `wheimo-api` publica mensajes en Redis (canal `sync-requests`) con `{ accountId, userId, from }`. `wheimo-fetcher` consume la cola, importa transacciones y publica los resultados en `sync-results`. `wheimo-api` consume `sync-results` y persiste las transacciones + aplica etiquetas.

### D2: Spring Security con JWT stateless

**Decisión**: JWT firmado con RS256 (clave privada en `wheimo-api`). El token incluye `sub` (userId), `roles`, `exp`. No hay sesiones en servidor.

**Razón**: Compatible con arquitectura stateless de microservicios. `wheimo-fetcher` puede validar el token usando la clave pública sin necesidad de consultar la DB.

**Alternativa descartada**: OAuth2/OIDC — sobrecarga innecesaria para una app personal single-user/few-users.

**Implementación**:
- `JwtAuthenticationFilter` en Spring Security filter chain
- `UserDetailsService` que carga usuarios desde PostgreSQL
- Endpoint `POST /api/auth/login` devuelve access token (15min) + refresh token (30 días) en HttpOnly cookie
- Endpoint `POST /api/auth/refresh` renueva el access token

### D3: Angular 21 con Signals como primitiva de estado reactivo

**Decisión**: No se usa NgRx ni RxJS Subject para el estado de la aplicación. El estado se gestiona con `signal()`, `computed()` y `effect()` de Angular 21. Los servicios son los "stores" de estado mediante signals.

**Razón**: Signals es el paradigma nativo de Angular 17+ y en Angular 21 es el modelo recomendado. Elimina la necesidad de Redux/NgRx para aplicaciones de complejidad media.

**Alternativa descartada**: NgRx Signal Store — más estructura de la necesaria para este scope.

**Arquitectura frontend**:
```
src/
  app/
    core/           # Guards, interceptors, auth service, config
    shared/         # Componentes reutilizables, pipes, directives
    features/
      auth/         # Login
      accounts/     # Gestión de cuentas
      transactions/ # Lista + filtros + detalle
      tags/         # Etiquetas y reglas
      charts/       # Gráficos y analítica
      heatmap/      # Heatmap de gastos
      budgets/      # Presupuestos
```

### D4: PostgreSQL con Flyway para migraciones

**Decisión**: PostgreSQL 16 como base de datos. Flyway gestiona las migraciones de esquema. Spring Data JPA + Hibernate como ORM.

**Razón**: PostgreSQL soporta tipos JSON nativos (para el campo `settings` de accounts), tiene mejor rendimiento que SQLite para queries complejas de analytics, y es la DB estándar para proyectos Spring Boot.

**Esquema principal**:
```sql
-- users
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name TEXT,
  password_hash VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT false,
  lang VARCHAR(2) DEFAULT 'en',
  theme VARCHAR(10) DEFAULT 'light',
  level VARCHAR(10) DEFAULT 'user',
  ignored_tag_id BIGINT REFERENCES tags(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- accounts
CREATE TABLE accounts (
  id BIGSERIAL PRIMARY KEY,
  number VARCHAR(255) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  balance DECIMAL(15,2) DEFAULT 0.0,
  bank_id VARCHAR(20) NOT NULL, -- opbk|wallet|piggybank|nordigen|opbkprepaid
  access_id VARCHAR(255),
  access_password TEXT, -- AES encrypted
  settings JSONB,       -- bank-specific config (nordigenAccountId, pan, etc.)
  saving_target_amount DECIMAL(15,2),
  saving_initial_amount DECIMAL(15,2),
  saving_amount_func TEXT,
  saving_frequency VARCHAR(50),
  saving_init_date TIMESTAMPTZ DEFAULT NOW(),
  saving_target_date TIMESTAMPTZ,
  last_sync_count INT DEFAULT 0,
  user_id BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- transactions
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  import_id TEXT UNIQUE,
  emitter_name TEXT,
  receiver_name TEXT,
  description TEXT,
  comments TEXT,
  ass_card TEXT,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  date TIMESTAMPTZ,
  value_date TIMESTAMPTZ,
  balance DECIMAL(15,2) DEFAULT 0.0,
  receipt BOOLEAN DEFAULT false,
  draft BOOLEAN DEFAULT false,
  favourite BOOLEAN DEFAULT false,
  account_id BIGINT NOT NULL REFERENCES accounts(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- tags
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- transaction_tags (join table)
CREATE TABLE transaction_tags (
  transaction_id BIGINT REFERENCES transactions(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (transaction_id, tag_id)
);

-- rules
CREATE TABLE rules (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL, -- emitterName|receiverName|description|isExpense|amount|card|isReceipt|account|currency|bankId
  value VARCHAR(255) NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- rule_tags (join table: rules can trigger multiple tags)
CREATE TABLE rule_tags (
  rule_id BIGINT REFERENCES rules(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (rule_id, tag_id)
);

-- budgets
CREATE TABLE budgets (
  id BIGSERIAL PRIMARY KEY,
  value DECIMAL(15,2) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  tag_id BIGINT NOT NULL REFERENCES tags(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- attachments
CREATE TABLE attachments (
  id BIGSERIAL PRIMARY KEY,
  description TEXT,
  filename TEXT NOT NULL,
  type TEXT NOT NULL,
  transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- recurrents
CREATE TABLE recurrents (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) DEFAULT 0.0,
  emitter TEXT NOT NULL,
  transaction_id BIGINT REFERENCES transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### D5: Estructura de módulos Spring Boot

**wheimo-api** (puerto 8080):
```
com.wheimo.api/
  config/           # SecurityConfig, JwtConfig, RedisConfig, CorsConfig
  domain/
    entity/         # JPA entities (User, Account, Transaction, Tag, Rule, Budget, Attachment, Recurrent)
    repository/     # Spring Data JPA repositories
    service/        # Business logic
    dto/            # Request/Response DTOs
  web/
    controller/     # REST controllers
    exception/      # GlobalExceptionHandler
  security/         # JwtFilter, UserDetailsServiceImpl
  messaging/        # Redis publisher/consumer
```

**wheimo-fetcher** (puerto 8081):
```
com.wheimo.fetcher/
  config/           # RedisConfig
  importer/
    NordigenImporter
    OpenbankImporter
    OpenbankPrepaidImporter
  messaging/        # Redis consumer (sync-requests) + publisher (sync-results)
  service/          # ImportService (orquestador)
```

### D6: PrimeNG 21 para UI y Charts

**Decisión**: PrimeNG 21 para todos los componentes UI (Table, Dialog, Button, Dropdown, Calendar, etc.) y Charts (basados en Chart.js encapsulados como `<p-chart>`).

**Razón**: PrimeNG 21 está completamente alineado con Angular 21 Signals, tiene soporte nativo para temas responsivos y elimina la necesidad de Chart.js directo o de otras librerías de gráficos.

**Tema**: PrimeNG Aura o Lara (configurable dark/light según preferencia del usuario).

### D7: Cifrado de credenciales bancarias

**Decisión**: Las credenciales bancarias (`access_password`) se cifran en reposo con AES-256 usando una passphrase del entorno. Igual que en v1.

**Razón**: Las credenciales bancarias son datos sensibles y no deben almacenarse en texto plano.

**Implementación**: `javax.crypto` (AES/CBC/PKCS5Padding) en el servicio `EncryptionService` de `wheimo-api`.

## Risks / Trade-offs

- **[Riesgo] Spring Boot 4.1.0 puede no estar GA en el momento de implementar** → Usar la última versión 3.x (3.4.x) si 4.1.0 no está disponible; la arquitectura es compatible.
- **[Riesgo] Angular 21 y PrimeNG 21 pueden no estar disponibles** → Usar Angular 19/20 + PrimeNG 19/20 si es necesario; la arquitectura Signals es válida desde Angular 17.
- **[Riesgo] Openbank scraper puede dejar de funcionar si el banco cambia su API privada** → El importer está aislado en `wheimo-fetcher`; se puede actualizar sin tocar `wheimo-api`.
- **[Trade-off] Dos microservicios vs uno** → Mayor complejidad operacional (2 JVMs, config Redis) pero mejor separación de responsabilidades y sin timeouts en la API.
- **[Trade-off] Flyway vs Liquibase** → Flyway elegido por simplicidad; Liquibase tiene más features pero es innecesariamente complejo para este proyecto.
- **[Riesgo] Pérdida de datos v1** → Esta versión no incluye migración de datos; los datos de v1 se mantienen en la rama `master`.

## Migration Plan

1. Crear rama `v2` desde `master` (sin código v1).
2. Implementar specs en orden de dependencia:
   - Primero: `auth` (base de todo)
   - Segundo: `accounts`, `tags-and-rules` (entidades base)
   - Tercero: `transactions` (depende de accounts y tags)
   - Cuarto: `transaction-fetcher` (depende de accounts)
   - Quinto: `budgets`, `attachments`, `recurrents`
   - Sexto: `charts-and-analytics` (depende de transactions)
3. Actualizar `docker-compose.yml` para incluir todos los servicios.
4. Validar manualmente contra los importadores bancarios reales.

## Open Questions

- ¿Se usa Maven o Gradle para los proyectos Spring Boot? (Recomendación: Maven por convención Spring Boot)
- ¿Las dos aplicaciones Spring Boot se estructuran en un único repositorio (monorepo con módulos Maven) o en directorios separados? (Recomendación: directorios separados `backend/` y `fetcher/` en la misma rama)
- ¿El frontend Angular se sirve mediante Nginx en Docker o se usa el dev server de Angular CLI? (Recomendación: Nginx en Docker para producción, CLI dev server para desarrollo)
- ¿Se implementa i18n en el frontend Angular? (v1 tenía en/es) → Sí, usar `@angular/localize` o `ngx-translate`.
