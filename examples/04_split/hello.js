"use strict";
const Router = require("@arangodb/foxx/router");
const joi = require("joi");

const routes = Router();
module.exports = routes;

routes
  .get("/", (req, res) => {
    res.json({ greeting: "Hello World!" });
  })
  .response(joi.object().keys({ greeting: joi.string() }))
  .description("Returns a generic greeting.");

routes
  .get("/:name", (req, res) => {
    const { name } = req.pathParams;
    res.json({ greeting: `Hello ${name}` });
  })
  .pathParam("name", joi.string())
  .response(joi.object().keys({ greeting: joi.string() }))
  .description("Returns a specific greeting.");
