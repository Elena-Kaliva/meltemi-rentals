# Meltemi Rentals

A fast, mobile-first React landing page for Option A of the Localle take-home assignment.

## Run locally

```bash
npm install
npm run dev
```

## Booking delivery

The booking form submits asynchronously to Formspree and uses Cloudflare Turnstile plus Formspree's `_gotcha` honeypot. Success is displayed only after Formspree returns a successful response.

### Configure Formspree and Turnstile

1. Create a form in Formspree and copy its Form ID.
2. Create a Cloudflare Turnstile widget. Add the production hostname (for this repository, `elena-kaliva.github.io`) and any local hostname used for manual testing.
3. In Formspree, open the form's CAPTCHA settings, choose Cloudflare Turnstile, paste the **Turnstile secret key**, and enable CAPTCHA protection. The secret belongs only in Formspree and must never be added to this repository.
4. Copy `.env.example` to `.env.local` and set the two public frontend values:

   ```dotenv
   VITE_FORMSPREE_FORM_ID=your_form_id
   VITE_TURNSTILE_SITE_KEY=your_public_site_key
   ```

5. For GitHub Pages, open **Repository settings → Secrets and variables → Actions → Variables** and create `VITE_FORMSPREE_FORM_ID` and `VITE_TURNSTILE_SITE_KEY`. The deployment workflow supplies those repository variables to Vite at build time.
6. Build and deploy, then send a real booking request and verify both the Formspree submission and notification email.

The Turnstile site key and Formspree form ID are public configuration. Never add the Turnstile secret, email credentials, or SMTP credentials to frontend environment files.

## Deployment

`vite.config.js` uses relative asset URLs, so the build works at a custom domain or a GitHub Pages repository subpath. Pushing `master` runs the Pages workflow in `.github/workflows/deploy.yml`.

## Before a real launch

Replace the demo email address, verify the fleet examples/prices, test the Formspree notification recipient, and replace any other fictional business details with confirmed client information.
