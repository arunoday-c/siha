const nodemailer = require("nodemailer");
const ical = require("ical-generator");
const hbs = require("handlebars");
const jstz = require("jstimezonedetect");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
require("regenerator-runtime/runtime");
/*
   smtp / user / password / service : typeof string
   port : typeof int
*/
function algaehMail(options) {
  if (options === undefined) {
    options = {};
  }

  const { smtp, port, useSSL, user, password, service } = options;
  const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
  const host = smtp === undefined ? "smtp.gmail.com" : smtp;
  const _service =
    service === undefined && host.includes("gmail")
      ? {
          service: "gmail",
        }
      : { service: service };
  const tls =
    useSSL === true
      ? {}
      : {
          tls: {
            rejectUnauthorized: false,
          },
        };
  this.transporter = nodemailer.createTransport({
    ..._service,
    host: host,
    port: port === undefined ? 465 : port,
    secure: useSSL === undefined ? false : useSSL,
    ...tls,
    auth: {
      user:
        user === undefined
          ? EMAIL_USER === undefined
            ? "we@algaeh.com"
            : EMAIL_USER
          : user,
      pass:
        password === undefined
          ? EMAIL_PASSWORD === undefined
            ? "heagla100%"
            : EMAIL_PASSWORD
          : password,
    },
  });
  this.mailOptions = {
    from: "Algaeh Technologies <we@algaeh.com>",
  };
  this.hbsFilePath = undefined;
  this.hbsData = undefined;
}
algaehMail.prototype.proxy = function (proxy) {
  this.mailOptions["proxy"] = proxy;
  return this;
};
algaehMail.prototype.from = function (from) {
  this.mailOptions["from"] = from;
  return this;
};
algaehMail.prototype.to = function (to, cc, bcc) {
  this.mailOptions["to"] = to;
  if (cc !== undefined) {
    this.mailOptions["cc"] = cc;
  }
  if (bcc !== undefined) {
    this.mailOptions["bcc"] = bcc;
  }
  return this;
};
/*
   attachments : typeof array ex [{path:"path of file"/ base64 string}]
*/
algaehMail.prototype.attachments = function (attachments) {
  this.mailOptions["attachments"] = attachments;
  return this;
};
/*
  options : { start, end, summary, organizer, description, attendee}
  start / end : typeof dateTime ex new Date(),
  description / organizer / category :typeof string,
  attendees : typeof array ex [{email:"abc@gmail.com",name:"ABC"}]
  alarm : typeof integer ex 300 => 5mins
  
*/
algaehMail.prototype.calender = function (options, eventName, category) {
  if (options === undefined) {
    options = {};
  }
  const { start, end, organizer, description, attendees, alarm } = options;
  const cal = ical({
    domain: os.hostname(),
    prodId: { company: "algaeh.com", product: "algaeh-email-sender-service" },
    name: eventName,
  });
  const timeZone = jstz.determine().name();
  const event = cal.createEvent({
    start: start,
    end: end,
    timezone: timeZone,
    timestamp: new Date(),
    summary: eventName,
    description: description,
    floating: true,
    //organizer: organizer === undefined ? "Algaeh Technologies" : organizer
  });
  if (organizer !== undefined) {
    event.organizer({
      name: organizer,
      email: this.mailOptions.from,
    });
  }
  if (category !== undefined) {
    event.createCategory({
      name: category.toUpperCase(),
    });
  }
  if (alarm !== undefined) {
    event.createAlarm({
      type: "audio",
      trigger: alarm,
    });
  }
  if (attendees !== undefined) {
    for (let i = 0; i < attendees.length; i++) {
      event.createAttendee(attendees[i]);
    }
  }
  this.mailOptions["icalEvent"] = {
    method: "request",
    content: cal.toString(),
  };
  return this;
};
algaehMail.prototype.subject = function (subject) {
  this.mailOptions["subject"] = subject;
  return this;
};
algaehMail.prototype.text = function (text) {
  this.mailOptions["text"] = text;
  return this;
};
algaehMail.prototype.html = function (html) {
  this.mailOptions["html"] = html;
  return this;
};
algaehMail.prototype.templateHbs = function (fileName, data) {
  const file = path.join(process.cwd(), "../templates", fileName);

  if (!fs.existsSync(file)) {
    return new Error(`Template file ${file} does not exists`);
  }
  this.hbsFilePath = file;
  this.hbsData = data;
  return this;
};
algaehMail.prototype.send = function (printInput) {
  return new Promise((resolve, reject) => {
    try {
      if (printInput === true) console.log("Mail Input.", this.mailOptions);
      (async () => {
        if (this.hbsFilePath !== undefined && this.hbsFilePath !== "") {
          const htmlFile = await fs.readFile(this.hbsFilePath, "utf-8");
          this.mailOptions["html"] = await hbs.compile(htmlFile)(this.hbsData);
        }
        this.transporter
          .sendMail(this.mailOptions)
          .then((result) => {
            this.transporter.close();
            this.hbsFilePath = undefined;
            this.hbsData = undefined;
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      })();
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = algaehMail;
