const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      console.log(user)
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            id: user[0]._id
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_get_favorites = (req, res, next) => {
  User.find({ _id: req.params.userId })
  .select("_id favorites")
  .exec()
  .then(doc => {
    if (doc) {
        res.status(200).json(doc);
    } else {
        res.status(404).json({message: 'No valid entry found for provided ID'});
    }
})
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      })
  })
};

exports.user_get_user = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    return res.status(200).json({
      message: 'User profile',
      userData: req.userData
    });
  } catch (error) {
    return res.status(401).json({
        message: 'Auth failed'
    });
  }
}

exports.user_update_user = (req, res, next) => {
  const id = req.params.userId;
  User.updateMany({ _id: id }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/user/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_update_password = (req, res, next) => {
  const id = req.params.userId;
  res.status(200).json({
    message: req.body
  })
  // User.updateMany({ _id: id }, { $set: req.body })
  //   .exec()
  //   .then(result => {
  //     res.status(200).json({
  //       message: "User updated",
  //       request: {
  //         type: "GET",
  //         url: "http://localhost:3000/user/" + id
  //       }
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err
  //     });
  //   });
};