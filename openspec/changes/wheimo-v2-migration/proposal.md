## Why

La aplicación wheimo (v1) está construida sobre Node.js/Express + React con SQLite, un stack que ha cumplido su función pero que limita la capacidad de escalar, añadir tipado fuerte, gestionar seguridad de forma robusta y estructurar el código en capas bien definidas. La migración a Spring Boot + Angular moderniza el stack con ecosistemas más maduros para aplicaciones empresariales, permite separar responsabilidades en microservicios y abre la puerta a un frontend reactivo basado en Signals.

## What Changes

- **BREAKING** — El backend Node.js/Express se reemplaza por dos microservicios Spring Boot 4.1.0 (Java 21):
  - `wheimo-api`: API REST principal (gestión de cuentas, transacciones, etiquetas, reglas, presupuestos, adjuntos, usuarios).
  - `wheimo-fetcher`: Microservicio de importación de transacciones bancarias (Nordigen, Openbank, Openbank Prepaid).
- **BREAKING** — El frontend React + Redux se reemplaza por Angular 21 con Signals (Node 24), usando PrimeNG 21 como librería de componentes (incluyendo charts).
- **BREAKING** — La base de datos SQLite se migra a PostgreSQL.
- La autenticación pasa de JWT ad-hoc (jsonwebtoken) a Spring Security con JWT y usuarios persistidos en PostgreSQL.
- Se elimina el servicio `notifier` como microservicio separado; las notificaciones push quedan fuera del alcance de esta versión (v2) para simplificar el scope inicial.
- Redis sigue siendo la cola de mensajes entre `wheimo-api` y `wheimo-fetcher`.
- Los importadores bancarios (Nordigen, Openbank, Openbank Prepaid, Wallet/Piggybank) se migran al microservicio `wheimo-fetcher`.
- La lógica de etiquetado automático por reglas se mantiene en `wheimo-api`.
- Se añade soporte responsive mediante PrimeNG y CSS Grid/Flexbox en Angular.

## Capabilities

### New Capabilities

- `auth`: Autenticación y autorización mediante Spring Security + JWT; registro e inicio de sesión con usuarios en PostgreSQL; roles (user/admin).
- `accounts`: CRUD de cuentas bancarias con soporte para múltiples tipos de banco (opbk, nordigen, opbkprepaid, wallet, piggybank); configuración de ahorro (target, frequency, amounts).
- `transactions`: Gestión completa de transacciones: creación manual, filtrado avanzado (fecha, cuenta, etiquetas, búsqueda, importe, tipo), edición, borrado individual y masivo, marcado como favorito/borrador, adjuntos.
- `tags-and-rules`: Gestión de etiquetas de usuario; reglas de etiquetado automático (tipo: emitterName, receiverName, description, amount, isExpense, isReceipt, currency, account, bankId, card); asociación de reglas a etiquetas; aplicación manual y automática de etiquetas.
- `transaction-fetcher`: Microservicio independiente que conecta con bancos (Nordigen API, Openbank scraper, Openbank Prepaid) para importar transacciones; deduplicación por importId; cálculo de saldo parcial para Nordigen; publicación de eventos a la cola para que `wheimo-api` los procese.
- `budgets`: Definición de presupuestos por etiqueta y rango de fechas; seguimiento de gasto real vs presupuestado.
- `charts-and-analytics`: Vistas de análisis: gráfico de evolución de saldo, gráfico de gastos por etiqueta (pie/bar), heatmap de gastos por día/mes, estadísticas (día más caro, racha sin gastos, totales por mes). Implementadas con PrimeNG Charts.
- `attachments`: Subida, visualización y borrado de ficheros adjuntos (imágenes/PDF) asociados a transacciones; almacenamiento en disco local.
- `recurrents`: Registro y gestión de pagos recurrentes asociados a transacciones.

### Modified Capabilities

<!-- No hay specs previas en openspec/specs/ — todo es nuevo -->

## Impact

- **Código eliminado**: Todo el código de `api/`, `front/`, `notifier/` en la rama actual.
- **Nueva estructura de ramas**: Se trabaja en la rama `v2` (nueva), sin tocar `master`.
- **Base de datos**: Esquema PostgreSQL nuevo; no hay migración de datos desde SQLite en esta fase.
- **Infraestructura**: `docker-compose.yml` actualizado para incluir `wheimo-api` (Spring Boot), `wheimo-fetcher` (Spring Boot), frontend Angular (Nginx), PostgreSQL, Redis.
- **Dependencias nuevas**: Java 21, Spring Boot 4.1.0, Spring Security, Spring Data JPA, Hibernate, Flyway (migraciones DB), Maven/Gradle; Angular 21, Node 24, PrimeNG 21.
- **API REST**: Se mantiene la misma semántica de recursos (cuentas, transacciones, etiquetas, reglas, presupuestos) con endpoints REST equivalentes; los contratos pueden variar ligeramente en nombres de campos (snake_case → camelCase).
- **Auth**: Los clientes deben enviar JWT en header `Authorization: Bearer <token>` (igual que en v1).
