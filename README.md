# nextjs-server-native-coverage

This repository is used to explore the use of [native](https://nodejs.org/dist/latest-v18.x/docs/api/cli.html#node_v8_coveragedir) code coverage tools (e.g `c8`) in Next.js applications that make use of custom servers.

## Prerequisites

Make sure you are using Node.js 16 (or just use volta), and install all required dependencies:

```bash
npm ci
```

## Scenarios

### Getting code coverage (defaults)

Gets code coverage reports with `c8` defaults:

```bash
$ npx next build
$ npx c8 ava
```

Output:

```bash
--------------------------------------------------|---------|----------|---------|---------|------------------------------------------------------------------------
File                                              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                      
--------------------------------------------------|---------|----------|---------|---------|------------------------------------------------------------------------
All files                                         |   60.23 |    59.86 |   58.33 |   60.23 |                                                                        
 nextjs-server-native-coverage                    |   91.11 |       75 |     100 |   91.11 |                                                                        
  server.js                                       |   91.11 |       75 |     100 |   91.11 | 31-34                                                                  
 nextjs-server-native-coverage/.next/server       |   87.16 |       90 |   55.55 |   87.16 |                                                                        
  webpack-runtime.js                              |   87.16 |       90 |   55.55 |   87.16 | 57-60,68-69,92-98,128-133                                              
 nextjs-server-native-coverage/.next/server/pages |   56.26 |    54.68 |   58.13 |   56.26 |                                                                        
  _app.js                                         |    89.2 |    88.23 |   64.28 |    89.2 | 19-20,25-26,39-41,62-63,117-119,124-126                                
  _document.js                                    |   50.25 |    45.63 |   53.84 |   50.25 | ...1,994-995,998-999,1002-1003,1014-1019,1036-1057,1063-1066,1084-1086 
  home.js                                         |   95.08 |      100 |   85.71 |   95.08 | 46-48                                                                  
--------------------------------------------------|---------|----------|---------|---------|------------------------------------------------------------------------
```

This report includes server rendered code, but because Next.js bundles all code before execution, all locations point to "generated" code within the ".next" directory. This problem is usually solved with the use of sourcemaps, which Next.js seems to be omitting, as confirmed by an inspection of generated code (e.g .next/server/pages).


### Getting code coverage using "devtool" option

A quick search indicates that Next.js does not support source maps for server bundles. Only client side sourcemaps are supported [by default](https://nextjs.org/docs/pages/api-reference/next-config-js/productionBrowserSourceMaps). Further inspection indicates that one might be able to create a [build plugin](https://nextjs.org/docs/pages/api-reference/next-config-js/webpack) and use Webpack's [devtool](https://webpack.js.org/configuration/devtool/#root) option to generate sourcemaps on server bundles.

```bash
$ cp devtool.next.config.js next.config.js
$ npx next build
$ npx c8 ava

# generated report that for the most part did not work
```

> **Note:** This option did not work as intended because it generates both "inline" (sourcesContent) and "external" (sources) sources in sourcemaps. We won't explore the details, but c8 seems to misrepresent code coverage when both are present.


### Getting code coverage using source maps plugin

While using Webpack's `devtool` option did not work, some search hints at Webpack's [SourceMapDevToolPlugin](https://webpack.js.org/plugins/source-map-dev-tool-plugin) for advanced use cases. After playing around with some options, we could finally get a code coverage report:

```bash
$ cp sourcemaps.next.config.js next.config.js
$ npx next build
$ npx c8 ava
```

Output:

```bash
-------------------------------------------------------------------------------------------------------|---------|----------|---------|---------|-------------------
File                                                                                                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------------------------------------------------------------------------------------|---------|----------|---------|---------|-------------------
All files                                                                                              |   51.55 |    49.58 |   53.52 |   51.55 |                   
 nextjs-server-native-coverage                                                                         |   81.42 |    85.71 |   66.66 |   81.42 |                   
  next.config.js                                                                                       |     100 |      100 |     100 |     100 |                   
  server.js                                                                                            |   91.11 |       75 |     100 |   91.11 | 31-34             
  withDevTool.js                                                                                       |      55 |      100 |      50 |      55 | 7-15              
 nextjs-server-native-coverage/.next/server/nextjs-server-native-coverage/webpack                      |   97.14 |       75 |     100 |   97.14 |                   
  after-startup                                                                                        |     100 |      100 |     100 |     100 |                   
  before-startup                                                                                       |     100 |      100 |     100 |     100 |                   
  bootstrap                                                                                            |   96.87 |       75 |     100 |   96.87 | 24                
  startup                                                                                              |     100 |      100 |     100 |     100 |                   
 nextjs-server-native-coverage/.next/server/nextjs-server-native-coverage/webpack/runtime              |   64.93 |    85.71 |      50 |   64.93 |                   
  define%20property%20getters                                                                          |     100 |      100 |     100 |     100 |                   
  ensure%20chunk                                                                                       |   33.33 |      100 |       0 |   33.33 | 4-9               
  get%20javascript%20chunk%20filename                                                                  |      20 |      100 |       0 |      20 | 2-5               
  hasOwnProperty%20shorthand                                                                           |     100 |      100 |     100 |     100 |                   
  make%20namespace%20object                                                                            |     100 |      100 |     100 |     100 |                   
  require%20chunk%20loading                                                                            |   76.92 |    66.66 |      50 |   76.92 | 18,25-32          
  startup%20entrypoint                                                                                 |       0 |      100 |       0 |       0 | 1-8               
 nextjs-server-native-coverage/.next/server/pages/nextjs-server-native-coverage                        |     100 |      100 |     100 |     100 |                   
  external%20%22react%22                                                                               |     100 |      100 |     100 |     100 |                   
 ...er-native-coverage/.next/server/pages/nextjs-server-native-coverage/external%20%22next/dist/server |     100 |      100 |     100 |     100 |                   
  get-page-files.js%22                                                                                 |     100 |      100 |     100 |     100 |                   
  htmlescape.js%22                                                                                     |     100 |      100 |     100 |     100 |                   
  utils.js%22                                                                                          |     100 |      100 |     100 |     100 |                   
 ...ative-coverage/.next/server/pages/nextjs-server-native-coverage/external%20%22next/dist/shared/lib |     100 |      100 |     100 |     100 |                   
  constants.js%22                                                                                      |     100 |      100 |     100 |     100 |                   
  head-manager-context.js%22                                                                           |     100 |      100 |     100 |     100 |                   
  utils.js%22                                                                                          |     100 |      100 |     100 |     100 |                   
 nextjs-server-native-coverage/.next/server/pages/nextjs-server-native-coverage/external%20%22react    |     100 |      100 |     100 |     100 |                   
  jsx-runtime%22                                                                                       |     100 |      100 |     100 |     100 |                   
 ...s-server-native-coverage/.next/server/pages/nextjs-server-native-coverage/external%20%22styled-jsx |     100 |      100 |     100 |     100 |                   
  server%22                                                                                            |     100 |      100 |     100 |     100 |                   
 ...ver-native-coverage/.next/server/pages/nextjs-server-native-coverage/node_modules/next/dist/client |   15.59 |        0 |       0 |   15.59 |                   
  head-manager.js                                                                                      |   14.41 |      100 |       0 |   14.41 | 15-109            
  request-idle-callback.js                                                                             |   47.82 |        0 |       0 |   47.82 | 7-16,19-20        
  script.js                                                                                            |   12.43 |      100 |       0 |   12.43 | 11-69,80-189      
 ...rver-native-coverage/.next/server/pages/nextjs-server-native-coverage/node_modules/next/dist/pages |   60.45 |    44.32 |   67.44 |   60.45 |                   
  _app.js                                                                                              |   88.75 |    84.61 |      70 |   88.75 | ...15,25-27,43-44 
  _document.js                                                                                         |   56.55 |    38.09 |   66.66 |   56.55 | ...57-561,576-578 
 nextjs-server-native-coverage/.next/server/pages/nextjs-server-native-coverage/pages                  |     100 |      100 |     100 |     100 |                   
  home.js                                                                                              |     100 |      100 |     100 |     100 |                   
-------------------------------------------------------------------------------------------------------|---------|----------|---------|---------|-------------------
```

This report, while different, it contains a lot of noise, enabling source maps seem to have messed up with exclusions logic, as folders such as `node_modules` are now included. After digging a bit into [c8](https://www.npmjs.com/package/c8) options, `--exclude-after-remap` looks useful in our situation:

```bash
$ cp sourcemaps.next.config.js next.config.js
$ npx next build
$ npx c8 --exclude-after-remap ava
```

Output:

```bash
-------------------------------------|---------|----------|---------|---------|-------------------
File                                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------------------|---------|----------|---------|---------|-------------------
All files                            |      80 |    88.88 |      80 |      80 |                   
 nextjs-server-native-coverage       |      76 |    85.71 |   66.66 |      76 |                   
  next.config.js                     |     100 |      100 |     100 |     100 |                   
  server.js                          |   91.11 |       75 |     100 |   91.11 | 31-34             
  withSourceMaps.js                  |      44 |      100 |      50 |      44 | 7-20              
 nextjs-server-native-coverage/pages |     100 |      100 |     100 |     100 |                   
  home.js                            |     100 |      100 |     100 |     100 |                   
-------------------------------------|---------|----------|---------|---------|-------------------
```

We finally get a proper code coverage report with the correct attribution to the original source code.