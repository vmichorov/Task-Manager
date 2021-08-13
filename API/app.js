const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const databeseCfg = require("./database/mongoose");

const { List, Task, User } = require("./database/models");

startApp();

async function startApp() {
  const app = express();
  await databeseCfg(app);
  app.use(bodyParser.json());
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Expose-Headers",
      "x-access-token, x-refresh-token"
    );
    next();
  });
  let authenticate = (req, res, next) => {
    const token = req.header("x-access-token");
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
      if (err) {
        res.status(401).send(err);
      } else {
        req.user_id = decoded._id;
        next();
      }
    });
  };
  const verifySession = (req, res, next) => {
    let refToken = req.header("x-refresh-token");
    let _id = req.header("_id");

    User.findByIdAndToken(_id, refToken)
      .then((user) => {
        if (!user) {
          return Promise.reject({
            error:
              "User not found. Make sure that the refresh token and user id are correct",
          });
        }
        req.user_id = user._id;
        req.user = user;
        req.refToken = refToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
          if (session.token === refToken) {
            if (User.hasRefTokenExpired(session.expiresAt) === false) {
              isSessionValid = true;
            }
          }
        });
        if (isSessionValid) {
          next();
        } else {
          return Promise.reject({
            error: "Refresh token has expired or the session is invalid",
          });
        }
      })
      .catch((err) => {
        res.status(401).send(err);
      });
  };

  /* List and Task Routes */

  // get all lists that belong to the authenticated user
  app.get("/lists", authenticate, (req, res) => {
    List.find({
      _userId: req.user_id,
    }).then((lists) => {
      res.send(lists);
    });
  });
  // get a single list
  app.get("/lists/:id", (req, res) => {
    List.findOne({
      _id: req.params.id,
    }).then((list) => {
      res.send(list);
    });
  });
  // create a new list
  app.post("/lists", authenticate, (req, res) => {
    const title = req.body.title;

    const newList = new List({ title, _userId: req.user_id });
    newList.save().then((list) => {
      res.send(list);
    });
  });
  // update existing list
  app.patch("/lists/:id", authenticate, (req, res) => {
    List.findOneAndUpdate(
      { _id: req.params.id, _userId: req.user_id },
      {
        $set: req.body,
      }
    ).then(() => {
      res.sendStatus(200);
    });
  });
  // delete existing list
  app.delete("/lists/:id", authenticate, (req, res) => {
    List.findByIdAndRemove({
      _id: req.params.id,
      _userId: req.user_id,
    }).then((removedList) => {
      res.send(removedList);

      deleteTasks(removedList._id);
    });
  });
  // get all tasks assigned to a specific list
  app.get("/lists/:listId/tasks", authenticate, (req, res) => {
    Task.find({
      _listId: req.params.listId,
    }).then((tasks) => {
      res.send(tasks);
    });
  });
  // get a single task assigned to a specific list
  app.get("/lists/:listId/tasks/:taskId", (req, res) => {
    Task.findOne({
      _id: req.params.taskId,
      _listId: req.params.listId,
    }).then((task) => {
      res.send(task);
    });
  });
  // create a new task assigned to a specific list
  app.post("/lists/:listId/tasks", authenticate, (req, res) => {
    List.findOne({
      _id: req.params.listId,
      _userId: req.user_id,
    })
      .then((list) => {
        if (list) {
          return true;
        }
        return false;
      })
      .then((canCreate) => {
        if (canCreate) {
          const newTask = new Task({
            content: req.body.content,
            _listId: req.params.listId,
          });
          newTask.save().then((task) => {
            res.send(task);
          });
        } else {
          res.sendStatus(404);
        }
      });
  });
  // update existing task assigned to a specific list
  app.patch("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
    List.findOne({
      _id: req.params.listId,
      _userId: req.user_id,
    })
      .then((list) => {
        if (list) {
          return true;
        }
        return false;
      })
      .then((canUpdate) => {
        if (canUpdate) {
          Task.findOneAndUpdate(
            {
              _id: req.params.taskId,
              _listId: req.params.listId,
            },
            {
              $set: req.body,
            }
          ).then(() => {
            res.send({ message: "Updated" });
          });
        } else {
          res.sendStatus(404);
        }
      });
  });
  // delete existing task assigned to a specific list
  app.delete("/lists/:listId/tasks/:taskId", authenticate, (req, res) => {
    List.findOne({
      _id: req.params.listId,
      _userId: req.user_id,
    })
      .then((list) => {
        if (list) {
          return true;
        }
        return false;
      })
      .then((canDelete) => {
        if (canDelete) {
          Task.findOneAndRemove({
            _id: req.params.taskId,
            _listId: req.params.listId,
          }).then((removedTask) => {
            res.send(removedTask);
          });
        } else {
          res.sendStatus(404);
        }
      });
  });

  /* User Routes */

  // sign-up user
  app.post("/users", (req, res) => {
    const body = req.body;
    const newUser = new User(body);
    newUser
      .save()
      .then(() => {
        return newUser.createSession();
      })
      .then((refToken) => {
        return newUser.genAccToken().then((accToken) => {
          return { accToken, refToken };
        });
      })
      .then((authTokens) => {
        res
          .header("x-refresh-token", authTokens.refToken)
          .header("x-access-token", authTokens.accToken)
          .send(newUser);
      })
      .catch((e) => {
        res.status(400).send(e);
      });
  });
  // login user
  app.post("/users/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findByCredentials(email, password)
      .then((user) => {
        return user
          .createSession()
          .then((refToken) => {
            return user.genAccToken().then((accToken) => {
              return { accToken, refToken };
            });
          })
          .then((authTokens) => {
            res
              .header("x-refresh-token", authTokens.refToken)
              .header("x-access-token", authTokens.accToken)
              .send(user);
          });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });
  // generate access token
  app.get("/users/me/access-token", verifySession, (req, res) => {
    req.user
      .genAccToken()
      .then((accToken) => {
        res.header("x-access-token", accToken).send({ accToken });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });

  /* Helper Methods */

  let deleteTasks = (_listId) => {
    Task.deleteMany({
      _listId,
    }).then(() => {
      console.log(`Tasks from List: ${_listId} were deleted!`);
    });
  };

  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}
