```sh
docker run --rm --name foxx-training -e ARANGO_NO_AUTH=1 -p 8529:8529 arangodb:3.6
```

```js
"use strict";
const { context } = require("@arangodb/locals");
const Router = require("@arangodb/foxx/router");

const routes = Router();
context.use(routes);

routes.get("/", (req, res) => {
  res.json({ greeting: "Hello World!" });
});
```

```sh
echo '{"main":"index.js"}' > manifest.json
echo '{"compilerOptions":{"allowJs":true}}' > tsconfig.json
echo '{"private":true}' > package.json
echo 'node_modules/**' > .foxxignore
npm install -D @types/arangodb @types/joi
```

```js
const joi = require("joi");

routes.get("/:name",(req,res)=>{const{name}=req.pathParams;res.json({greeting:`Hello ${name}`});}).pathParam("name",joi.string());

.response(joi.object().keys({greeting:joi.string()}))
.description("Returns a specific greeting.")
.description("Returns a generic greeting.")
```

# request

```js
"use strict";
const { context } = require("@arangodb/locals");
const Router = require("@arangodb/foxx/router");
const request = require("@arangodb/request");

const routes = Router();
context.use(routes);

routes.get("/pikachu", (req, res) => {
  const response = request.get("https://pokeapi.co/api/v2/pokemon/25/");
  if (response.status >= 400) {
    res.throw("service unavailable");
  }
  const pikachu = response.json;
  res.type("text/html");
  res.write(`<!doctype html><html><body>`);
  res.write(`<h1>Pikachu!</h1>`);
  res.write(`<img src="${pikachu.sprites.front_default}" />`);
  res.write(`</body></html>`);
});
```
