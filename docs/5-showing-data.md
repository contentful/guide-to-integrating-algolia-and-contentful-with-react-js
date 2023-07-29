# Fetching data from the index and showing it in the client

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
import { getPosts } from './algolia-client'
import { Post } from './Post'
import { useState } from 'react'
import { useEffect } from 'react'

function App() {
  const [posts, setPosts] = useState()
  useEffect(() => {
    const handler = async () => {
      const data = await getPosts('')
      if (data) setPosts(data)
      setPosts(data)
    }
    handler()
  }, [])

  return (
    <main>
      <h1 className="page-title">POSTS</h1>
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
```

Here we're fetching the data from our index using a simple `useEffect` and storing it into the `posts` variable, then we map all the results (i.e. hits) and render Post components.

Finally, delete the `index.css` file as we will not need it anymore and replace the default code in the `App.css` file with these styles:

```css
* {
  margin: 0;
  padding: 0;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
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
  background-image: linear-gradient(-180deg, transparent 0%, transparent 64%, rgb(255, 216, 95) 64%, rgb(255, 216, 95) 87%, transparent 87%, transparent 100%);
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
  list-style: none;
  row-gap: 30px;
}

.post-card-link-wrapper {
  text-decoration: none;
  transition: all 0.4s ease-in-out;
  display: block;
}

.post-card-link-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: rgba(0, 0, 0, 0.10) 0px 5px 15px 5px;
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

.no-results {
  color: rgb(42, 48, 57);
  font-weight: 600;
}
```

Now if you run the dev server with `npm run dev` and go to `http://localhost:5173`, you will see your post entries listed!

<img width="1340" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/bbb0bcf0-83da-4c46-b11d-f563ed8fd84d">

