## Context

The `transactions` table has two text fields for user annotations:
- `comments` — present since V4 migration, populated on import from bank statements and editable by the user
- `note` — added in V13 migration with a btree index, intended as a secondary annotation

In practice both fields are editable in the transaction details dialog ("Comments" and "Nota" labels). The `note` field adds complexity to the search predicate, the data model, DTOs, and the UI without providing distinct value over `comments`.

## Goals / Non-Goals

**Goals:**
- Remove `note` from all layers: database, backend entity/DTOs, frontend model and UI
- Consolidate user annotation into the single `comments` field
- Ensure search only targets the surviving `comments` field

**Non-Goals:**
- Migrating existing `note` data into `comments` (existing `note` values will be dropped — this is acceptable because the fields overlap and `comments` is the primary field)
- API versioning or backward-compatibility shims for the `note` field

## Decisions

### Drop `note` column without data migration

**Decision**: Issue a `DROP COLUMN note` migration without merging data into `comments`.

**Rationale**: `comments` is populated from bank imports and is the original canonical annotation. `note` was added later and usage is minimal. Merging would require concatenation logic and could corrupt the existing `comments` value. Since this is a personal finance app with a single-user model, data loss risk is low and the user confirmed the intent.

**Alternatives considered**:
- Merge `note` into `comments` with a separator — rejected due to risk of corrupting existing comments values and added migration complexity.

### Remove dedicated `updateNote` frontend method

**Decision**: The frontend's `updateNote(id, note)` method (which PATCHes only `{ note }`) will be removed entirely.

**Rationale**: After removal, note updates will no longer be needed; the general save flow through the dialog sends the full update payload. No separate endpoint is needed.

## Risks / Trade-offs

- [Data loss of `note` column contents] → Acceptable given overlap with `comments`; document in migration comment
- [Breaking API change] → Any client sending `note` in PATCH body will have it silently ignored by Java after field removal — acceptable for this internal app
- [Search coverage reduction] → The full-text search predicate currently covers both `comments` and `note`; after removal only `comments` is searched, which is the desired behavior

## Migration Plan

1. Add backend DB migration (`V14__drop_transaction_note.sql`) that drops the index and column
2. Remove `note` from Java entity, DTOs, service
3. Remove `note` from frontend model, dialog component and template
4. Remove `updateNote` method from frontend service
5. Deploy: backend migration runs automatically on startup; no rollback path (column drop is destructive)
