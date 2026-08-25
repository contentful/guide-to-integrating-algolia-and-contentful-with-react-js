# Contributing

This repository is the companion sample app for the tutorial in `docs/blog-post-draft.md`. It
is a teaching example rather than a maintained library, and it has been unchanged in substance
since 2023-08-03. Contributions are welcome, but the useful ones are narrow — see
[Scope](#scope) before starting.

Code owner: `@contentful/team-devrel` (`.github/CODEOWNERS`).

## Prerequisites

- **Node.js 18 or above**, as stated in the article's prerequisites.
- **pnpm.** `pnpm-lock.yaml` (lockfile 6.0) is the committed lockfile; using npm or yarn would
  replace it. The article tells readers to use `npm`, which is correct for them — they start
  from a fresh `npm create vite@latest` — but not for changes to this repository.
- A **Contentful space** with a `post` content type and the two Algolia webhooks from the
  article, and an **Algolia application** with a populated index. Without these the app builds
  and serves but renders "No results!"; there is no fixture data in the repository.

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill in the three variables in `.env`:

| Variable | Value |
| --- | --- |
| `VITE_ALGOLIA_APP_ID` | Algolia Application ID |
| `VITE_ALGOLIA_API_KEY` | Algolia **Search-Only API Key** |
| `VITE_ALGOLIA_INDEX` | index name |

`VITE_`-prefixed variables are inlined into the browser bundle by Vite, so this key is public
by design. Use the Search-Only key, never the Admin API Key — the Admin key is only ever
entered into the Contentful webhook configuration, in the Contentful web app.

`.env` is ignored by `.gitignore` (`*.env`, line 26). `.env.example` is explicitly re-included
on line 27 and is tracked; add new variables there with empty string values. Do not edit
`.gitignore` to loosen either rule.

Then:

```bash
pnpm dev      # Vite dev server
pnpm build    # production build into dist/ (gitignored)
pnpm preview  # serve the built bundle
```

## Linting and formatting

```bash
pnpm lint
```

runs `eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0`.

**Known issue:** `.eslintrc.cjs` extends `'prettier'`, which ESLint resolves to
`eslint-config-prettier`. That package is not declared in `package.json` and is not present in
`pnpm-lock.yaml`, so ESLint cannot load the config and the command fails before it lints
anything. Either install `eslint-config-prettier` as a dev dependency or drop `'prettier'`
from `extends` — but do so as its own commit, separate from any content change, because it
touches the article's toolchain.

Formatting rules are in `.prettierrc`: no semicolons, single quotes, trailing commas
everywhere, 120-column print width, `endOfLine: auto`. Prettier itself is not a dependency;
match the existing files by hand or run your editor's Prettier integration against
`.prettierrc`.

There are no tests and no CI. There is no `.github/workflows/` directory, so nothing runs
automatically on a pull request.

## Scope

**In scope**

- Corrections where the code and `docs/blog-post-draft.md` disagree.
- Article fixes: broken links, unclear steps, stale Contentful or Algolia UI descriptions.
- Documentation, including the records under `docs/ADRs/`.
- Tooling fixes that make the documented commands actually work, such as the lint issue above.
- Dependency updates for security advisories.

**Out of scope**

Anything that makes the code diverge from what the article teaches: switching to
`react-instantsearch`, introducing TypeScript, adding a router or state library, restructuring
`src/`, or upgrading React and Vite past what the article's snippets show. If you want to
demonstrate a different approach, a new article and a new sample repository are the right
vehicle.

## Keeping code and article in sync

`docs/blog-post-draft.md` reproduces the files under `src/` as fenced code blocks, and
references all twelve screenshots in `public/images/` by their numbered filenames. Any change
to a component must be mirrored in the corresponding block, and vice versa. Do not rename the
screenshots — the numeric prefixes encode the article's order.

## Commits and pull requests

The history uses Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`. Use `docs:` for
documentation-only changes. There is no semantic-release or any other publishing automation in
this repository — `package.json` is `"private": true` at version `0.0.0` — so the prefix is a
readability convention, not a release trigger.

Open a pull request against `main`. In the description, say which of the code, the article, or
both you changed, and note whether you were able to run the app against a real Algolia index
or only reasoned about the change statically. `@contentful/team-devrel` is requested
automatically via `CODEOWNERS`.

## Security

Never commit credentials: no Algolia keys, no Contentful CMA or CDA tokens, no `.env` file.
Run `git status --short` before committing and check every path. If you accidentally push a
key, rotate it in the Algolia dashboard first, then clean up the history.
