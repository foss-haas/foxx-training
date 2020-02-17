"use strict";
const { context } = require("@arangodb/locals");

const Todos = context.collection("todos");

if (Todos) {
  Todos.drop();
}
