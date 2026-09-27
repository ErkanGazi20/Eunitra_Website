# EUNITRA Website

Production-oriented static website for EUNITRA, hosted on GitHub Pages at `eunitra.com`.

## Pages

- `index.html` — Home
- `eunitra-way.html` — The EUNITRA Way
- `how-we-help.html` — How We Help
- `knowledge-hub.html` — Knowledge Hub
- `lets-talk.html` — Contact / enquiry page
- `admin.html` — secure administrator login and homepage-statistics editor

## Current features

- Responsive English / Turkish website
- GitHub Pages custom domain support (`CNAME`)
- Contact enquiries delivered to `ulku@eunitra.com`
- Secure admin login through Supabase Auth
- Homepage statistics stored centrally in Supabase/PostgreSQL
- Row Level Security: public users can read stats; only `ulku@eunitra.com` can update them
- No admin link exposed in the public footer

## One-time Supabase setup

The secure admin UI is already implemented in the code. It needs a Supabase project before it can go live.

1. Create/connect the Supabase project.
2. Open the Supabase SQL Editor and run `supabase-setup.sql`.
3. In **Authentication → Users**, create the administrator account with email `ulku@eunitra.com` and a strong password. Disable open public sign-ups if they are not needed.
4. In the Supabase project **Connect** dialog (or **Settings → API Keys**), copy:
   - Project URL
   - Publishable key (`sb_publishable_...`)
5. Put those values in `js/config.js`.
6. Commit and push the changes to GitHub.

The publishable key is intended for browser/client code. Security is enforced by database grants, Supabase Auth and Row Level Security. Never put a Supabase secret key/service-role key into this repository.

## Database security model

`supabase-setup.sql` creates one row in `public.site_stats` and configures:

- `anon`: SELECT only
- `authenticated`: SELECT + UPDATE grant
- RLS UPDATE policy: only a signed-in JWT for `ulku@eunitra.com` can update the row
- no client INSERT or DELETE grants

## Admin use

After setup, visit:

`https://eunitra.com/admin.html`

Sign in with the authorised EUNITRA administrator account. Updating the three statistics and pressing **Publish changes** updates the central database, so the new figures are shown to all website visitors.

## Local development

Run a simple local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Git workflow

```bash
git add .
git commit -m "Add secure EUNITRA admin backend"
git push
```


## Production Supabase backend (configured)

Project: `EUNITRA Website` (`ndmppwpqjwnuociasphd`) in Frankfurt (`eu-central-1`).

The site now reads homepage statistics from `public.site_stats`. Row Level Security allows public read access, while updates are permitted only to an authenticated Supabase user whose email is `ulku@eunitra.com`. The browser contains only the publishable key, never a service-role key.

Admin login uses a passwordless Supabase magic link sent to `ulku@eunitra.com`.

### One-time Auth URL configuration

In Supabase Dashboard → Authentication → URL Configuration set:

- Site URL: `https://eunitra.com`
- Redirect URLs: add `https://eunitra.com/admin.html`

Then visit `https://eunitra.com/admin.html`, enter `ulku@eunitra.com`, and click **Email me a secure sign-in link**.
