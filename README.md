# Single-SPA Microfrontend Project

This project is a containerized microfrontend architecture using [Single-SPA](https://single-spa.js.org/). The setup includes three main parts:
1. **Container**: The main application that loads and manages microfrontends dynamically. Represents the MSD-Dashboard section where the player frontends are displayed
2. **React-MicroFrontend**: A microfrontend that will be loaded into the container. Represents a Player Frontend
3. **React-MicroFrontend2**: Another microfrontend that will be loaded into the container. Represents a Player Frontend

## Table of Contents
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Dynamic Integration of Microfrontends](#dynamic-integration-of-microfrontends)
- [Common Issues](#common-issues)

## Setup

To set up the project, follow these steps:

1. Clone the repository and navigate into each of the following directories:
   - `Container`
   - `React-MicroFrontend`
   - `React-MicroFrontend2`

2. Run `npm install` in each directory to install the required dependencies.

## Running the Project

To start the project, follow this sequence:

1. Start the **Container**:
```bash
cd Container
npm start
```

2. Start React-MicroFrontend:
```bash
cd React-MicroFrontend
npm start
```
3. Start React-MicroFrontend2:
```bash
cd React-MicroFrontend2
npm start
```

Each microfrontend must be running on its specific port (by default: Container on port 9000, React-MicroFrontend on port 8080, and React-MicroFrontend2 on port 8081). These can be adjusted in the respective `webpack.config.js` files.

## Dynamic Integration of Microfrontends

The container dynamically fetches the player microfrontends and loads them. Here's an example of how the microfrontends are integrated dynamically:


```js
<script>
  const fetchedPlayerFrontends = [
    {
      name: '@MEA/React-MicroFrontend',
      url: '//localhost:8080/MEA-React-MicroFrontend.js',
    },
    {
      name: '@MEA/React-MicroFrontend2',
      url: '//localhost:8081/MEA-React-MicroFrontend2.js',
    },
  ];

  const microfrontends = [
    {
      name: '@MEA/root-config',
      url: '//localhost:9000/MEA-root-config.js',
    },
    ...fetchedPlayerFrontends,
  ];

  const importMap = {
    imports: {},
  };

  microfrontends.forEach(({ name, url }) => {
    importMap.imports[name] = url;
  });

  const script = document.createElement('script');
  script.type = 'systemjs-importmap';
  script.textContent = JSON.stringify(importMap);
  document.head.appendChild(script);
</script>

```

In the Container's [index.ejs](Container/src/index.ejs)
 index.ejs, the applications are loaded dynamically using the following:

```js
import { registerApplication, start } from 'single-spa';
import { constructApplications, constructRoutes, constructLayoutEngine } from 'single-spa-layout';

const fetchedMicrofrontends = [
  {
    name: '@MEA/React-MicroFrontend',
    url: '//localhost:8080/MEA-React-MicroFrontend.js',
  },
  {
    name: '@MEA/React-MicroFrontend2',
    url: '//localhost:8081/MEA-React-MicroFrontend2.js',
  },
];

const layoutHTML = `
  <single-spa-router>
    <main>
      <route default>
        <h1>Hello from Container</h1>
        ${fetchedMicrofrontends.map((mf) => `<application name="${mf.name}"></application>`).join('\n')}
      </route>
    </main>
  </single-spa-router>
`;

const parser = new DOMParser();
const layoutDocument = parser.parseFromString(layoutHTML, 'text/html');
const routes = constructRoutes(layoutDocument.querySelector('single-spa-router'));

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();
```


## Ports Configuration

By default, each microfrontend is set to run on a specific port. You can adjust these ports in the `webpack.config.js` of each project. For example:

```js
module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "MEA",
    projectName: "React-MicroFrontend",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    devServer: {
      port: 8080, // Change the port here if needed
    },
  });
};
```

If you change the port, make sure to update the fetchedPlayerFrontends list accordingly.

## Common Issues

1. Port Conflicts: Ensure that the ports for each microfrontend do not conflict with other running services. You can change the ports in the webpack.config.js for each project.
2. SystemJS Import Errors: If a microfrontend is not being loaded, check the importMap configuration to ensure the URLs are correct.
