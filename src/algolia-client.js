import algoliasearch from 'algoliasearch'

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID
const ALGOLIA_API_TOKEN = import.meta.env.VITE_ALGOLIA_API_KEY
const ALGOLIA_INDEX = import.meta.env.VITE_ALGOLIA_INDEX

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_TOKEN)
const index = client.initIndex(ALGOLIA_INDEX)

export const getPosts = async (query = '', facetFiltersMap) => {
  const facetFilters = [...facetFiltersMap]
    .map(([key, val]) => {
      if (val.length) return `${key}:${val.join(',')}`
      return ''
    })
    .filter(Boolean)

  try {
    const data = await index.search(query, { facetFilters, facets: ['*'] })

    const sanitizedFacets = Object.entries(data.facets).map(([facetKey, facetOptions]) => {
      return {
        key: facetKey,
        options: facetOptions,
        title: facetKey.match(/(?<=fields.)[A-Za-z]+(?=.en-US)/)[0],
      }
    })

    return {
      ...data,
      facets: sanitizedFacets,
    }
  } catch (error) {
    return undefined
  }
}
