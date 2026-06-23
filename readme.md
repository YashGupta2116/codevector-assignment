# Product Browser API

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL

## Features

- Browse 200,000 products
- Cursor pagination
- Category filtering
- Snapshot consistency
- Indexed queries

## Why Cursor Pagination?

Offset pagination becomes slower as offsets grow and can produce duplicates when rows are inserted or updated.

Cursor pagination uses:

ORDER BY updatedAt DESC, id DESC

which provides stable and efficient pagination.

## Snapshot Consistency

The first request generates a snapshot timestamp.

All subsequent requests filter using:

updatedAt <= snapshotTime

This guarantees users do not miss products or see duplicates while data changes.

## Setup

npm install

cp .env.example .env

npx prisma migrate dev

npm run seed

npm run dev

## API

GET /products

Query Params:

limit
category
snapshotTime
cursorUpdatedAt
cursorId

## Example

GET /products?limit=20

GET /products?snapshotTime=...&cursorUpdatedAt=...&cursorId=...
