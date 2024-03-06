const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { query, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser=require('../middleware/fetchuser')


//jwt secret
const JWT_secret = "akshayJwtSectret";

//Route 1: Create a User using : POST "api/auth/createuser" . No loginm required

router.post(
  "/createuser",
  [
    query("name", "Enter a valid name").isLength({ min: 3 }),
    // email must be an valid email
    query("email", "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    query("password", "password length should be more than 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions

    //if there are errors return bad error and the errors
    const result = validationResult(req);
    //here ! is missing below
    if (result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    //try catch block
    try {
      //check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exist" });
      }

      //using bcrypt hashing package to hash the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //Create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      //creating a token to give it to the user
      const authToken = jwt.sign(data, JWT_secret);
      // console.log(token);

      // res.json(user);
      res.json({ authToken });

      //catch error if something happens
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error!");
    }
  }
);

//Route 2: Authenticate the user : POST "api/auth/login" . No login required

router.post(
  "/login",
  [
    //validating email and pasword
    query("email", "Enter a valid email").isEmail(),
    query("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    //If there are errors , return Bad request and the errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //taking out email and password from request body
    const { email, password } = req.body;

    try {
      //finding a user from User Model
      let user = await User.findOne({ email });

      //if user does not exist
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct Credentials" });
      }

      //comparing given  password with password in database
      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct Credentials" });
      }

      //if password is correct ,send the data or payload  using jwt
      const data = {
        user: {
          id: user.id,
        },
      };

      //creating a token to give it to the user
      const authToken = jwt.sign(data, JWT_secret);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error!");
    }
  }
);

//Route 3: Get loggedin User Details using : POST "http://localhost:4000/api/auth/getuser" .  login required

router.post("/getuser",fetchuser,async (req, res) => {
    try {
      userId =req.user.id;
      const user = await User.findOne({ _id: userId }).select("-password");
      res.send(user);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error!");
    }
  }
);

module.exports = router;
