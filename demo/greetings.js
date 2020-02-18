"use strict";
const Router = require("@arangodb/foxx/router");
const joi = require("joi");

const routes = Router();
module.exports = routes;

routes.use("/maths-again", require("./maths"));

routes.get("/", (req, res) => {
  res.json({ greeting: "Hello UK!" });
});

routes
  .get("/:name", (req, res) => {
    const { name } = req.pathParams;
    res.json({ greeting: `Hello ${name}!` });
  })
  .pathParam("name", joi.string(), "Person to greet");
