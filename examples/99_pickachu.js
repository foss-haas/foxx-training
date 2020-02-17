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
