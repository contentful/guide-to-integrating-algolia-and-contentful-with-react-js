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
      <input type="text" className="posts-search" placeholder="Type your search here" value={searchValue} onChange={onSearchChange} />
      <ul className="posts">
        {posts?.hits?.length ? posts.hits.map((hit) => (
          <li key={hit.objectID}>
            <Post post={hit} />
          </li>
        )) : <p className="no-results">No results!</p>}
      </ul>
    </main>
  )
}

export default App
