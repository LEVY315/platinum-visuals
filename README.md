# PlatinumVisuals

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment

The site is hosted on **Firebase Hosting** (project `platinum-visuals`) and deployed by GitHub Actions. Nobody needs to deploy by hand.

### How deploys work

| Event | Workflow | What happens |
|---|---|---|
| Push to `main` (including a merged PR) | [`deploy-live.yml`](.github/workflows/deploy-live.yml) | `npm ci` → `npm run test:ci` → `npm run build:prod` → deploy to the **live** site |
| Pull request into `main` | [`preview-pr.yml`](.github/workflows/preview-pr.yml) | Same tests and build, then deploy to a temporary **preview channel** (expires after 7 days). A bot comments the preview URL on the PR. |

- If a test or the build fails, the deploy step does not run and the live site is left unchanged.
- Only pushes to `main` reach the live site. Pull requests only ever produce preview URLs.
- PRs from forks run the tests and build but skip the preview deploy, because GitHub does not give secrets to fork PRs.
- Only one live deploy runs at a time. If several pushes land quickly, a queued older run is replaced by the newest, but a deploy already in progress is never interrupted.

Node version: CI uses the version in [`.nvmrc`](.nvmrc) (Node 24, as supported by Angular 22). Use the same locally (`nvm use`).

### Live URLs

- https://platinum-visuals.web.app
- https://platinum-visuals.firebaseapp.com

### Where to see deploy runs

GitHub → the repository → **Actions** tab. "Deploy to live" lists the live deploys, and "Preview pull request" the PR previews. Firebase console → Hosting also shows the release history and lets you roll back to an earlier release.

### Re-running a deploy manually

- **Re-deploy the current `main`:** Actions → **Deploy to live** → **Run workflow** → branch `main` → **Run workflow**.
- **Retry a failed run:** open the run → **Re-run jobs**.

### Emergency deploy from a local machine

Only use this if GitHub Actions is unavailable. It deploys whatever is in your working copy, so make sure you are on an up-to-date, clean `main` first.

```bash
git switch main && git pull
npm ci
npm run test:ci
npm run build:prod
npx firebase-tools login          # one-time, opens a browser
npx firebase-tools deploy --only hosting
```

### Credentials

Deploys authenticate with the `FIREBASE_SERVICE_ACCOUNT` repository secret (GitHub → Settings → Secrets and variables → Actions), which holds the service account JSON key.

**Never commit that JSON key, or any other credential, to the repository.** `.gitignore` blocks the usual key file names (`*-firebase-adminsdk-*.json`), but don't rely on that alone: keep key files out of the project folder entirely. If a key is ever exposed, delete it in Google Cloud console → IAM → Service accounts → Keys, create a new one, and update the secret.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
