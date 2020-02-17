"use strict";
const { context } = require("@arangodb/locals");
const { db } = require("@arangodb");

const todos = context.collectionName("todos");

if (!db._collection(todos)) {
  db._createDocumentCollection(todos);
}
