# Subscription Tracker

Track recurring payments and see monthly and yearly spend at a glance.

## Screenshots

<!-- Replace with real screenshots saved in docs/screenshots/ -->

| Dashboard | Subscriptions |
| --- | --- |
| ![Dashboard](docs/screenshots/dashboard.png) | ![Subscriptions](docs/screenshots/subscriptions.png) |

## Features

_Coming soon._

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Vitest](https://vitest.dev)

All data is stored in the browser's `localStorage`. There is no backend.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
  app/          Routes and layouts
  components/   UI components
  hooks/        Custom React hooks
  lib/          Pure utility functions
  types/        Shared TypeScript types
  data/         Seed and sample data
```
