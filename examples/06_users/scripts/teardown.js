"use strict";
const { context } = require("@arangodb/locals");

const Users = context.collection("users");
const Sessions = context.collection("sessions");

for (const collection of [Users, Sessions]) {
  if (collection) {
    collection.drop();
  }
}
