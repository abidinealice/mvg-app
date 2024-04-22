const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtRandom = process.env.JWT_SECRET;

//CREATE USER

exports.signup = (req, res, next) => {
  bcrypt
    //Hash password
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "User created!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//LOGIN USER

exports.login = (req, res, next) => {
  //Verify if email in database
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: `Authentification error!` });
      }
      //Compare the password entered by the user with the hash stored in the database
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: `Authentification error!` });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, jwtRandom),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
