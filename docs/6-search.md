# Sending queries to the index

Now that we're able to fetch our posts, a really nice feature that Algolia provides us is performing search against our index blazingly fast! In order to get the most from our searches, we need to add some configurations into our index.

Go to your Algolia dashboard and then to your index settings in the `Configuration` tab. Then click on `Searchable attributes` and add `fields.title.en-US` and `fields.category.en-US`. With this we're telling Algolia to only search for matches within these 2 fields, improving the performance of the search. Don't forget to click on `Review and Save Settings` to save these changes!

@TODO: add image

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
      const data = await getPosts(searchValue)
      if (data) setPosts(data)
      setPosts(data)
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
        {!posts?.hits?.length && <p className="state-message">{loading ? 'Fetching posts...' : 'No results!'}</p>}
        {!!posts?.hits?.length && posts.hits.map((hit) => <Post post={hit} key={hit.objectID} />)}
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
