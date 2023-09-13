# nextjs-server-native-coverage

A sample repo trying to use native code coverage tools in a server Next.js application

## Scenario

```bash
npm run build
npm t

-----------|---------|----------|---------|---------|-------------------
File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------|---------|----------|---------|---------|-------------------
All files  |    90.9 |       75 |     100 |    90.9 |                   
 server.js |    90.9 |       75 |     100 |    90.9 | 30-33             
-----------|---------|----------|---------|---------|-------------------
```

> The report above does not include anything under "pages", even when that code is server rendered (Node.js server code).