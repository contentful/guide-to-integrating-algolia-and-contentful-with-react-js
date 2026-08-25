# Fetch search results with `useEffect` instead of SWR

- **Date:** 2026-08-25
- **Status:** Accepted — recorded retroactively

> This record was written on 2026-08-25 from the repository's commit history. It documents a
> decision made in July 2023, not a new one. The evidence for *what* changed is exact; the
> *why* is reconstructed and labelled as such below.

## Context

The repository's original plan, still visible in `README.md` step 5, was "React Algolia setup
(using something minimal like [swr](https://www.npmjs.com/package/swr))".

That is what was first built. Commit `759301e` (2023-07-24, "feat: add basic UI and docs about
showing data in the client") added `swr@^2.2.0` to `package.json` dependencies, told readers to
run `npm install swr` in the article, and wired the component up as:

```js
import useSWR from 'swr'

function App() {
  const { data } = useSWR('posts', getPosts)
```

The cache key was the constant string `'posts'` and the fetcher took no arguments, because at
that point the app only listed every record in the index.

Four days later the tutorial reached its search section, and the query stopped being constant:
the app grew a text input, and later a facet checkbox sidebar, both of which change the Algolia
query on every interaction.

## Decision

Drop SWR and drive the search from React's built-in state primitives: `useState` for the query
text and the selected-facet `Map`, and a single `useEffect` keyed on both that calls
`getPostsData` and stores the result.

This happened in commit `d204e04` (2023-07-28, "feat: update sections 4 and 5 — update 'algolia
client setup' section and 'showing data' section considering new search implementation"), which
removed the `useSWR` import from `src/App.jsx` and introduced the `useState`/`useEffect` pair
that is still there today. The article's code blocks were rewritten in the same commit, so the
prose and the code changed together.

The reconstructed reason — inferred from the diff, not stated in the commit message — is that
the SWR usage was keyed on a constant while the new feature required a key derived from live
user input. Continuing with SWR would have meant explaining cache keys, revalidation, and
`keepPreviousData` in a tutorial whose subject is Algolia, not React data fetching.
`useState` + `useEffect` needs no such digression.

## Consequences

- `src/algolia-client.js` remains the only module that talks to Algolia, and `src/App.jsx`
  remains the only stateful component. The article can present the whole data path in two
  short files.
- **`swr` was never removed from `package.json`.** It is still a declared dependency at
  `^2.2.0` and still resolved in `pnpm-lock.yaml`, but nothing under `src/` imports it. It is
  dead weight in the install.
- `README.md` step 5 still advertises SWR, so the outline no longer describes the code. The
  article itself no longer mentions SWR anywhere.
- No request deduplication, caching, or revalidation, and no debounce: the effect fires an
  Algolia query per keystroke and per checkbox toggle.
- `getPostsData` returns `undefined` on any error and `App` renders that as "No results!", so
  the app has no error state — something SWR's `error` value would have surfaced for free. See
  the "Errors are swallowed" note in `ARCHITECTURE.md`.

Removing the unused `swr` dependency and correcting `README.md` step 5 would be a safe
follow-up: neither is referenced by the article's code. That cleanup has not been done, so
anyone auditing this project's dependencies will see `swr` and should know it is inert.
