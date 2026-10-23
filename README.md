# Akaar

An Arabic RTL marketplace built with Next.js, Prisma, and PostgreSQL. The home
page includes a local demo catalog so cart, favorites, and checkout interactions
can be explored without a payment provider.

## Development

Use Node.js 20.9 or newer.

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and set the required environment values.
3. For a new database, synchronize the schema with `npx prisma db push`.
4. Start the development server with `npm run dev`.

Visit [http://localhost:3000](http://localhost:3000).

## Demo shopping flow

The products marked **منتج تجريبي** use images from `public/images`. Liked items
and the cart are saved in the current browser. The checkout validates contact
fields and displays a local confirmation; it does not send an order, charge a
payment method, or transmit the entered details.

## Validation and production

- `npm run lint` runs the Next.js ESLint rules.
- `npx tsc --noEmit` checks JavaScript and TypeScript project types.
- `npm run build` creates the production build.
- `npm start` serves the production build.

Deploy with a Node.js host or Vercel. Configure `DATABASE_URL`,
`NEXTAUTH_URL`, and `NEXTAUTH_SECRET` in the host's server-side environment. Google sign-in,
EmailJS contact, and Pinata uploads additionally require their corresponding
optional credentials from `.env.example`. Never expose server secrets using a
`NEXT_PUBLIC_` variable. This repository does not yet include Prisma migration
history; review the schema and back up production data before applying changes
with `npx prisma db push`.
