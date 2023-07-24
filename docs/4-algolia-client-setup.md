# Setting up the Algolia Client

Create a `algolia-client.js` file within the `src` directory. This file will be in charge of having our Algolia client, the index, and some functions that will allow us to get the data from the index.

Add the following code into your file:

```js
import algoliasearch from 'algoliasearch'

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID
const ALGOLIA_API_TOKEN = import.meta.env.VITE_ALGOLIA_API_TOKEN
const ALGOLIA_INDEX = import.meta.env.VITE_ALGOLIA_INDEX

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_TOKEN)
const index = client.initIndex(ALGOLIA_INDEX)

export const getPosts = (query = '') => {
  return index.search(query)
}
```

With this we're retrieving our credentials, creating an algolia client and initializing the index, which will allow us to perform queries against it.
