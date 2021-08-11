const express = require("express");
const bodyParser = require("body-parser");

const databeseCfg = require("./database/mongoose");

const { List, Task } = require("./database/models");

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
    next();
  });

  // get all lists
  app.get("/lists", (req, res) => {
    List.find({}).then((lists) => {
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
  app.post("/lists", (req, res) => {
    const title = req.body.title;

    const newList = new List({ title });
    newList.save().then((list) => {
      res.send(list);
    });
  });
  // update existing list
  app.patch("/lists/:id", (req, res) => {
    List.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
      }
    ).then(() => {
      res.sendStatus(200);
    });
  });
  // delete existing list
  app.delete("/lists/:id", (req, res) => {
    List.findByIdAndRemove({ _id: req.params.id }).then((removedList) => {
      res.send(removedList);
    });
  });
  // get all tasks assigned to a specific list
  app.get("/lists/:listId/tasks", (req, res) => {
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
  app.post("/lists/:listId/tasks", (req, res) => {
    const newTask = new Task({
      content: req.body.content,
      _listId: req.params.listId,
    });
    newTask.save().then((task) => {
      res.send(task);
    });
  });
  // update existing task assigned to a specific list
  app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
    Task.findOneAndUpdate(
      {
        _id: req.params.taskId,
        _listId: req.params.listId,
      },
      {
        content: req.body.content,
        isCompleted: req.body.isCompleted,
      }
    ).then(() => {
      res.send({ message: "Updated" });
    });
  });
  // delete existing task assigned to a specific list
  app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
    Task.findOneAndRemove({
      _id: req.params.taskId,
      _listId: req.params.listId,
    }).then((removedTask) => {
      res.send(removedTask);
    });
  });

  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}
