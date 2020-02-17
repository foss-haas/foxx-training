"use strict";
const { context } = require("@arangodb/locals");
const SessionsMiddleware = require("@arangodb/foxx/sessions");

const Sessions = context.collection("sessions");

context.use(
  SessionsMiddleware({
    transport: "cookie",
    storage: Sessions
  })
);

context.use("/users", require("./routes/users"), "users").tag("users");
context.use("/auth", require("./routes/auth"), "auth").tag("auth");
