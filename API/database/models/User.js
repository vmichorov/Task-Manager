const mongoose = require("mongoose");
const lodash = require("lodash");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const JWT_SECRET = "03712487825439908010ahsgashdgjas4323482307";

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  sessions: [
    {
      token: {
        type: String,
        required: true,
      },
      expiresAt: {
        type: Number,
        required: true,
      },
    },
  ],
});

schema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  return lodash.omit(userObj, ["password", "sessions"]);
};

schema.methods.genAccToken = function () {
  const user = this;

  return new Promise((resolve, reject) => {
    jwt.sign(
      { _id: user._id.toHexString() },
      JWT_SECRET,
      {
        expiresIn: "15min",
      },
      (err, token) => {
        if (!err) {
          resolve(token);
        } else {
          reject();
        }
      }
    );
  });
};

schema.methods.genRefreshToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buffer) => {
      if (!err) {
        let token = buffer.toString("hex");
        return resolve(token);
      }
    });
  });
};

schema.methods.createSession = function () {
  let user = this;
  return user
    .genRefreshToken()
    .then((refToken) => {
      return saveSession(user, refToken);
    })
    .then((refToken) => {
      return refToken;
    })
    .catch((e) => {
      return Promise.reject("Failed to save session.\n" + e);
    });
};

schema.statics.findByIdAndToken = function (_id, token) {
  const User = this;

  return User.findOne({
    _id,
    "sessions.token": token,
  });
};

schema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject();
    } else {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    }
  });
};

schema.statics.hasRefTokenExpired = (expiresAt) => {
  let secondsSinceEpoch = Date.now() / 1000;
  if (expiresAt > secondsSinceEpoch) {
    return false;
  } else {
    return true;
  }
};

schema.pre("save", function (next) {
  let user = this;
  let cost = 10;

  if (user.isModified("password")) {
    bcrypt.genSalt(cost, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hashedPass) => {
        user.password = hashedPass;
        next();
      });
    });
  } else {
    next();
  }
});

let saveSession = (user, refreshToken) => {
  return new Promise((resolve, reject) => {
    let expiresAt = genRefreshTokenExpTime();
    user.sessions.push({ token: refreshToken, expiresAt });
    user
      .save()
      .then(() => {
        return resolve(refreshToken);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

let genRefreshTokenExpTime = () => {
  let daysUntilExpire = "10";
  let secondsUntilExpire = daysUntilExpire * 24 * 60 * 60;
  return Date.now() / 1000 + secondsUntilExpire;
};

const User = mongoose.model("User", schema);

module.exports = { User };
