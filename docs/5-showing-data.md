# Fetching data from the index and showing it in the client

Now we can start pulling some data and showing it in our React application.

For the sake of simplicity, we'll use the SWR library to fetch the data and persist the state of it. It will also allow us to update it when applying filters to the index search.

Install the dependency running `npm install swr`. Then create a `Post.jsx` file in the `src` folder with the following code:

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
          {data?.hits.map((hit, index) => <li key={hit.sys.id}><Post post={hit}/></li>)}
        </ul>
      </section>
    </main>
  )
}

export default App
```

Finally, delete the `index.css` file as we will not need it anymore and replace the default code in the `App.css` file with these styles:

```css
* {
  margin: 0;
  padding: 0;
}

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  background-color: rgb(242, 248, 251);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

ul {
  list-style: none;
}

.page-title {
  font-size: 2em;
  color: rgb(42, 48, 57);
  line-height: 1.1;
  margin-bottom: 2rem;
  letter-spacing: 0.1115em;
  font-weight: 800;
}

main {
  margin: 0 auto;
  max-width: 1280px;
  padding: 2rem;
}

.post-cards-grid {
  display: grid;
  column-gap: 20px;
  row-gap: 20px;
  grid-template-columns: 1fr;
}

.filters {}

.posts {
  display: grid;
  row-gap: 30px;
}

@media (min-width: 1024px) {
  .post-cards-grid {
    grid-template-columns: 25% 75%;
  }
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
```

Now if you run the dev server with `npm run dev` and go to `http://localhost:5173`, you will see your post entries listed!

@TODO: add image
