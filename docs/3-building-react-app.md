# Building the React application

First, generate a React project called react-contentful-algolia using the React template for Vite via the command-line interface.

`npm create vite@latest react-contentful-algolia -- --template react`

Next, execute the two commands below:

```bash
cd react-contentful-algolia
npm install contentful
```

This leaves you in the react-contentful-algolia project and installs the needed dependencies to build the project.

Finally, create a file called `.env` within the project directory. We'll use this file to store our Contentful credentials: the [Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/) token and your space ID. Make sure you replace `<YOUR_CDA_TOKEN>` and `<YOUR_SPACE_ID>` with the respective values from Contentful. [Full instructions to obtain them can be found here.](https://www.contentful.com/developers/docs/references/authentication/#api-keys-in-the-contentful-web-app).

```bash
# .env
VITE_CONTENTFUL_CDA_TOKEN=<YOUR_CDA_TOKEN>
VITE_CONTENTFUL_SPACE_ID=<YOUR_SPACE_ID>
```

Now we'll be able to use these credentials to fetch data from Contentful.

Make sure you add the `VITE_` prefix to your environment variables in order for Vite to have them available in the browser.
