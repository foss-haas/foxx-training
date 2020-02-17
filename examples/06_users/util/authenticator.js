"use strict";
const { context } = require("@arangodb/locals");
const Auth = require("@arangodb/foxx/auth");

module.exports = Auth({
  method: "pbkdf2",
  workFactor: context.configuration.pbkdf2WorkFactor
});
