"use strict";
const { context } = require("@arangodb/locals");
const hello = require("./hello");
const math = require("./math");

context.use("/hello", hello);
context.use("/math", math);
