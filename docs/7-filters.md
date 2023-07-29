# Filtering and sorting posts

Let's dive into another great Algolia feature: filtering. We first need to domain the concept of [facets](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/). They basically allow us to add categorization to our search results using some of the attributes our data has. For example, we can define the `category` field of our blog posts as a facet in order to refine our searches using the category value our entries have.

Let's modify our `getPosts` function a little bit:

```js
export const getPosts = async (query = '', facetFilters) => {
  try {
    const data = await index.search(query, { facetFilters, facets: ['*'] })
    return data
  } catch (error) {
    return undefined
  }
}
```

If we print the result of our `data` variable, we'll get something like this:

@TODO: add object image

as you can see, we're receiving an empty `facets` object. In order to configure them, go to your index settings in the `Configuration` tab, search for `Facets` and click on the `+ Add an Attribute` button to add the `fields.category.en-US` attribute, and save the changes.

@TODO: add facets image

Now if we print the value of `data.facets` again, we'll see the `fields.category.en-US` key with the respective amount of records each category value has. In my case, I had three `Developers` blog posts, one `Partners` post, one `Product` post and one `Strategy` post.

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
export const Facet = ({ facetFieldKey, facetFiltersMap, facetFieldOptions, onChange }) => {
  const sanitizedFacetTitle = facetFieldKey.match(/(?<=fields.)[A-Za-z]+(?=.en-US)/)[0]

  return (
    <div>
      <span className="facet-title">{sanitizedFacetTitle.toUpperCase()}</span>
      <div className="facet-options">
        {Object.entries(facetFieldOptions).map(([facetLabel, facetQty], idx) => {
          const inputId = `input-${facetLabel}-${idx}`
          return (
            <div className="facet-option" key={`${facetLabel}-${idx}`}>
              <input
                id={inputId}
                type="checkbox"
                checked={facetFiltersMap.get(facetFieldKey)?.includes(facetLabel)}
                onChange={(e) => {
                  onChange(facetFieldKey, e.target.value)
                }}
                value={facetLabel}
              />
              <label htmlFor={inputId}>
                {facetLabel} ({facetQty})
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

  const [facetFilters, setFacetFilters] = useState([])
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

    const newFacetFilters = [...newMap]
      .map(([key, val]) => {
        if (val.length) return `${key}:${val.join(',')}`
        return ''
      })
      .filter(Boolean)
    setFacetFiltersMap(newMap)
    setFacetFilters(newFacetFilters)
  }

  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState()
  useEffect(() => {
    const handler = async () => {
      setLoading(true)
      const data = await getPosts(searchValue, facetFilters)
      if (data) setPosts(data)
      setPosts(data)
      setLoading(false)
    }
    handler()
  }, [searchValue, facetFilters])

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
          {posts?.facets && (
            <ul className="facets">
              {Object.entries(posts.facets).map(([key, value]) => {
                return (
                  <li key={key}>
                    <Facet
                      facetFiltersMap={facetFiltersMap}
                      facetFieldKey={key}
                      facetFieldOptions={value}
                      onChange={onFacetChange}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </section>
        <section className="posts">
          {!posts?.hits?.length && <p className="state-message">{loading ? 'Fetching posts...' : 'No results!'}</p>}
          {!!posts?.hits?.length && posts.hits.map((hit) => <Post post={hit} key={hit.objectID} />)}
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
```

And here's our final result!

@TODO: add image
