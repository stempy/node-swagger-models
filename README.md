# node-swagger-models

Generate javascript models from a self-documenting Swagger API.

- backbone models
- plain json

## Install

    $ npm install node-swagger-models --save

## usage

node_swagger_models nsmconfig.json

nsmconfig.json
```
{
  "fileOutput": "./tmp",
  "api": "http://localhost:1802/api-docs/v1/swagger.json",
  "format": "backbone"
}
```

node_swagger_models

package.json
```
...
node-swagger-models : {
  "fileOutput": "./tmp",
  "api": "http://localhost:1802/api-docs/v1/swagger.json",
  "format": "backbone"
}
...
```