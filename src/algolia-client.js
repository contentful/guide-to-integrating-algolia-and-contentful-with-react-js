import algoliasearch from 'algoliasearch'

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID
const ALGOLIA_API_TOKEN = import.meta.env.VITE_ALGOLIA_API_KEY
const ALGOLIA_INDEX = import.meta.env.VITE_ALGOLIA_INDEX

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_TOKEN)
const index = client.initIndex(ALGOLIA_INDEX)

export const getPosts = async (query = '', facetFilters) => {
  try {
    const data = await index.search(query, { facetFilters, facets: ['*'] })
    return data
  } catch (error) {
    return undefined
  }
}
