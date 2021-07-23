"use strict";
const nodemailer = require("nodemailer");
var myEmitter = require('./my_emitter');
const config = require('./config_custom.json');

// async..await is not allowed in global scope, must use a wrapper
myEmitter.on('email', async function(message) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: config.email_config.host,
    port: config.email_config.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email_config.user, // generated ethereal user
      pass: config.email_config.pass, // generated ethereal password
    },
    tls: { 
        rejectUnauthorized: false 
    }
  }); 

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Irrigation Server 🚿" <Ben@Crundwell.com>', // sender address
    to: "Ben@Crundwell.com, Ben@Crundwell.com", // list of receivers
    subject: "Irrigation Alert!", // Subject line
    text: message, // plain text body
    html: `<b>${message}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
});

