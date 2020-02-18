"use strict";
const Router = require("@arangodb/foxx/router");
const joi = require("joi");

const routes = Router();
module.exports = routes;

routes
  .post("/sum", (req, res) => {
    const numbers = req.body;
    res.json({ sum: numbers.reduce((a, b) => a + b) });
  })
  .body(joi.array().items(joi.number().integer()));
