# Sachin Bista — Portfolio

Personal portfolio site for Sachin Bista, a BSc. CSIT student (Bhairahawa Multiple Campus, Nepal) learning full-stack development. Built as plain HTML/CSS/JS — no build step, no framework, no dependencies to install.

**Live resume, real projects only.** The Skills and Projects sections deliberately show only what's backed by the resume — no inflated tech stack, no fabricated apps. See "Content policy" below before adding anything new.

---

## Folder structure

```
portfolio/
├── index.html                    # The site
├── styles.css                    # All styling
├── script.js                     # All behavior (nav, resume modal, GitHub API, WhatsApp widget)
├── sachin_bista_premium_cv.html  # The resume, opened inline via the Resume button
├── projects.json                 # Local-only practice projects, shown in "From My Workspace"
├── generate_projects.py          # Local dev tool — regenerates projects.json from a folder
├── assets/
│   ├── profile.jpg               # Photo used in hero, GitHub card, and Open Graph tags
│   └── favicon.png               # Browser tab icon (cropped from profile photo)
└── README.md                     # This file
```

**Deploy the whole folder together** — `index.html` references `styles.css`, `script.js`, `sachin_bista_premium_cv.html`, `projects.json`, and everything in `assets/` by relative path. Moving any of them breaks the site.

---

## Running it locally

No build step — just serve the folder. Opening `index.html` directly in a browser mostly works, but `fetch()` calls (projects.json, live GitHub stats) need an actual server due to browser CORS/file:// restrictions:

```bash
cd portfolio
python3 -m http.server 8000
# then open http://localhost:8000
```

Or use the VS Code "Live Server" extension, or `npx serve`.

## Deploying

Any static host works — Vercel, Netlify, GitHub Pages, Cloudflare Pages. Drag-and-drop the `portfolio/` folder or connect it to a git repo. No build command is needed; the output directory is the folder itself.

**After deploying**, update these two `<meta>` tags in `index.html` to use your live domain instead of a relative path — social platforms (WhatsApp, LinkedIn, X) need an absolute URL to generate a link preview card:

```html
<meta property="og:image" content="assets/profile.jpg" />   <!-- change to https://yourdomain/assets/profile.jpg -->
<meta name="twitter:image" content="assets/profile.jpg" />  <!-- same -->
```

---

## What's on the page

| Section | Source of truth |
|---|---|
| Hero / About | Written from what Sachin confirmed directly — not the resume |
| Projects | Real work only: this portfolio, the in-progress Online Clothes Thrifting System, and HTML/CSS practice pages |
| Skills | Copied exactly from `sachin_bista_premium_cv.html` — HTML, CSS, JavaScript (Learning), C/C++, Java, Software Engineering, Project Management |
| GitHub stats & activity | Live, fetched client-side from the public GitHub API (`api.github.com/users/dghimirey`) — no hardcoded numbers |
| Education timeline | Araniko English Boarding School (SEE) → St. Joseph English Secondary (+2 Science) → Bhairahawa Multiple Campus (BSc. CSIT, started 2079 B.S.) |
| Resume | `sachin_bista_premium_cv.html`, opened inline via the Resume button (nav, mobile menu, and hero) |
| "From My Workspace" | Pulls from `projects.json` — local practice files not yet deployed, shown with a **Copy path** button instead of a dead link |

## Content policy

This site had inflated claims in an earlier draft (React/Next.js/Firebase skills, three fake "live" apps) that didn't match the resume. They were removed. **Before adding a new project or skill, ask: is this actually true and verifiable right now?** If it's aspirational or in-progress, label it that way (see the "Online Clothes Thrifting System" card for the pattern) rather than presenting it as finished, deployed work.

## Updating `projects.json`

`generate_projects.py` is a local script (run on Sachin's own machine, not deployed) that scans a folder and regenerates `projects.json`. Entries with a `file:///` path are treated as local-only by `script.js` and rendered with a **Copy path** button instead of a live link, since browsers block navigating from a hosted page to a local file. Entries with an `https://` path are treated as real hosted links and rendered as clickable.

```bash
python3 generate_projects.py
# writes to D:\portfolio\projects.json — edit the `root` and `out_path`
# variables at the top of the script if your paths differ
```

## Browser support

Vanilla HTML/CSS/JS with `IntersectionObserver`, `fetch`, and `navigator.clipboard` — supported in all current evergreen browsers (Chrome, Firefox, Safari, Edge). No polyfills included.

---

## Contact

- **Email:** sachinbista2102@gmail.com
- **Phone / WhatsApp:** +977 9867418402
- **GitHub:** 
- **Location:** Rupandehi, Nepal
