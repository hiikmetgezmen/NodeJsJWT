const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { object } = require("mongoose/lib/utils");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  if (err.code == 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
 

  if(err.message == "email")
  {
    errors.email = "email";
  } 
  if(err.message == "password")
  {
    errors.password = "password";
  } 
  return errors;
};

const maxage = 3 * 24 * 60 * 60;
const creattoken = (id,email) => {
  return jwt.sign({ id,email }, "jwt", {
    expiresIn: maxage,
  });
};

const signup_get = (req, res) => {
  res.render("signup");
};

const login_get = (req, res) => {
  res.render("login");
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = creattoken(user._id,user.email);
    res.cookie("jwt", token, { httpOnly: true, maxage: maxage * 1000 });
    res.json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = creattoken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxage: maxage * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({errors});
  }
};

const logout_get = (req,res)=>{
  res.cookie("jwt",'',{maxage:1});
  res.redirect('/login');
};

module.exports = {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get,
};
