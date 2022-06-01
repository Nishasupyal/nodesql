const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpgen = require("otp-generator")

const { config } = require("../config/config");
const randomToken = require("rand-token");
const nodemailer = require("nodemailer")
require("dotenv").config();

const jwt_key = process.env.my_secret_key;
var otp;
var mail;

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
                   return res.send(err);
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
          return  res.json(
                {
                    Error: err,

                }
            );
        }
        else if (!result) {
           return res.status(400).json(
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
    mail = req.body.email;

    request.query(`select [email] from  [signup] where email = '${mail}' `, function (err, result) {
        console.log(result)
        console.log(err)
        if (result.recordset.length < 1) {

          return  res.json(
                {
                    message: "invalid email/ This email is not registered"
                }
            )
        }
        else if (err) {
          return  res.json(
                {
                    message: err,
                }
            )
        }
        else if (result) {

            // const token = randomToken.generate(50);
            otp = otpgen.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
            const now = new Date();
            
                console.log(otp)
            var mailtransport = nodemailer.createTransport(
                {
                    host: "smtp.gmail.com",
                    service: "gmail",
                    secure: false,
                    port: 465, // port for secure SMTP
                    tls: {
                        ciphers: 'SSLv3',
                        rejectUnauthorized: false
                    },
                    auth: {
                        user: process.env.my_mail,
                        pass: process.env.my_password,

                    }

                }
            )
            console.log(process.env.my_mail);
            console.log(process.env.my_password)
            let maildetail = {
                from: process.env.my_mail,
                to: "nishasupyal202@gmail.com",
                subject: "this is a test mail",
                text: `your otp is ${otp}`,
            }
            mailtransport.sendMail(maildetail, function (err, info) {
                if (err) {
                    console.log("errror : " + err)
                    res.json(
                        {
                            Error: err
                        }
                    )
                }
                else {
                    console.log("mail has been sent successfully" + otp)
                    res.json(
                        {
                            message: "your mailhas been sent successfully"
                        }
                    )
                }
            })
        }

    })
}
function verifyotp(req, res) {

    const getotp = req.body.otp;
    if (getotp == otp) {
        res.status(200).json(
            {
                message: "now you can change your password ..please enter your new password and confirm it",
                URL: "http://localhost:4000/reset-password/verify-otp/change-password",

            }
        )
    }
    else {
        res.status(403).json(
            {
                Error: "invalid otp"
            }
        )
    }
}
function changepassword(req, res) {
    const data = {
        newpass: req.body.newpassword,
        confirmpass: req.body.confirmpassword,
    }
    console.log(data.newpass, data.confirmpass);

    if (data.newpass == data.confirmpass) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(data.newpass, salt, (error, hash) => {
                request.query(`update signup set password = '${hash}' where email= '${mail}'`, function (err, result) {
                    console.log(result);
                    console.log(mail);
                    if (err) {
                        res.status(500).json(
                            {
                                message: "something went wrong " + err
                            }
                        )
                    }
                    else {
                        console.log(hash)
                        res.status(200).json(
                            {
                                message: "your password is updated",
                                result: result


                            }
                        )
                    }

                })

            })

        })

    }
    else {
        res.status(403).json(
            {
                Error: "confirm password doesn't matched"
            }
        )
    }

}
//_+_+_+_+_+_++_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_++++++++++++++++++++++++____________________+++++++++++++_____________




function Resetpasswordmail(req, res) {
    mail = req.body.email;
    console.log(mail)

    request.query(`select * from  [signup] where email = '${mail}'`,function (err, result) 
    {
        console.log(result)
        console.log(err)
        if (result.recordset.length < 1) {

         return   res.json(
                {
                    message: "invalid email/ This email is not registered"
                }
            )
        }
        else if (err) {
         return   res.json(
                {
                    message: err,
                }
            )
        }
        else if (result) 
        {
    
            const  new_secret = result.recordset[0].password + jwt_key;
            console.log(result.recordset[0].password)
            console.log(new_secret);
            const payload = {
                email : mail,
            }
            const token = jwt.sign(payload, new_secret,{expiresIn : "5m"})
            const link = `http://localhost:4000/forgot-password-mail/${mail}/${token}`
            var mailtransport = nodemailer.createTransport(
                {
                    host: "smtp.gmail.com",
                    service: "gmail",
                    secure: false,
                    port: 465, // port for secure SMTP
                    tls: {
                        ciphers: 'SSLv3',
                        rejectUnauthorized: false
                    },
                    auth: {
                        user: process.env.my_mail,
                        pass: process.env.my_password,

                    }


                }
            )
            
            const details =  {
                from: process.env.my_mail,
                to: process.env.reciever_mail,
                subject: "this is a test mail",
               html : `<p>you are requested for reset password. please follow this </p> <a href = ${link}>link </a> to reset your passsword`
            }
            console.log(link)

            mailtransport.sendMail(details,function(err,info)
            {
                if(err)
                {
                   return res.json({
                        error : `somthing went wrong ${err}`
                    })
                }
                else if (info)
                {
                  return  res.json(
                        {
                            message : "mail has been sent successfully",

                        }
                        
                    )
                    
                }
            })
            return ;
      }
    })
}

function forgot_password (req,res)
{
    const email = req.params.mail;
    const token = req.params.token;
    //  res.send(token);
    //  res.send(email);
    request.query(`select * from signup where email = '${email}'`,function(err,result)
    {
        console.log(result);
        if(err)
        {
            return res.status(403).json(
                {
                    messsage : "email doesn't match",
                }
            )
        }
        else 
        {
            const  new_secret = result.recordset[0].password + jwt_key;
            console.log(new_secret);

            try 
            {
                const payload = jwt.verify(token , new_secret)
                console.log(payload)
               return  res.render('../view/reset_password.hbs' , {email : process.env.reciever_mail})
            }
            catch (err)
            {
              return  res.json (
                    {
                        error : err.message 
                    }
                )

            }

        }

    })

}
function reset_password (req,res)
{
   const {mail , token} = req.params;
  const new_pass = req.body.password;
  const confirm_pass = req.body.password2;
  if(new_pass != confirm_pass)
  {
      return res.status(403).json(
          {
              Error : "password does'nt match please enter same passwords"
          }
      )
  }
  else 
  {
      bcrypt.genSalt(10,(err,salt)=>
      {
         bcrypt.hash(new_pass,salt,(err,hash)=>
         {
             request.query(`update signup set password = '${hash}' where email = '${mail}'` ,(err,result)=>
             {
                 console.log(hash)
                 if(err)
                 {
                   return  res.status(403).json(
                         {
                             Error : err
                         }
                     )
                 }
                 else if(result)
                 {
                   return  res.status(200).json(
                         {
                             meesaage : "your password is updated suuccessfuly",
                             result : result
                         }
                     )

                 }

             })
         })

      })
}
  

}

module.exports = { insertData, login, Resetpassword, verifyotp, changepassword , Resetpasswordmail,forgot_password,reset_password }