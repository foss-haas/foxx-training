"use strict";
module.exports = function enforceAuth(req, res, next) {
  if (!req.session || !req.session.uid) {
    res.throw(401, "Not logged in");
  }
  next();
};
