"use strict";
const { context } = require("@arangodb/locals");
const Router = require("@arangodb/foxx/router");
const { query } = require("@arangodb");

const Todos = context.collection("todos");

const routes = Router();
context.use(routes);

routes.get("/", (res, res) => {
  res.json(
    query`
      FOR todo IN ${Todos}
      RETURN todo._key
    `.toArray()
  );
});
