"use strict";
const { context } = require("@arangodb/locals");
const auth = require("./authenticator");

const Users = context.collection("users");

module.exports = function createUser(username, password, admin) {
  const now = Date.now();
  const { _key } = Users.save({
    created: now,
    modified: now,
    username,
    authData: auth.create(password),
    admin
  });
  return _key;
};
