# AI Study Assistant

A global AI Study Assistant that helps students learn, revise, practice, write documents, solve problems, and prepare for exams — adapting to languages, education systems, and learning styles.

**Focus:** help students *understand* concepts, not only dump answers.

## Status

Design approved (Rev 3.1). Implementation not started yet (Node.js required for app bootstrap).

## Docs

| Document | Description |
|----------|-------------|
| [`docs/PRODUCT_SPEC.md`](./docs/PRODUCT_SPEC.md) | Master product specification |
| [`docs/DESIGN.md`](./docs/DESIGN.md) | Full system design + PR plan |

## Planned stack

- **Next.js** (App Router) + **TypeScript**
- **SpaceXAI** (thin provider facade)
- **Auth.js** (credentials + Google OAuth, database sessions)
- **PostgreSQL** + Prisma
- **Vercel** + **Inngest** (prod); Docker Compose for local

## Getting started (soon)

Once Node.js 20+ is installed:

```bash
# After PR-01 bootstrap
npm install
npm run dev
```

## Privacy & honesty

- Ask permission before processing uploads; private files; user can delete data
- Practice papers are **practice materials**, not official exams
- Revision topics are **guidance**, not exam predictions

## License

TBD
