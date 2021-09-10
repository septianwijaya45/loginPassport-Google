const nodemailer = require("nodemailer");

let smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alvarowijaya999@gmail.com",
    pass: "Macbookpro2018",
  },
});

exports.sendResetEmail = async (email, token) => {
  let url = "http://localhost:5000";
};

exports.sendVerifyEmail = async (email, token) => {
  let url = "http://localhost:5000/verify-email?token=" + token;

  await smtpTransport.sendMail({
    from: "noreply@listedApp.com",
    to: email,
    subject: "Verify Your Account",
    text: `Please verify your account in link this: ${url}`,
    html: `<h3>Click this url: ${url}</h3>`,
  });
};
