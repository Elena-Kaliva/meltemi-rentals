# Meltemi Rentals

A fast, mobile-first React landing page for Option A of the Localle take-home assignment.

## Run locally

```bash
npm install
npm run dev
```

## Booking delivery

The form is ready to POST `FormData` to Formspree, Web3Forms, or a serverless endpoint. Copy `.env.example` to `.env.local` and set `VITE_FORM_ENDPOINT` before publishing. The UI never reports a successful request unless the endpoint returns a successful HTTP response.

## Deployment

`vite.config.js` uses relative asset URLs, so the build works at a custom domain or a GitHub Pages repository subpath. Pushing `master` runs the Pages workflow in `.github/workflows/deploy.yml`.

## Before a real launch

Replace the demo email address, connect the form endpoint, verify the fleet examples/prices, and replace any other fictional business details with confirmed client information.
