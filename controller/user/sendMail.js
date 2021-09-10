const nodemailer = require("nodemailer");

let smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "<email>",
    pass: "<password>",
  },
});

exports.sendResetEmail = async (email, token) => {
  let url = "http://localhost:5000/reset-password?token=" + token;

  await smtpTransport.sendMail({
    from: "alvarowijaya999@gmail.com",
    to: email,
    subject: "RESET YOUR PASSWORD",
    text: `Click on this link to reset your password ${url}`,
    html: `<h3> Click on this link to reset your password : ${url} </h3>`,
  });
};

exports.sendVerifyEmail = async (email, token) => {
  let url = "http://localhost:5000/verify-email?token=" + token;

  await smtpTransport.sendMail({
    from: "alvarowijaya999@gmail.com",
    to: email,
    subject: "Verify Your Account",
    text: `Please verify your account in link this: ${url}`,
    html: `<h3>Click this url: ${url}</h3>`,
  });
};


