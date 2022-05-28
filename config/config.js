 //const sql = require ("mssql");


// for parsing the  coming request so that middle ware can tackle with these request relevantly.
// let's create the conection ....hehehe

//myConnection is connection name and there is a in built function createConnection to establish the connection

const sql = require("mssql");
const config ={
 user:"sandeepdb2",
 password:"up61@W3s2@##",
 database:"SANDEEPDB2",
 server:"Sqlplesk7.securehostdns.com",
 port : 1234,
 TrustServerCertificate : true,
 options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,

  },


 //encrypt : "yes",
 //driver:"msnodesqlv8",
//  options: {
//     IntegratedSecurity : false
// }
};

// const myConnection =  sql.connect(config,function(err)
// {
//     if(err)
//     {   
//         console.log(" not connected" + err)
//     }
//     else 
//     {
//         console.log("connected" )
//     }

// });
// myConnection.connect(config) myConnection,sql,;




module.exports = {config}