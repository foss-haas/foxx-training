"use strict";
const { context } = require("@arangodb/locals");
const Router = require("@arangodb/foxx/router");
const { query } = require("@arangodb");
const joi = require("joi");
const auth = require("../util/authenticator");

const Users = context.collection("users");

const routes = Router();
module.exports = routes;

routes.get(
  "/",
  (req, res) => {
    if (!req.session.uid) {
      res.json({
        uid: null,
        profile: null
      });
    } else {
      res.json({
        uid: req.session.uid,
        profile: req.makeAbsolute(
          req.reverse("users.detail.profile", { uid: req.session.uid })
        )
      });
    }
  },
  "whoami"
);

routes
  .post(
    "/login",
    (req, res) => {
      const { username, password } = req.body;
      const user = query`
        FOR user IN ${Users}
        FILTER user.username == ${username}
        RETURN user
      `.next();
      if (!user || !auth.verify(user.authData, password)) {
        res.throw(403, "Bad credentials");
      }
      req.session.uid = user._key;
      req.sessionStorage.save(req.session);
      res.json({
        uid: user._key,
        profile: req.makeAbsolute(
          req.reverse("users.detail.profile", { uid: user._key })
        )
      });
    },
    "login"
  )
  .body(joi.object().keys({ username: joi.string(), password: joi.string() }))
  .response(joi.object().keys({ uid: joi.string(), profile: joi.string() }))
  .error(403, "Credentials mismatch or unknown username");

routes
  .post(
    "/logout",
    (req, res) => {
      req.sessionStorage.clear(req.session);
      delete req.session;
      res.status(204);
    },
    "logout"
  )
  .response(204, "Logout successful");
