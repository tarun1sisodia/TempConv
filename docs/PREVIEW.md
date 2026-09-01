# Preview & environments

| Mode | Command | URL | Use |
| --- | --- | --- | --- |
| Dev | `python3 -m http.server 8000 --bind 0.0.0.0` (or `npm run serve`) | http://127.0.0.1:8000/ | live files, ES modules, instant iteration |
| Styleguide | same server | http://127.0.0.1:8000/docs/styleguide.html | component×state×theme matrix |
| 404 check | same server | http://127.0.0.1:8000/does-not-exist (Pages maps it; python server shows its own — open /404.html directly) | error page |
| Single file | `node scripts/bundle.mjs` → open dist/tempconv.html | `file://` | offline QA, email review; copy+history degrade to no-throw states here by design (some browsers restrict storage on file://) |

Notes: bind 0.0.0.0 so the sandbox/CI preview proxy works (127.0.0.1-only fails remote preview). No hot-reload — reload is instant anyway. Production deploy = GitHub Pages from branch root (Settings → Pages). No workflow file — the repo's GitHub App lacks workflows permission, and Pages needs none for a static root. `dist/` is a release artifact, not deployed separately.
