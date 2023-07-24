import './App.css'
import { getPosts } from './algolia-client'
import useSWR from 'swr'
import { Post } from './Post'

function App() {
  const { data } = useSWR('posts', getPosts)

  return (
    <main>
      <h1 className="page-title">POSTS</h1>
      <section className="post-cards-grid">
        <aside className="filters">Here we'll have filters!</aside>
        <ul className="posts">
          {data?.hits.map((hit, index) => <li key={index}><Post post={hit}/></li>)}
        </ul>
      </section>
    </main>
  )
}

export default App
