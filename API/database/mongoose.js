const mongoose = require("mongoose");

module.exports = (app) => {
  return new Promise((resolve, reject) => {
    mongoose.connect("mongodb://localhost:27017/TaskManager", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on("error", (err) => {
      console.error("Database error:", err);
      reject(err);
    });
    db.once("open", function () {
      console.log("Database connected");
      resolve();
    });
  });
};
