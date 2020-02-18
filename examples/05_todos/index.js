"use strict";
const { context } = require("@arangodb/locals");
const Router = require("@arangodb/foxx/router");
const { errors, query } = require("@arangodb");
const joi = require("joi");

const Todos = context.collection("todos");

const routes = Router();
context.use(routes);

routes
  .get("/", (req, res) => {
    res.json(
      query`
        FOR todo IN ${Todos}
        SORT todo.created ASC
        RETURN { key: todo._key, label: todo.label }
      `
        .toArray()
        .map(({ key, label }) => ({ key, label, url: req.makeAbsolute(key) }))
    );
  })
  .response(joi.array().items(joi.string()), "List of todo items")
  .description("List todo items");

routes
  .post("/", (req, res) => {
    const { label, done } = req.body;
    const created = Date.now();
    const { _key } = Todos.save({ created, label, done });
    res.status(201);
    res.json({ _key, created, label, done });
  })
  .body(
    joi.object().keys({
      label: joi.string(),
      done: joi.boolean().default(false)
    })
  )
  .response(
    201,
    joi.object().keys({
      _key: joi.string(),
      created: joi.number().integer(),
      label: joi.string(),
      done: joi.boolean()
    }),
    "The created todo item"
  )
  .description("Create a new todo item");

routes
  .patch("/:key", (req, res) => {
    const { key } = req.pathParams;
    const patchData = req.body;
    const { created, label, done } = Todos.update(key, patchData, {
      returnNew: true
    }).new;
    res.json({ _key: key, created, label, done });
  })
  .pathParam("key", joi.string())
  .body(
    joi
      .object()
      .keys({
        label: joi.string().optional(),
        done: joi.boolean().optional()
      })
      .or("label", "done")
  )
  .response(
    joi.object().keys({
      _key: joi.string(),
      created: joi.number().integer(),
      label: joi.string(),
      done: joi.boolean()
    }),
    "The updated todo item"
  )
  .description("Update a todo item");

routes
  .delete("/:key", (req, res) => {
    const { key } = req.pathParams;
    try {
      Todos.remove(key);
      res.status(204);
    } catch (e) {
      if (e.errorNum !== errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code) {
        res.throw(e);
      }
      res.throw(404, "Todo item does not exist");
    }
  })
  .pathParam("key", joi.string())
  .response(204, "Todo item was deleted")
  .error(404, "Todo item does not exist")
  .description("Delete a todo item");

routes
  .get("/:key", (req, res) => {
    try {
      const { key } = req.pathParams;
      const { _key, created, label, done } = Todos.document(key);
      res.json({ _key, created, label, done });
    } catch (e) {
      if (e.errorNum !== errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code) {
        res.throw(e);
      }
      res.throw(404, "Todo item does not exist");
    }
  })
  .pathParam("key", joi.string())
  .error(404, "Todo item does not exist")
  .description("Get a todo item");
