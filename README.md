[![Netlify Status](https://api.netlify.com/api/v1/badges/300b052e-e553-4261-8774-40d5b1390584/deploy-status)](https://app.netlify.com/sites/jonniebigodes-storybook-svelte/deploys)

*Psst — looking for a shareable component template? Go here --> [sveltejs/component-template](https://github.com/sveltejs/component-template)*

---

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd taskbox
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Storybook 

### Run Storybook

To view the storybook locally run the following command:

```bash
npm run storybook
```

### Exporting Storybook as a static app 

Just run the following command:
```bash
npm run build-storybook
```


## Run the test suite

Run the following command:
```bash
npm run test
```

If you want to run the tests without cache just run the following command:
```bash
npm run jest-without-cache
```

