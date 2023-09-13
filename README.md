# nextjs-server-native-coverage

A sample repo trying to use native code coverage tools in a server Next.js application

## Scenarios

### Getting code coverage (defaults)

The report below does not include anything under "pages", even when that code is server rendered (Node.js server code):

```bash
npx next build
npx c8 npx ava

-----------|---------|----------|---------|---------|-------------------
File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------|---------|----------|---------|---------|-------------------
All files  |   91.11 |       75 |     100 |   91.11 |                   
 server.js |   91.11 |       75 |     100 |   91.11 | 31-34             
-----------|---------|----------|---------|---------|-------------------
```

### Getting code coverage including "all" files

The report below includes code coverage information for some server rendered code. Still not ideal because Next.js optimizes that code before running it, so a lot of "bundled" code show ups in the report:

```bash
npx next build
npx c8 --all npx ava

------------------------------------------------------------------|---------|----------|---------|---------|-------------------
File                                                              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------------------------------------------------|---------|----------|---------|---------|-------------------
All files                                                         |   10.25 |    13.63 |    5.26 |   10.25 |                   
 nextjs-server-native-coverage                                    |   91.11 |       75 |     100 |   91.11 |                   
  server.js                                                       |   91.11 |       75 |     100 |   91.11 | 31-34             
 nextjs-server-native-coverage/.next                              |       0 |        0 |       0 |       0 |                   
  prerender-manifest.js                                           |       0 |        0 |       0 |       0 | 1                 
 nextjs-server-native-coverage/.next/server                       |       0 |        0 |       0 |       0 |                   
  middleware-build-manifest.js                                    |       0 |        0 |       0 |       0 | 1                 
  middleware-react-loadable-manifest.js                           |       0 |        0 |       0 |       0 | 1                 
  next-font-manifest.js                                           |       0 |        0 |       0 |       0 | 1                 
  webpack-runtime.js                                              |       0 |        0 |       0 |       0 | 1-160             
 nextjs-server-native-coverage/.next/server/chunks                |       0 |        0 |       0 |       0 |                   
  893.js                                                          |       0 |        0 |       0 |       0 | 1-38              
 nextjs-server-native-coverage/.next/server/pages                 |       0 |        0 |       0 |       0 |                   
  _app.js                                                         |       0 |        0 |       0 |       0 | 1-32              
  _document.js                                                    |       0 |        0 |       0 |       0 | 1-67              
 nextjs-server-native-coverage/.next/static/S0rRNIC9lY94eCQ95_4eN |       0 |        0 |       0 |       0 |                   
  _buildManifest.js                                               |       0 |        0 |       0 |       0 | 1                 
  _ssgManifest.js                                                 |       0 |        0 |       0 |       0 | 1                 
 nextjs-server-native-coverage/.next/static/chunks                |       0 |        0 |       0 |       0 |                   
  framework-51f47f5f9f7f8e42.js                                   |       0 |        0 |       0 |       0 | 1-33              
  main-ce188c59ff6bd5c4.js                                        |       0 |        0 |       0 |       0 | 1                 
  polyfills-78c92fac7aa8fdd8.js                                   |       0 |        0 |       0 |       0 | 1                 
  webpack-4e7214a60fad8e88.js                                     |       0 |        0 |       0 |       0 | 1                 
 nextjs-server-native-coverage/.next/static/chunks/pages          |       0 |        0 |       0 |       0 |                   
  _app-aea6920bd27938ca.js                                        |       0 |        0 |       0 |       0 | 1                 
  _error-3986dd5834f581dc.js                                      |       0 |        0 |       0 |       0 | 1                 
  index-88a0031db584f3a2.js                                       |       0 |        0 |       0 |       0 | 1                 
 nextjs-server-native-coverage/pages                              |       0 |        0 |       0 |       0 |                   
  index.js                                                        |       0 |        0 |       0 |       0 | 1-13              
------------------------------------------------------------------|---------|----------|---------|---------|-------------------
```

### Getting code coverage including "all" files and generating sourcemaps for server code

A quick search indicates that Next.js does not support source maps for server bundles. Only client side sourcemaps are supported [by default](https://nextjs.org/docs/pages/api-reference/next-config-js/productionBrowserSourceMaps). Further inspection indicate  that one might be able to create a [build plugin](https://nextjs.org/docs/pages/api-reference/next-config-js/webpack) and use Webpack's [devtool](https://webpack.js.org/configuration/devtool/#root) option to force sourcemaps on server bundles.

That did not work, but some search hints at Webpack's [SourceMapDevToolPlugin](https://webpack.js.org/plugins/source-map-dev-tool-plugin) for advanced use cases. After playing around with some options, we can finally get the expected code coverage report:

```bash
npx next build
cp sample.next.config.js next.config.js
npx c8 --all npx ava

...
A lot of completely unrelated files show up
...
```

After digging a bit into [c8](https://www.npmjs.com/package/c8) options, one option seems useful:

```bash
npx next build
cp sample.next.config.js next.config.js
npx c8 --exclude-after-remap --exclude ".next" --all npx ava

...
A lot of completely unrelated files show up
...
```