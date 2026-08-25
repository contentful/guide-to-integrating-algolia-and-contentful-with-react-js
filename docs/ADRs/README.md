# Architectural decision records

Records of decisions this repository actually made, with the commits that evidence them.
Newest first. Filenames are `YYYY-MM-DD-kebab-case-title.md`, dated when the record was
written — which, for retroactive records, is not when the decision was made. Each record says
which it is.

- [2026-08-25 — Fetch search results with `useEffect` instead of SWR](2026-08-25-fetch-search-results-with-useeffect-instead-of-swr.md):
  SWR was installed and used, then replaced by `useState`/`useEffect` in `d204e04` once the
  Algolia query became driven by live user input; the dependency was left declared but unused.
