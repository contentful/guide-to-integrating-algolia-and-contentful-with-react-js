# Guide to Integrating Algolia and Contentful with React JS

## Introduction

[Algolia](https://www.algolia.com/) is a performant search engine that exposes an API to perform search and discovery on your data. Instead of having to make several queries to the content source, which can do the job at the expense of performance and query filtering complexity, Algolia solves this by indexing your data and giving you access to it.

This tutorial will guide you through using Algolia to create search indexes and manage data-fetching logic in a React project and how to apply these techniques to data coming from Contentful. We'll be able to display the data in a catalog-like web view. All the code in this tutorial can be found in [this repository](https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js).

### Prerequisites

To follow along, you’ll need:

- A Contentful account. [Sign up](https://www.contentful.com/sign-up/) if you do not have one.
- An Algolia account. [Sign up](https://dashboard.algolia.com/users/sign_up) if you do not have one.

- Intermediate knowledge of JavaScript.
- Node.js version 18 or above.

## Setup Contentful webhooks connected with Algolia

First of all, we'll need to create Algolia credentials and a search index.

In your Algolia dashboard, create an application. Then, create an index. You can call it whatever you like. For the purpose of this tutorial, we'll be creating an index of blog posts.

<img width="1906" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/5f9967d9-b8f1-48ab-b0fa-60beb9b5430f">

Now, you have to go to the `Settings` section (the cog icon at the bottom of the page) and you'll see your organization settings. Go to `Team and Access > API Keys` and copy your Application ID and your Admin API Key. We need writing access to the index as we'll be syncing data from Contentful to it.

Now, in your Contentful space, go to `Settings > Webhooks`. For the sake of simplicity, we'll use the Algolia webhook template that already exists, but you could also create an endpoint with your own needed business logic and use its url as the webhook's url.
You'll see a section called `Webhook templates` at the right sidebar. Click on the Algolia one (or in the "See all templates" button if you don't see it and search for it) and input the three required fields: your Algolia **Application ID**, the name of your index and the **Admin API Key**. This key will allows us to perform write actions over the index. By the other hand, the **Search-Only API Key** is intended to be used in a frontend application to fetch the data from the index, we'll use it later in our React App.

This will create two webhooks. One for the entries indexing and the second one for deleting unpublished entries. Both will be configured with the following:

1. Url: https://{app-id}.algolia.net/1/indexes/{index-name}/{ /payload/sys/id }
2. Events:
   a. The "index entry webhook" will only trigger with Publish Entry events.
   b. The "delete unpublished entry" webhook will only trigger with Unpublish Entry events.
3. Filters: will trigger only with entries in the 'master' environment
4. Headers:
   a. X-Algolia-Application-Id: Your application ID
   b. X-Algolia-API-Key: Your API Key
5. Use default Contentful payload

The Index Entries webhook will look like this:

<img width="1590" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/5522f3ed-bb27-487d-b409-80a49501afd6">

I'll add another filter rule to both webhooks which will make the indexing and deletion to only happen with the `post` content type. We normally don't want all of our entries to be indexed, just the ones we want to show in a listing-like page. We also don't want to trigger the deletion webhook whenever entries from another content type are unpublished.

<img width="1552" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/b3df6333-6622-4365-a341-f27c948526cd">

Now let's create our `Post` content type and index an entry!

## Post Content Type and Indexing entries

We'll keep it simple and will not include reference entry fields, but in a normal scenario, you will likely use them in your model!

Our content type will have the following fields, being the `Title`, `Publish Date`, and `Authors` the minimal required information in order for the Post to be shown in our listing page:

<img width="1030" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/be48557d-3853-4365-bb42-47d8aca230a4">

Now, whenever you publish a `post` entry, its data will be synced into the Algolia index! Let's take, for example, the following sample entry:

<img width="1853" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/03a5c3d2-612b-40f8-a477-1115c5984c75">

As soon as we fill in all the fields and hit the publish button, our entry will be synced into Algolia and we'll be able to see the data in our index!

<img width="1560" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/0f0d059c-f2ce-4817-9e8d-539ea1799331">

## Building the React application

First, generate a React project called react-contentful-algolia using the React template for Vite via the command-line interface.

`npm create vite@latest react-algolia -- --template react`

Next, execute the two commands below:

```bash
cd react-algolia
npm install algoliasearch
```

This leaves you in the react-algolia project and installs the needed dependencies to build the project.

Finally, create a file called `.env` within the project directory. We'll use this file to store our Algolia credentials. Make sure you replace `<YOUR_APP_ID>`, `<YOUR_API_KEY>`, and `<YOUR_INDEX>` with the respective values from Algolia.

‼️ This time you need to use the **Search-Only API Key**, as we only need to read data from the index and don't want to expose a key with write-access such as the Admin API Key.

```bash
# .env
VITE_ALGOLIA_APP_ID=<YOUR_APP_ID>
VITE_ALGOLIA_API_KEY=<YOUR_API_KEY>
VITE_ALGOLIA_INDEX=<YOUR_INDEX>
```

Now we'll be able to use these credentials to fetch data from Algolia.

The `VITE_` prefix is required in your environment variables because these values are public and visible on the client.

## Setting up the Algolia Client

Create a `algolia-client.js` file within the `src` directory. This file will be in charge of having our Algolia client, the index, and some functions that will allow us to get the data from the index.

Add the following code into your file:

```js
import algoliasearch from 'algoliasearch'

const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID
const ALGOLIA_API_TOKEN = import.meta.env.VITE_ALGOLIA_API_TOKEN
const ALGOLIA_INDEX = import.meta.env.VITE_ALGOLIA_INDEX

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_TOKEN)
const index = client.initIndex(ALGOLIA_INDEX)

export const getPostsData = async (query = '') => {
  try {
    const data = await index.search(query)
    return {
      posts: data.hits
    }
  } catch (error) {
    return undefined
  }
}
```

With this we're retrieving our credentials, creating an algolia client and initializing the index, which will allow us to perform queries against it. The `getPostsData` function will help us to retrieve our posts based on a string query.

## Fetching data from the index and showing it in the client

Now we can start pulling some data and showing it in our React application.

We'll create a Post component which will receive the post's data from our index and will display it as a card. Create a `Post.jsx` file in the `src` folder with the following code:

```jsx
export const Post = ({ post }) => {
  const publishDate = new Date(post.fields.publishDate['en-US'])
  const displayDate = publishDate.toLocaleString('en-US', { month: 'long', year: 'numeric', day: '2-digit' })

  return (
    <a className="post-card-link-wrapper" href={post.fields.slug['en-US']}>
      <div className="post-card">
        <span className="post-card-category">{post.fields.category['en-US'].toUpperCase()}</span>
        <span className="post-card-title">{post.fields.title['en-US']}</span>
        <span className="post-card-footnote">
          {displayDate} <span className="">|</span> {post.fields.authors['en-US'].join(', ')}
        </span>
      </div>
    </a>
  )
}
```

Also replace the boilerplate code in `./src/App.jsx` with the following:

```jsx
import './App.css'
import { getPostsData } from './algolia-client'
import { Post } from './Post'
import { useState, useEffect } from 'react'

function App() {
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState()
  useEffect(() => {
    const handler = async () => {
      setLoading(true)
      const data = await getPostsData('')
      if (data) setPosts(data.posts)
      setLoading(false)
    }
    handler()
  }, [])

  return (
    <main>
      <h1 className="page-title">POSTS</h1>
      <section className="posts">
        {!posts?.length && <p className="state-message">{loading ? 'Fetching posts...' : 'No results!'}</p>}
        {!!posts?.length && posts.map((post) => <Post post={post} key={post.objectID} />)}
      </section>
    </main>
  )
}

export default App
```

Here we're fetching the data from our index using a simple `useEffect` and storing it into the `posts` variable, then we map all the results (i.e. hits) and render Post components.

Finally, delete the `index.css` file as we will not need it anymore and replace the default code in the `App.css` file with these styles:

```css
* {
  margin: 0;
  padding: 0;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

:root {
  line-height: 1.5;
  font-weight: 400;

  background-color: rgb(242, 248, 251);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.page-title {
  background-image: linear-gradient(
    -180deg,
    transparent 0%,
    transparent 64%,
    rgb(255, 216, 95) 64%,
    rgb(255, 216, 95) 87%,
    transparent 87%,
    transparent 100%
  );
  font-size: 2em;
  color: rgb(42, 48, 57);
  line-height: 1.1;
  margin-bottom: 2rem;
  display: inline-block;
  letter-spacing: 0.1115em;
  font-weight: 800;
}

main {
  margin: 0 auto;
  max-width: 1280px;
  padding: 2rem;
}

.posts {
  display: grid;
  row-gap: 30px;
}

.post-card-link-wrapper {
  text-decoration: none;
  transition: all 0.25s ease-in-out;
  display: block;
}

.post-card-link-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 15px 5px;
}

.post-card {
  background-color: white;
  padding: 2rem;
  border-radius: 5px;
}

.post-card-category {
  display: block;
  color: rgb(11, 106, 230);
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1.5;
  letter-spacing: 0.12em;
  margin-bottom: 10px;
}

.post-card-title {
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.008em;
  margin: 0px;
  padding: 0px;
  color: rgb(42, 48, 57);
  display: block;
  font-size: 20px;
  padding-bottom: 20px;
}

.post-card-footnote {
  line-height: 1.6;
  font-weight: 400;
  color: rgb(42, 48, 57);
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  height: auto;
  max-height: 1.6em;
  overflow: hidden;
  text-overflow: ellipsis;
}
.post-card-footnote span {
  color: rgb(219, 227, 231);
  font-weight: 400;
  line-height: 1.6;
}

.state-message {
  color: rgb(42, 48, 57);
  font-weight: 600;
}
```

Now if you run the dev server with `npm run dev` and go to `http://localhost:5173`, you will see your post entries listed!

<img width="1340" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/bbb0bcf0-83da-4c46-b11d-f563ed8fd84d">

## Sending queries to the index and refining our results

Now that we're able to fetch our posts, a really nice feature that Algolia provides us is performing search against our index blazingly fast! In order to get the most from our searches, we need to add some configurations into our index.

Go to your Algolia dashboard and then to your index settings in the `Configuration` tab. Then click on `Searchable attributes` and add `fields.title.en-US` and `fields.category.en-US`. With this we're telling Algolia to only search for matches within these 2 fields, improving the performance of the search. Don't forget to click on `Review and Save Settings` to save these changes!

<img width="1607" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/9d624fd9-fa17-43f1-840f-c37e919de182">

<img width="1607" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/9d624fd9-fa17-43f1-840f-c37e919de182">

Now let's modify our `App` component, let's add a search input and some states:

```jsx
function App() {
  const [searchValue, setSearchValue] = useState('')
  const onSearchChange = (e) => {
    setSearchValue(e.target.value)
  }

  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState()
  useEffect(() => {
    const handler = async () => {
      setLoading(true)
      const data = await getPostsData(searchValue)
      if (data) setPosts(data.posts)
      setLoading(false)
    }
    handler()
  }, [searchValue])

  return (
    <main>
      <h1 className="page-title">POSTS</h1>
      <input
        type="text"
        className="posts-search"
        placeholder="Type your search here"
        value={searchValue}
        onChange={onSearchChange}
      />
      <section className="posts">
        {!posts?.length && <p className="state-message">{loading ? 'Fetching posts...' : 'No results!'}</p>}
        {!!posts?.length && posts.map((post) => <Post post={post} key={post.objectID} />)}
      </section>
    </main>
  )
}
```

Also add the styles for our input in the `App.css` file:

```css
.posts-search {
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px;
  border-radius: 3px;
  outline: 0;
  display: block;
  border: 1px solid rgb(42, 48, 57, 0.2);
}
```

Now we can type some query and update our results! We can search for words within the title of our posts or for categories. If I type `Developers`, the posts will be filtered and those with that category will show up.

<img width="1377" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/2f940f22-1007-480e-bb87-1c6aa732384e">

## Filtering posts

Let's dive into another great Algolia feature: filtering. We first need to understand the concept of [facets](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/). They basically allow us to add categorization to our search results using some of the attributes our data has. For example, we can define the `category` field of our blog posts as a facet in order to refine our searches using the category value our entries have.

Let's modify our `getPostsData` function a little bit:

```js
export const getPostsData = async (query = '', facetFiltersMap = []) => {
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
      posts: data.hits,
      facets: sanitizedFacets,
    }
  } catch (error) {
    return undefined
  }
}
```

If we print the result of our `posts` variable, we'll get something like this:

<img width="540" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/cd1d2e5c-597c-406d-884c-f5ac443e4d72">

as you can see, we're receiving an empty `facets` object. In order to configure them, go to your index settings in the `Configuration` tab, search for `Facets` and click on the `+ Add an Attribute` button to add the `fields.category.en-US` attribute, and save the changes.

<img width="1612" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/2bafa7b8-87a3-40e8-96c8-5dfb70ab2cf4">

Now if we print the value of `posts.facets` again, we'll see the `fields.category.en-US` key with the respective amount of records each category value has. In my case, I had three `Developers` blog posts, one `Partners` post, one `Product` post and one `Strategy` post.

```json
{
  "fields.category.en-US": {
    "Developers": 3,
    "Partners": 1,
    "Product": 1,
    "Strategy": 1
  }
}
```

Now that we know which categories we have and the exact amount of records that match each category, we can create a filters sidebar to show them. Let's first create our `Facet` component in the `Facet.jsx` file inside the `src` folder:

```jsx
export const Facet = ({ facetKey, options, title, facetFiltersMap, onChange }) => {
  return (
    <div>
      <span className="facet-title">{title.toUpperCase()}</span>
      <div className="facet-options">
        {Object.entries(options).map(([facetOptionLabel, facetOptionQty], idx) => {
          const inputId = `input-${facetOptionLabel}-${idx}`
          return (
            <div className="facet-option" key={`${facetOptionLabel}-${idx}`}>
              <input
                id={inputId}
                type="checkbox"
                checked={facetFiltersMap.get(facetKey)?.includes(facetOptionLabel)}
                onChange={(e) => {
                  onChange(facetKey, e.target.value)
                }}
                value={facetOptionLabel}
              />
              <label htmlFor={inputId}>
                {facetOptionLabel} ({facetOptionQty})
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

Let's also add this line at the top of our `App.jsx` file: `import { Facet } from './Facet'`, then update the App component as follows:

```jsx
function App() {
  const [searchValue, setSearchValue] = useState('')
  const onSearchChange = (e) => {
    setSearchValue(e.target.value)
  }

  const [facetFiltersMap, setFacetFiltersMap] = useState(new Map())

  const onFacetChange = (facetKey, value) => {
    const existingFacetFilter = facetFiltersMap.get(facetKey)
    const newMap = new Map(facetFiltersMap)
    if (!existingFacetFilter) {
      newMap.set(facetKey, [value])
    } else {
      const existingValueIdx = existingFacetFilter.findIndex((facet) => facet === value)
      if (existingValueIdx === -1) {
        newMap.set(facetKey, [...existingFacetFilter, value])
      } else {
        const newFacetFiltersMapValue = structuredClone(existingFacetFilter)
        newFacetFiltersMapValue.splice(existingValueIdx, 1)
        newMap.set(facetKey, newFacetFiltersMapValue)
      }
    }

    if (!newMap.get(facetKey).length) newMap.delete(facetKey)

    setFacetFiltersMap(newMap)
  }

  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState()
  const [facets, setFacets] = useState()

  useEffect(() => {
    const handler = async () => {
      setLoading(true)
      const data = await getPostsData(searchValue, facetFiltersMap)
      if (data) {
        setPosts(data.posts)
        setFacets(data.facets)
      }
      setLoading(false)
    }
    handler()
  }, [searchValue, facetFiltersMap])

  return (
    <main>
      <h1 className="page-title">POSTS</h1>
      <input
        type="text"
        className="posts-search"
        placeholder="Type your search here"
        value={searchValue}
        onChange={onSearchChange}
      />

      <div className="post-cards-grid">
        <section className="filters">
          <span className="filters-title">FILTERS</span>
          {!facets?.length && (
            <p className="state-message">{loading ? 'Fetching filters...' : 'No filters!'}</p>
          )}
          {facets && (
            <ul className="facets">
              {facets.map(({ key, options, title }) => {
                return (
                  <li key={key}>
                    <Facet
                      facetFiltersMap={facetFiltersMap}
                      facetKey={key}
                      options={options}
                      title={title}
                      onChange={onFacetChange}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </section>
        <section className="posts">
          {!posts?.length && <p className="state-message">{loading ? 'Fetching posts...' : 'No results!'}</p>}
          {!!posts?.length && posts.map((post) => <Post post={post} key={post.objectID} />)}
        </section>
      </div>
    </main>
  )
}
```

Now we're using the `posts.facets` object to render our filter list. The `facetFilters` and `facetFiltersMap` variables help us to store the information of which facets have been already selected.

Last but not least, let's add this CSS to our `App.css` file:

```css
.post-cards-grid {
  display: grid;
  gap: 20px;
  row-gap: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .post-cards-grid {
    grid-template-columns: 1.1fr 3fr;
  }
}

.filters {
  padding: 2rem;
  background-color: white;
}

.filters-title {
  font-size: 1.5em;
  color: rgb(42, 48, 57);
  line-height: 1.1;
  margin-bottom: 2rem;
  display: inline-block;
  letter-spacing: 0.1115em;
  font-weight: 800;
}

.facets {
  list-style: none;
}

.facet-title {
  display: block;
  font-size: 0.9rem;
  color: rgb(42, 48, 57);
  line-height: 1.1;
  display: inline-block;
  letter-spacing: 0.1115em;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.facet-options {
  display: grid;
  row-gap: 0.5rem;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.facet-option {
  display: flex;
  gap: 8px;
}
.facet-option label,
.facet-option input {
  cursor: pointer;
}
```

Here's the final result! We're now able to filter our results based on the Category field and also type a text query to search for matches in both the Title and Category fields.

<img width="1256" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/bc38a1b1-3e5f-4671-9c31-f7c62554e09b">

## Wrapping Up

And that is all! We've just created a Contentful-Algolia integration which keeps our index updated with data being served from Contentful, and we're able to fetch and filter the data incredibly fast using the Algolia API.

You can continue playing with this project adding more facets or syncing more fields from Contentful, the search UI can be extended to fit a lot of your needs.

You could also create your own webhook instead of using the Template that Contentful provides and apply some business logic to the data you want to store, you might also want to flat the entry to only save the fields.

While this tutorial focuses on some basic Algolia features, it provides a lot more! such as sorting, search recommendations, ranking, pagination and of course, AI search! I encourage you to continue learning and get the most from the Algolia engine to achieve the desired user experience.

Happy coding everyone!
