"use strict";
const { context } = require("@arangodb/locals");

const Users = context.collection("users");

module.exports = function(req, res, next) {
  if (req.session.uid !== req.uid) {
    const user = Users.document(req.session.uid);
    if (!user.admin) res.throw(403, "Access denied");
  }
  next();
};
