"use strict";
const { context } = require("@arangodb/locals");
const { db } = require("@arangodb");

const users = context.collectionName("users");
const sessions = context.collectionName("sessions");

for (const name of [users, sessions]) {
  if (!db._collection(name)) {
    db._createDocumentCollection(name);
  }
}
