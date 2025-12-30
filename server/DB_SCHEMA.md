# Database schema

This project uses MongoDB via Mongoose. Collections and their fields are documented below so you can visualize the data model without inspecting the source.

## Users (`users` collection)
- **provider** (`String`, enum `local|google|facebook`, default `local`)
- **providerId** (`String`, optional, sparse index)
- **displayName** (`String`, optional, trimmed)
- **firstName** (`String`, optional, trimmed)
- **lastName** (`String`, optional, trimmed)
- **mobile** (`String`, optional, trimmed)
- **country** (`String`, optional, trimmed)
- **occupation** (`String`, optional, trimmed)
- **username** (`String`, unique, sparse, trimmed, optional)
- **email** (`String`, unique, sparse, lowercased, optional)
- **password** (`String`, optional; only present for local accounts)
- **avatar** (`String`, optional)
- **role** (`String`, enum `user|admin`, default `user`)
- **timestamps**: `createdAt`, `updatedAt` (auto-managed)

**Indexes**
- Compound unique sparse index on `{ provider, providerId }` to prevent duplicate social accounts.
- Unique sparse indexes on `username` and `email`.

## Polls (`polls` collection)
- **question** (`String`, required)
- **options** (`Array` of objects)
  - **text** (`String`)
  - **votes** (`Number`, default `0`)
- **votedUsers** (`Array<ObjectId>` referencing `users`)
- **createdBy** (`ObjectId` referencing `users`)
- **timestamps**: `createdAt`, `updatedAt` (auto-managed)

## News (`news` collection)
- **title** (`String`, required)
- **content** (`String`, required)
- **author** (`ObjectId` referencing `users`)
- **timestamps**: `createdAt`, `updatedAt` (auto-managed)

## Relationships
- Polls and news entries reference the `users` collection via `createdBy`, `votedUsers`, and `author` fields for ownership and attribution.
- Social login accounts are distinguished by the `{ provider, providerId }` pair, while local accounts rely on `username`/`email` plus `password`.
