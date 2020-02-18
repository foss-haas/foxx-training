"use strict";
const { context } = require("@arangodb/locals");

context.use("/hello", require("./greetings"));
context.use("/maths", require("./maths"));
