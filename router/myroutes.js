const { insertData, login, Resetpassword } = require("../controller/controller");
const express = require("express");
const myrouter = express.Router();

myrouter.post("/signup",insertData);
myrouter.post("/login",login)
myrouter.post("/reset-password-mail",Resetpassword);

module.exports = {myrouter}