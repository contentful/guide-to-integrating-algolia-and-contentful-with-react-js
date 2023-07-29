# Filtering and sorting posts

We first need to domain the [facets](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/) concept. They basically allow us to add categorization to our search results using some of the attributes our data has. For example, we can define the `category` field of our blog posts as a facet in order to refine our searches using the category value our entries have.

Let's modify our `getPosts` function a little bit:

```js
export const getPosts = (query = '', facetFilters) => {
  return index.search(query, { facetFilters, facets: ['*'] })
}
```

If we print the result of our `data` variable coming from the `useSWR` hook, we'll get something like this:

@TODO: add object image

as you can see, we're receiving an empty `facets` object, in order to configure them, go to your index settings in the `Configuration` tab, search for `Facets` and click on the `+ Add an Attribute` button to add the `fields.category.en-US` attribute, and click on the `Review and Save Settings` button in order to save the settings.

@TODO: add facets image

Now if we try to print the value of `data` again, you'll receive the `fields.category.en-US` key with the respective amount of records each category value has. In my case, I had three `Developers` blog posts, one `Partners` post, one `Product` post and one `Strategy` post.

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

Now that we know which categories we have and the exact amount of records that match each category, we can create a filters sidebar modifying the `App.jsx` file like so:

