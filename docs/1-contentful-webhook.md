# Setup Contentful webhook connected with Algolia

First of all, we'll need to know our Algolia credentials and having created a search index.

In your Algolia dashboard, create an application. Then, create an index. You can call it whatever you like. For the purpose of this tutorial, we'll be creating an index of blog posts.

<img width="1906" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/5f9967d9-b8f1-48ab-b0fa-60beb9b5430f">

Now, you have to go to the `Settings` section (the cog icon at the bottom of the page) and you'll see your organization settings. Go to `Team and Access > API Keys` and copy your Application ID and your Admin API Key. We need writing access to the index as we'll be syncing data from Contentful to it.

Now, in your Contentful space, go to `Settings > Webhooks`. For the sake of simplicity, we'll use the Algolia webhook template that already exists, but you could also create an endpoint with your own needed business logic and use its url as the webhook's url.
You'll see a section called `Webhook templates` at the right sidebar. Click on the Algolia one (or in the "See all templates" button if you don't see it and search for it) and input the three required fields: your Algolia Application ID, the name of your index and the Admin API Key.

The webhook will be configured with the following:

1. Url (PUT endpoint): https://{app-id}.algolia.net/1/indexes/{index-name}/{ /payload/sys/id }
2. Triggers with Publish Entry event
3. Filters: will trigger only with entries in the 'master' environment
4. Headers:
   a. X-Algolia-Application-Id: Your application ID
   b. X-Algolia-API-Key: Your API Key
5. Use default Contentful payload

<img width="1572" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/63208f2d-877d-4137-b289-bf138dbdf9a3">


I'll add another filter rule which will make the indexing to only happen with the `post` content type. We normally don't want all of our entries to be indexes, just the ones we want to show in a listing-like page.

<img width="1552" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/b3df6333-6622-4365-a341-f27c948526cd">

Now let's create our `Post` content type and index an entry!
