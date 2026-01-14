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
- **region** (`String`, optional, trimmed)
- **cityOrVillage** (`String`, optional, trimmed)
- **gender** (`String`, optional, enum `male|female|other|prefer_not_to_say`, trimmed)
- **username** (`String`, unique, sparse, trimmed, optional)
- **email** (`String`, unique, sparse, lowercased, optional)
- **password** (`String`, optional; only present for local accounts)
- **avatar** (`String`, optional)
- **role** (`String`, enum `user|reporter|editor|admin`, default `user`)
- **timestamps**: `createdAt`, `updatedAt` (auto-managed)

**Indexes**
- Compound unique sparse index on `{ provider, providerId }` to prevent duplicate social accounts.
- Unique sparse indexes on `username` and `email`.

## Polls (`polls` collection)
- **question** (`String`, required)
- **options** (`Array` of objects)
  - **text** (`String`, required, trimmed)
  - **votes** (`Number`, default `0`)
  - **createdBy** (`ObjectId` referencing `users`, optional)
  - **status** (`String`, enum `approved|pending`, default `approved`)
  - **photoUrl** (`String`, optional, trimmed) - for people mode
  - **photo** (`String`, optional) - base64 data URL for people mode
  - **profileUrl** (`String`, optional, trimmed) - for people mode
- **votedUsers** (`Array<ObjectId>` referencing `users`)
- **userVotes** (`Array` of objects)
  - **userId** (`ObjectId` referencing `users`, required)
  - **optionId** (`ObjectId`, required)
- **createdBy** (`ObjectId` referencing `users`)
- **tags** (`Array<String>`, trimmed, unique per poll)
- **region** (`String`, optional)
- **cityOrVillage** (`String`, optional; must match selected region when present)
- **isAnonymousCreator** (`Boolean`, default `false`; hides creator identity from readers)
- **anonymousResponses** (`Boolean`, default `false`; allows voters to remain anonymous and vote without logging in once per session)
- **allowUserOptions** (`Boolean`, default `false`; enables users to add their own options)
- **userOptionApproval** (`String`, enum `auto|creator`, default `auto`; controls approval workflow for user-submitted options)
- **optionsArePeople** (`Boolean`, default `false`; enables people mode with photos and profile links)
- **linkPolicy** (`Object`)
  - **mode** (`String`, enum `any|allowlist`, default `any`)
  - **allowedDomains** (`Array<String>`, default `[]`)
- **timestamps**: `createdAt`, `updatedAt` (auto-managed)

## News (`news` collection)
**Deprecated:** Standalone news items are no longer created. Articles with `isNews: true` are used instead.

- **title** (`String`, required)
- **content** (`String`, required)
- **author** (`ObjectId` referencing `users`)
- **timestamps**: `createdAt`, `updatedAt` (auto-managed)

## Articles (`articles` collection)
- **title** (`String`, required, trimmed)
- **content** (`String`, required)
- **author** (`ObjectId` referencing `users`, required)
- **tags** (`Array<String>`, trimmed, unique per article, max 10)
- **region** (`String`, optional)
- **cityOrVillage** (`String`, optional; must match selected region when present)
- **isNews** (`Boolean`, default `false`; marks article as news)
- **taggedAsNewsBy** (`ObjectId` referencing `users`, optional; user who tagged as news)
- **taggedAsNewsAt** (`Date`, optional; timestamp when tagged as news)
- **timestamps**: `createdAt`, `updatedAt` (auto-managed)

**Indexes**
- Compound index on `{ author, createdAt }` for author's articles
- Compound index on `{ isNews, createdAt }` for news feed
- Index on `tags` for tag-based queries

## Contact Messages (`contactmessages` collection)
- **name** (`String`, optional; sender provided or derived from user profile)
- **email** (`String`, required, lowercased, trimmed)
- **topic** (`String`, default `"general"`)
- **message** (`String`, required)
- **user** (`ObjectId` referencing `users`, optional)
- **userSnapshot** (`Object`, optional) immutable copy of key profile fields at submission time
  - **id**, **displayName**, **email**, **username**, **provider**, **role**
- **ipAddress** (`String`, optional) request IP captured via Express
- **userAgent** (`String`, optional) request user-agent header
- **referrer** (`String`, optional) HTTP referrer when present
- **status** (`String`, enum `open|reviewed|closed`, default `open`)
- **timestamps**: `createdAt`, `updatedAt` (auto-managed)

## Relationships
- Polls and news entries reference the `users` collection via `createdBy`, `votedUsers`, and `author` fields for ownership and attribution.
- Social login accounts are distinguished by the `{ provider, providerId }` pair, while local accounts rely on `username`/`email` plus `password`.
