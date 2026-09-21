# EUNITRA Website

First static prototype for the EUNITRA consultancy website.

## Pages

- `index.html` — Home
- `eunitra-way.html` — The EUNITRA Way
- `how-we-help.html` — How We Help
- `knowledge-hub.html` — Knowledge Hub
- `lets-talk.html` — Contact / enquiry page
- `admin.html` — admin UI prototype for homepage statistics

## Features

- Responsive design
- English / Turkish switch across pages
- Shared navigation and visual system
- Editable homepage statistics through the admin prototype
- Contact form UI
- Knowledge Hub starter layout
- No build tools or dependencies required

## Run locally

You can double-click `index.html`, or run a simple local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Important: admin prototype

The current admin page stores changes using browser `localStorage`. This is intentional for the first visual prototype and means:

- no login is implemented yet;
- values persist only in the browser where they are edited;
- changes are not written back to GitHub or shared with all visitors.

For production, replace this with authenticated admin access and a database/API (for example Supabase/PostgreSQL, Firebase, or a lightweight custom backend). The existing admin design can remain.

## GitHub Pages

Because the project is static, it can be published directly with GitHub Pages once committed to a repository.
