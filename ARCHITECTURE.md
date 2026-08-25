# Architecture

The sample application for _Guide to Integrating Algolia and Contentful with React JS_
(`docs/blog-post-draft.md`). It is a single-page Vite + React app that reads a search index;
the indexing half of the integration is configured outside this repository.

## The whole system, including what isn't here

```
Contentful space                    Algolia                     this repository
┌──────────────────┐   webhook     ┌──────────────────┐        ┌──────────────────┐
│ `post` entries   │──────────────►│ search index     │◄───────│ Vite + React SPA │
│ published /      │  (Algolia     │ records = raw    │ search │ read-only,       │
│ unpublished      │   template,   │ Contentful entry │  only  │ browser-side     │
└──────────────────┘   default     │ payloads         │        └──────────────────┘
                       payload)    └──────────────────┘
```

Two Contentful webhooks — one on Publish Entry, one on Unpublish Entry, both filtered to the
`post` content type in the `master` environment — post to
`https://{app-id}.algolia.net/1/indexes/{index-name}/{ /payload/sys/id }` with the Algolia
Admin API Key in headers. They are created from Contentful's built-in Algolia webhook
template, in the Contentful web app. **There is no server-side code in this repository.** The
`README.md` outline still lists "Code implementation for the webhook endpoint (NextJS API
endpoints)" as step 2, but that path was dropped in favour of the template; commit `947e251`
("docs: remove unnecessary Nextjs prerequisite") removed the corresponding prerequisite from
the article.

Because the webhooks send Contentful's default payload, records are un-flattened entries.
That single fact shapes most of the client code.

## Modules

| Module | Responsibility |
| --- | --- |
| `index.html` | Vite entry; single `<div id="root">`, loads `/src/main.jsx` |
| `src/main.jsx` | mounts `<App />` into `#root` inside `React.StrictMode` |
| `src/App.jsx` | the only stateful component: search text, selected facets, loading flag, results and facet lists; owns the fetch effect and the whole page layout |
| `src/algolia-client.js` | module-scope `algoliasearch` client and index handle; exports `getPostsData(query, facetFiltersMap)` — the sole boundary to Algolia |
| `src/Post.jsx` | renders one result card; unwraps `fields.*['en-US']` and formats `publishDate` via `toLocaleString` |
| `src/Facet.jsx` | renders one facet group as a checkbox list with per-option counts |
| `src/App.css` | all styles, plain CSS classes; the results grid is one column below 1024px and `1.1fr 3fr` above |

There is no state library, no router, no data-fetching library in use, and no test framework.

## Data flow

1. `src/algolia-client.js` reads `VITE_ALGOLIA_APP_ID`, `VITE_ALGOLIA_API_KEY` and
   `VITE_ALGOLIA_INDEX` from `import.meta.env` at module load, then constructs the client and
   index handle once, at import time. There is no lazy initialization and no validation of
   missing variables.
2. `App` holds `searchValue` (a string, from the text input) and `facetFiltersMap` (a
   `Map<facetKey, string[]>`). `onFacetChange` toggles a value in the array for a key, deletes
   the key when its array empties, and always writes a **new** `Map`, since replacing the
   reference is what makes the effect re-run.
3. A single `useEffect` keyed on `[searchValue, facetFiltersMap]` sets `loading`, awaits
   `getPostsData`, and stores `data.posts` and `data.facets`.
4. `getPostsData` flattens the map into Algolia's `facetFilters` array of `"key:a,b"` strings,
   calls `index.search(query, { facetFilters, facets: ['*'] })`, and reshapes
   `response.facets` from an object into an array of `{ key, options, title }`.
5. `App` renders the facet sidebar from `facets` and the card grid from `posts`, keying cards
   on Algolia's `objectID`.

Requesting `facets: ['*']` means facet counts are recomputed for every query, so the sidebar
reflects the current result set rather than the whole index.

## Deliberate shape, and its consequences

- **One fetch boundary.** Components never touch the Algolia SDK; only
  `src/algolia-client.js` imports `algoliasearch`. This was tightened over the article's
  development: `a432bfb` and `8e2f72b` moved filter-string construction and the
  posts/facets split out of `App.jsx` and into `getPostsData`.
- **Everything is derived from server state.** There is no client-side filtering or sorting;
  each keystroke and each checkbox is a new Algolia query. Simple to explain, but it also
  means no debouncing — the effect fires per keystroke.
- **Errors are swallowed.** `getPostsData` wraps its body in `try/catch` and returns
  `undefined` on any failure; `App` keeps the previous state and shows "No results!". Auth
  failures, network failures, and a genuinely empty index are indistinguishable in the UI.
  `60bef6f` ("fix: facets evaluation when there are no results") is the empty-results case
  being handled after the fact.
- **Locale unwrapping is spread across components.** Both `Post.jsx` and the `title` regex in
  `algolia-client.js` hardcode `en-US`. Indexing a second locale, or flattening entries in a
  custom webhook, would require changes in both places. The article's "Wrapping Up" section
  names flattening as an exercise left to the reader.

## Build and tooling

Vite 4 with `@vitejs/plugin-react` and no custom configuration beyond that plugin
(`vite.config.js` is five lines). ESLint 8 in flat-file-free legacy mode (`.eslintrc.cjs`)
extending `eslint:recommended`, the React and React Hooks plugin presets, and
`react-refresh`. Formatting settings live in `.prettierrc` (no semicolons, single quotes,
trailing commas, 120 columns). `.npmrc` sets `ignore-scripts=true`, added in `506c9e7`.

`pnpm-lock.yaml` is the committed lockfile. `dist/` and `dist-ssr/` are gitignored; no build
output is tracked.

## Known drift

These are inconsistencies that exist today. They are recorded here rather than fixed, because
fixing them changes the article.

- `swr@^2.2.0` is a declared dependency and is in the lockfile, but nothing imports it. See
  [`docs/ADRs/2026-08-25-fetch-search-results-with-useeffect-instead-of-swr.md`](docs/ADRs/2026-08-25-fetch-search-results-with-useeffect-instead-of-swr.md).
- `.eslintrc.cjs` extends `'prettier'`, which resolves to `eslint-config-prettier` — a package
  absent from both `package.json` and `pnpm-lock.yaml`, so `pnpm lint` cannot load its config.
- The article's Algolia client snippet reads `import.meta.env.VITE_ALGOLIA_API_TOKEN`, while
  its own `.env` block and `.env.example` both define `VITE_ALGOLIA_API_KEY`, which is what
  `src/algolia-client.js` actually reads.
- `catalog-info.yaml` still carries its template placeholders (`description: unknown`,
  `type: unknown`, `lifecycle: unknown`, `tags: [update-me, ...]`) and the warning comment
  saying the fields must be filled before merging.
