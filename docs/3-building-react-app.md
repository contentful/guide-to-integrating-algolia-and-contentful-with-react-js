# Building the React application

First, generate a React project called react-contentful-algolia using the React template for Vite via the command-line interface.

`npm create vite@latest react-algolia -- --template react`

Next, execute the two commands below:

```bash
cd react-algolia
npm install algoliasearch
```

This leaves you in the react-algolia project and installs the needed dependencies to build the project.

Finally, create a file called `.env` within the project directory. We'll use this file to store our Algolia credentials. Make sure you replace `<YOUR_APP_ID>`, `<YOUR_API_KEY>`, and `<YOUR_INDEX>` with the respective values from Algolia.

‼️ This time you need to use the **Search-Only API Key**, as we only need to read data from the index and don't want to expose a key with write-access such as the Admin API Key.

```bash
# .env
VITE_ALGOLIA_APP_ID=<YOUR_APP_ID>
VITE_ALGOLIA_API_KEY=<YOUR_API_KEY>
VITE_ALGOLIA_INDEX=<YOUR_INDEX>
```

Now we'll be able to use these credentials to fetch data from Algolia.

Also make sure you add the `VITE_` prefix to your environment variables in order for Vite to have them available in the browser.
