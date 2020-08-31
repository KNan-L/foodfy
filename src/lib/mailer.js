const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d5709e7bb96ed7",
    pass: "8ba31b519f3afa"
  }
})