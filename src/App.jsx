import './App.css'
import { getPosts } from './algolia-client'
import { Post } from './Post'
import { Facet } from './Facet'
import { useState, useEffect } from 'react'

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
          {!!posts?.hits?.length && (
            posts.hits.map((hit) => <Post post={hit} key={hit.objectID} />)
          )}
        </section>
      </div>
    </main>
  )
}

export default App
