"use strict";
const { context } = require("@arangodb/locals");
const Router = require("@arangodb/foxx/router");

const routes = Router();
context.use(routes);

routes.get("/", (req, res) => {
  res.json({ greeting: "Hello World!" });
});
