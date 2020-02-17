"use strict";
const { context } = require("@arangodb/locals");
const joi = require("joi");
const createUser = require("../util/createUser");

const schema = joi
  .object()
  .keys({
    username: joi.string().required(),
    password: joi.string().required(),
    admin: joi.boolean().default(false)
  })
  .required();

const { value, error } = schema.validate(context.argv[0]);
if (error) throw Object.assign(error, { statusCode: 400 });
const { username, password, admin } = value;

const key = createUser(username, password, admin);

module.exports = { _key: key, username, admin };
