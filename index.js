const express = require("express");
const bodyParser = require("body-parser")
const { myrouter } = require("./router/myroutes");

const app = express();


app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json());


app.use("/",myrouter);




module.exports = {app};