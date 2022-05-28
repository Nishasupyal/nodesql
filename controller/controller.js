const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 const otp = require("otp-generator")

const {config } = require("../config/config");
const randomToken = require("rand-token");
const nodemailer = require("nodemailer")
require("dotenv").config();


const jwt_key = process.env.my_secret_key;



sql.connect(config, function (err) {
    if (err) {
        console.log("not connected" + err);
    }
    else
        console.log("connected ");
});

const request = new sql.Request()


function insertData(req, res) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            const data = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                email: req.body.email,
                password: hash,
                mobile: req.body.mobile,
            }
            console.log(data.password);
            request.query(`insert into signup values ('${data.firstname}','${data.lastname}','${data.gender}','${data.email}','${data.password}','${data.mobile}') `, (err, result, fields) => {

                if (err) {
                    res.send(err);
                }
                else {


                    return res.status(201).json(
                        {
                            result: result,
                            message: "your entry is created",
                        }
                    )
                }
            })
        })
    })

}



function login(req, res) {
    const data = {
        email: req.body.email,
        password: req.body.password
    }
    // console.log(jwt_key);

    request.query(`select * from signup where email = '${req.body.email}' `, (err, result) => {
        console.log(result);
        if (err) {
            res.json(
                {
                    Error: err,

                }
            );
        }
        else if (!result) {
            res.status(400).json(
                {
                    message: "invalid email",

                }



            )
        }
        else {
            bcrypt.compare(req.body.password, result.recordset[0].password, function (err, response) {
                console.log(err);
                console.log(response);
                if (!response) {
                    return res.json(
                        {
                            message: "invalid ceredantials ..pleasee check your email and password"
                        }
                    )
                }
                else if (response) {
                    const jwttoken = jwt.sign(data, jwt_key);

                    return res.status(200).json(
                        {

                            message: "logged in successfully",
                            Token: jwttoken,

                        }
                    )
                }
            });
        }
    }
    )
}



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function Resetpassword(req, res) {
    const mail = req.body.email;

    request.query(`select [email] from  [signup] where email = '${mail}' `, function (err, result) {
        console.log(result)
        console.log(err)
        if (result.recordset.length < 1) {

            res.json(
                {
                    message: "invalid email/ This email is not registered"
                }
            )
        }
        else if (err) {
            res.json(
                {
                    message: err,
                }
            )


        }
        else {

            const token =  randomToken.generate(50);


    //         var mailtransport = nodemailer.createTransport(
    //             {
    //                 host :"smtp.gmail.com",
    //                 service : "gmail",
    //                 secure : false,
    //                 port: 465, // port for secure SMTP
    //                 tls: {
    //                    ciphers:'SSLv3',
    //                    rejectUnauthorized: false
    //                 },
    //                 auth :  {
    //                     user : process.env.my_mail,
    //                     pass : process.env.my_password,

    //                 }

    //             }
    //         )
    //         console.log(process.env.my_mail);
    //         console.log(process.env.my_password)
    //                  let maildetail  =  {
    //             from : process.env.my_mail,
    //             to : "nishasupyal202@gmail.com",
    //             subject : "this is a test mail",
    //             text : "nothing" + token,
    //             html : '<table><tr> <th> your mail - </th><th> nishasupyal202@gmail.com</th></table>'
    //          }
    //          mailtransport.sendMail(maildetail, function(err,info)
    //          {
    //              if(err)
    //              {
    //                  console.log("errror : " + err)
    //              }
    //              else 
    //              {
    //                  console.log("mail has been sent successfully" + info)
    //              }




    //          })
           




        }

     })


}


module.exports = { insertData, login, Resetpassword }