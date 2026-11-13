Read `CLAUDE.md` in the project root fully before doing anything. Follow it throughout this task. This task explicitly asks you to set up Firebase Hosting config and CI/CD, which overrides the "do not set up Firebase or CI/CD" rule in CLAUDE.md §2 for this task only.

# Task 2 — Deploy pipeline: GitHub Actions → Firebase Hosting

**Firebase project ID:** `<FIREBASE_PROJECT_ID>`

**GitHub secret already created by the developer:** `FIREBASE_SERVICE_ACCOUNT` (the full service account JSON). Do not create, print, or commit any credentials.

## Goal

- Every push to `main` runs the tests, builds the production site and deploys it to the live Firebase Hosting site.
- Every pull request into `main` runs the tests and the build, then deploys to a temporary Firebase preview channel and posts the preview link on the PR.
- A failing test or build must stop the deploy.

## Step 1 — Firebase Hosting config

Create these in the project root:

**`.firebaserc`** — the default project set to the project ID above.

**`firebase.json`** — Hosting only:
- `public`: the actual production output folder of this Angular project (check `angular.json` and a real `ng build`; with the application builder it is usually `dist/<project-name>/browser`). Do not guess — verify the folder exists and contains `index.html` after building.
- Rewrite all routes to `/index.html` (single-page app).
- `cleanUrls: true`, `trailingSlash: false`.
- Ignore `firebase.json`, dotfiles and `node_modules`.
- **Cache headers:**
  - `index.html`: `Cache-Control: no-cache` (so each deploy shows up straight away).
  - Hashed JS and CSS bundles: `public, max-age=31536000, immutable`.
  - `/images/**`: `public, max-age=604800, stale-while-revalidate=86400` (photos may be replaced under the same file name later, so not immutable).
  - `/brand/**` and other unhashed static files: `public, max-age=86400`.
  - Make sure the hashed-bundle rule cannot accidentally match unhashed files.
- **Security headers on all responses:** `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a `Permissions-Policy` that disables camera, microphone and geolocation. Do **not** add a Content-Security-Policy yet. Google Fonts and the future hosted contact icons would need it tuned, so note it as a later task in your report.

## Step 2 — Node version

- Add an `.nvmrc` with the Node major version this Angular version officially supports, matching the developer's local LTS line if compatible. Check `@angular/core`'s or `@angular/cli`'s `engines` field in `node_modules` to confirm.
- Add a matching `engines.node` field to `package.json`.
- Both workflows read the Node version from `.nvmrc`.

## Step 3 — Workflows

Use the latest major versions of `actions/checkout` and `actions/setup-node`, and `FirebaseExtended/action-hosting-deploy@v0`. Use `npm ci` with npm caching. Tests must run non-interactively (no watch mode).

**`.github/workflows/deploy-live.yml`**
- Triggers: push to `main`, plus `workflow_dispatch` for manual re-deploys.
- `concurrency`: one live deploy at a time; a newer push cancels a queued older one but never interrupts a deploy that is already running.
- Steps: checkout → setup Node → `npm ci` → tests → production build → deploy with `channelId: live`, `projectId` set to the project ID, `firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}`, `repoToken: ${{ secrets.GITHUB_TOKEN }}`.
- Minimal `permissions` (`contents: read`, plus whatever the deploy action needs).

**`.github/workflows/preview-pr.yml`**
- Trigger: pull requests targeting `main`.
- Same steps, but deploy to a preview channel (let the action name it from the PR), `expires: 7d`.
- `permissions` must allow the action to comment the preview URL on the PR (`pull-requests: write`, `checks: write`, `contents: read`).
- Skip the deploy step when the PR comes from a fork, since secrets aren't available there. Tests and build still run.

Add a short comment at the top of each workflow explaining what it does.

## Step 4 — Scripts and docs

- Add npm scripts if missing, so the workflows call clear names: `test:ci` (single run, no watch) and `build:prod` (production build).
- Add a **Deployment** section to `README.md` covering:
  - How deploys work.
  - The live URLs (`https://<project-id>.web.app` and `https://<project-id>.firebaseapp.com`).
  - Where to see runs (GitHub → Actions).
  - How to re-run a deploy manually.
  - How to deploy from a local machine in an emergency (`npx firebase-tools deploy --only hosting` after `firebase login`).
  - That the `FIREBASE_SERVICE_ACCOUNT` secret must never be committed.
- Add a short **Deployment** section to `CLAUDE.md` (as §11) recording:
  - The project ID.
  - The two workflows.
  - The secret name.
  - The rule that only pushes to `main` reach the live site.
- Make sure `.gitignore` covers Firebase local files (`.firebase/`, `firebase-debug.log*`, and any `*-firebase-adminsdk-*.json` key files).

## Step 5 — Verify and report

- Run `npm run test:ci` and `npm run build:prod` locally, and confirm the `public` folder in `firebase.json` contains `index.html`, the bundles, `/images/` and `/brand/`.
- Validate both workflow files are valid YAML. If you can do it without new dependencies, also run a workflow linter (e.g. `npx` a linter, or reason through it carefully).
- If possible without logging in, check `firebase.json` with the Firebase CLI via `npx firebase-tools` (e.g. serve the hosting config locally) and confirm the SPA rewrite and headers behave. If the CLI requires login, skip this and say so.
- Do **not** attempt an actual deploy and do not run `firebase login`.
- Commit locally in logical commits. Do not push.
- Finish with the report in the format from CLAUDE.md §10. In "What the developer needs to do or check manually", list the exact steps to trigger and confirm the first deploy.
