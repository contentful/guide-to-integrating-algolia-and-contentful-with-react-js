# Introduction

Content is always changing, and it has to be delivered fastly. Content authors, developers, marketing teams, and everyone involved in the development of a product's content want to see it evolving, being dynamic and scalating quickly.

When you want to show the biggest amount of valuable resources and options to your users, such as sellable products of your brand new e-commerce site, or posts from your blog, you want them to show up as fast as possible, and with the richest user experience in mind, without having to compromise performance or implementation complexity.

[Algolia](https://www.algolia.com/) is a performant search engine that exposes an API to perform fast and relevant search and discovery of your data. Instead of having to make several queries to the content source, which can do the job at the expense of performance and query filtering complexity, Algolia solves this by indexing your data and giving you access to it with ease.

This tutorial will guide you through using Algolia to create search indexes and manage data-fetching logic in a React project and how to apply these techniques to data coming from Contentful. We'll be able to display the data in a catalog-like web view. All the code in this tutorial can be found in [this repository](https://github.com/IgnacioNMiranda/guide-to-integrating-algolia-and-contentful-with-react-js).

## Prerequisites

To follow along, you’ll need:

* A Contentful account. [Sign up](https://www.contentful.com/sign-up/) if you do not have one.

* Intermediate knowledge of JavaScript
* Intermediate knowledge of [Next.js](https://nextjs.org/).
* Node.js version 18 or above.
