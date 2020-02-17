"use strict";
const { context } = require("@arangodb/locals");
const { query } = require("@arangodb");
const Router = require("@arangodb/foxx/router");
const joi = require("joi");

const enforceAuth = require("../middleware/enforceAuth");
const enforceSameUser = require("../middleware/enforceSameUser");
const auth = require("../util/authenticator");

const Users = context.collection("users");

const routes = Router();
module.exports = routes;

routes.use(enforceAuth);

routes.get(
  "/",
  (req, res) => {
    res.json(
      query`
        FOR user IN ${Users}
        SORT user.created ASC
        RETURN { uid: user._key, username: user.username }
      `
        .toArray()
        .map(user => ({
          ...user,
          url: req.makeAbsolute(
            req.reverse("detail.profile", { uid: user.uid })
          )
        }))
    );
  },
  "list"
);

const userRoutes = Router();
routes.use("/:uid", userRoutes, "detail");

userRoutes.use((req, res, next) => {
  req.uid = req.pathParams.uid;
  next();
});

userRoutes.get(
  "/",
  (req, res) => {
    const { created, modified, username } = Users.document(req.uid);
    res.json({ uid: req.uid, created, modified, username });
  },
  "profile"
);

userRoutes
  .patch(
    "/",
    enforceSameUser,
    (req, res) => {
      const { username } = req.body;
      const { created } = Users.document(req.uid);

      const now = Date.now();
      Users.update(req.uid, { username, modified: now });
      res.json({ uid: req.uid, created, modified: now, username });
    },
    "update"
  )
  .body(
    joi.object().keys({
      username: joi.string()
    })
  );

userRoutes
  .post(
    "/password",
    enforceSameUser,
    (req, res) => {
      const { oldPassword, newPassword } = req.body;
      const { created, username, authData } = Users.document(req.uid);

      const valid = auth.verify(authData, oldPassword);
      if (!valid) res.throw(403, "Wrong password");

      const now = Date.now();
      Users.update(req.uid, {
        authData: auth.create(newPassword),
        modified: now
      });
      res.json({ uid: req.uid, created, modified: now, username });
    },
    "password"
  )
  .body(
    joi.object().keys({
      oldPassword: joi.string(),
      newPassword: joi.string()
    })
  );

userRoutes.delete(
  "/",
  enforceSameUser,
  (req, res) => {
    Users.remove(req.uid);
    if (req.uid === req.session.uid) {
      req.sessionStorage.clear(req.session);
      delete req.session;
    }
  },
  "delete"
);
