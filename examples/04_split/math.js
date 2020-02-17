"use strict";
const Router = require("@arangodb/foxx/router");
const joi = require("joi");

const routes = Router();
module.exports = routes;

routes
  .post("/add", (req, res) => {
    const { a, b } = req.body;
    res.json({
      result: a + b
    });
  })
  .body(joi.object().keys({ a: joi.number(), b: joi.number() }))
  .response(joi.object().keys({ result: joi.number() }));

routes
  .post("/sum", (req, res) => {
    const numbers = req.body;
    res.json({
      result: numbers.reduce((a, b) => a + b)
    });
  })
  .body(joi.array().items(joi.number()))
  .response(joi.object().keys({ result: joi.number() }));
