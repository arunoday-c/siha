"use strict";
const nodemailer = require("nodemailer");

function algaehMailer(options) {
  if (options == null) {
    throw new Error("Please provide valid settings");
  }
  this.transporter = nodemailer.createTransport({
    host: options.smtp,
    port: options.port,
    secure: options.useSSL,
    auth: {
      user: options.user,
      pass: options.password
    }
  });
  const _toAddress = Array.isArray(options.to)
    ? options.to.join(",")
    : options.to;
  const _cc = options.cc == null ? {} : { cc: options.cc };
  const _proxy = options.proxy == null ? {} : { proxy: options.proxy };
  this.mailOptions = {
    from: options.from,
    to: _toAddress,
    subject: options.subject,
    text: options.body,
    html: options.htmlBody,
    ..._cc,
    ..._proxy
  };
}

algaehMailer.prototype.sendEmail = function() {
  return new Promise((resolve, reject) => {
    this.transporter.sendMail(this.mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
module.exports = algaehMailer;
