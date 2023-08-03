import './App.css'
import { getPostsData } from './algolia-client'
import { Post } from './Post'
import { Facet } from './Facet'
import { useState, useEffect } from 'react'

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

export default App
