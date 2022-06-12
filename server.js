const http = require("http");
const { app } = require("./index");
const port = 4000;

const myserver = http.createServer(app);



myserver.listen(port,()=>
{
    console.log(`we are Listenning on ${port} port ` +  '@ http://localhost:4000');
})