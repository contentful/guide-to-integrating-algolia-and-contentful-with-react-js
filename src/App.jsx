import './App.css'
import { getPosts } from './algolia-client'
import { Post } from './Post'
import { useState } from 'react'
import { useEffect } from 'react'

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

  console.log(facetFilters)
  console.log(facetFiltersMap)

  const [posts, setPosts] = useState()
  useEffect(() => {
    const handler = async () => {
      const data = await getPosts(searchValue)
      if (data) setPosts(data)
      setPosts(data)
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

      <section className="post-cards-grid">
        <aside className="filters">
          <span className="filters-title">FILTERS</span>
          {posts?.facets && (
            <div className="filters-box">
              {Object.entries(posts.facets).map(([key, value]) => {
                return <Facet key={key} facetFieldKey={key} facetFieldOptions={value} onChange={onFacetChange} />
              })}
            </div>
          )}
        </aside>
        {posts?.hits && (
          <ul className="posts">
            {posts?.hits?.length ? (
              posts.hits.map((hit) => (
                <li key={hit.objectID}>
                  <Post post={hit} />
                </li>
              ))
            ) : (
              <p className="no-results">No results!</p>
            )}
          </ul>
        )}
      </section>
    </main>
  )
}
