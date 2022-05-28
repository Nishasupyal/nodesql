const http = require("http");
const { app } = require("./index");
const port = 4000;

const myserver = http.createServer(app);



myserver.listen(port,()=>
{
    console.log(`i am on ${port} port ` +  '@ http://localhost:4000');
})