# AGENTS.md

Orientation for coding agents (and humans skimming) working in this repository.

## What this repository is

This is the finished sample application for the tutorial in
[`docs/blog-post-draft.md`](docs/blog-post-draft.md) — _Guide to Integrating Algolia and
Contentful with React JS_. It is a teaching example, not a library, SDK, or supported
product. `package.json` is `"private": true` at version `0.0.0`; nothing here is published
to a registry, and there is no release process.

The repository's job is to be the working end state that the article's code blocks build up
to. That constrains every change: the code exists to match the prose, not the other way
around.

## Status: effectively frozen

The application code was written between 2023-07-23 (`09c7df6`) and 2023-08-03 (`5e4ad54`)
and has not been touched since. Everything after that is repository hygiene contributed from
outside the original authors:

| Commit | Date | Change |
| --- | --- | --- |
| `22af4f9` | 2024-03-07 | added `catalog-info.yaml` (Backstage descriptor) |
| `0fe0469` | 2024-04-16 | added `.github/CODEOWNERS` (cf-allstar bot) |
| `506c9e7` | 2025-11-26 | added `.npmrc` with `ignore-scripts=true` |

Assume the app is done. Prefer describing or correcting what is here over modernizing it —
upgrading React, swapping in `react-instantsearch`, or adding a router would silently
invalidate the article.

## Ground rules

- **Code and article move together.** The `.jsx` files under `src/` are reproduced as fenced
  code blocks in `docs/blog-post-draft.md`. If you change a component, update the matching
  block in the article; if you change the article's code, change the source file.
- **Never commit an Algolia key.** Vite inlines every `VITE_`-prefixed variable into the
  browser bundle, so `VITE_ALGOLIA_API_KEY` must be Algolia's **Search-Only API Key**. The
  Admin API Key appears in the article only when configuring the Contentful webhook, which
  lives in the Contentful web app, not in this repository.
- `.gitignore` line 26 (`*.env`) ignores `.env`; line 27 (`!.env.example`) deliberately keeps
  `.env.example` tracked. Declare new variables in `.env.example` with empty string values,
  as the three existing ones are.
- **`public/images/*.png` are article assets.** All twelve are referenced by
  `docs/blog-post-draft.md`, and their numeric prefixes are the article's ordering. Do not
  rename or reorder them without editing the article.
- **There are no tests and no CI.** There is no `.github/workflows/` directory. `pnpm lint`
  is the only automated check, and it currently cannot run — see `CONTRIBUTING.md`.
- **Don't expect to run the app.** It renders nothing without an Algolia application ID, a
  search-only key, and an index already populated by the Contentful webhook. There is no
  fixture data or mock in the repository.

## Commands

From `package.json`. `pnpm-lock.yaml` (lockfile 6.0) is the committed lockfile, so use `pnpm`
to avoid churning it — note that the article itself instructs the reader to use `npm`, since
readers start from a fresh `npm create vite@latest`.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Vite dev server |
| `pnpm build` | production build to `dist/` (gitignored) |
| `pnpm lint` | `eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0` |
| `pnpm preview` | serve a built bundle |

## Where things are

| Path | Role |
| --- | --- |
| `index.html` | Vite HTML entry, loads `/src/main.jsx` |
| `src/main.jsx` | React root, `StrictMode` |
| `src/App.jsx` | all state: search text, selected facets, fetch orchestration |
| `src/algolia-client.js` | `algoliasearch` client, index handle, `getPostsData()` |
| `src/Post.jsx`, `src/Facet.jsx` | presentational components |
| `src/App.css` | all styling, plain CSS with `className` |
| `docs/blog-post-draft.md` | the article this repo accompanies |
| `public/images/` | article screenshots |
| `.github/CODEOWNERS` | `* @contentful/team-devrel` |
| `catalog-info.yaml` | Backstage descriptor, still largely template placeholders |

## The one thing that surprises everyone

Algolia records here are raw Contentful webhook payloads, because the article uses
Contentful's Algolia webhook template with the default payload. Fields are therefore
locale-keyed, and every read has to unwrap the locale:

```js
post.fields.title['en-US']
```

Facet keys arrive in the same shape (`fields.category.en-US`), which is why
`src/algolia-client.js` derives a human label with a lookaround regex:

```js
title: facetKey.match(/(?<=fields.)[A-Za-z]+(?=.en-US)/)[0]
```

That regex indexes `[0]` unconditionally, so a facet attribute that is not shaped
`fields.<name>.en-US` throws. The throw is swallowed by the surrounding `try/catch`, which
returns `undefined`, and `src/App.jsx` renders that as "No results!" — a misconfigured index
looks identical to an empty one. Keep this in mind before debugging the UI: check the Algolia
index configuration first.

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the full data flow and
[`CONTRIBUTING.md`](CONTRIBUTING.md) for setup and conventions.
