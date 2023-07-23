# Post Content Type and Indexing entries

We'll keep it simple and will not include reference fields, but in a normal scenario, you will likely use them in your model!

Our content type will have the following fields, being the `Title`, `Publish Date`, and `Authors` the minimal required information in order for the Post to be shown in a listing page:

<img width="1040" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/abfff62c-33b4-4188-9fee-af6d910accc1">

Now, whenever you publish a `post` entry, its data will be synced into the Algolia index! Let's take, for example, the following entry:

<img width="1853" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/03a5c3d2-612b-40f8-a477-1115c5984c75">

As soon as we fill in all the fields and hit the publish button, our entry will be synced into Algolia and we'll be able to see the data in our index!

<img width="1591" alt="image" src="https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js/assets/38511917/1fdb9816-73a7-4787-b0d5-181bdd777cc1">
