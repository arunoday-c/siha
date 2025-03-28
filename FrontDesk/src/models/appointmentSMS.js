import dotenv from "dotenv";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const { enableSMS, EXTRA_PARAMS, SCHEDULE_SMS_DATE_FORMAT } = process.env;

let pub = {};
if (enableSMS === "true") {
  pub = require("../rabbitMQ/publisher");
}

export async function confirmAppointmentSMS(req, res, next) {
  if (enableSMS !== "true") {
    next(new Error("SMS is not enabled..."));
    return;
  }

  const { publisher } = pub;
  const _mysql = new algaehMysql();

  const { username, hospital_name } = req.userIdentity;
  try {
    try {
      const {
        primary_id_no,
        patient_code,
        patient_name,
        age,
        gender,
        contact_number,
        tel_code,
        doc_name,
        appointment_date,
        notify_sms_time,
        appointment_from_time,
      } = req.body;
      let date = appointment_date;
      let time = appointment_from_time;
      // tell moment how to parse the input string
      let momentObj = moment(date + time, "YYYY-MM-DDLT");
      // conversion
      let datetime = new Date(momentObj.format("YYYY-MM-DD HH:mm:s"));
      datetime.setHours(datetime.getHours() - notify_sms_time);
      const dateTime = moment(datetime).format(SCHEDULE_SMS_DATE_FORMAT);
      const messageDateTime = moment(momentObj).format("MMM Do YYYY, hh:mm A");
      await publisher("SMS", {
        template: "CONFIRM_APPOINTMENT",
        patient_code,
        // full_name: patient_name,
        patient_name,
        primary_id_no,
        contact_no: String(tel_code + contact_number)
          .replace("+", "")
          .trim(),
        years: age,
        gender,
        patient_name,
        processed_by: username,
        doc_name,
        appointment_date,
        hospital_name,
        messageDateTime,
      }).catch((error) => {
        throw error;
      });
      if (
        notify_sms_time &&
        new Date(appointment_date) >
          new Date(moment(new Date()).format("YYYY-MM-DD"))
      ) {
        const extraParams = EXTRA_PARAMS.replace(/\$dateTime/gi, `${dateTime}`);
        await publisher("SMS", {
          template: "RE_SEND_CONFIRM",
          patient_code,
          full_name: patient_name,
          patient_name,
          primary_id_no,
          contact_no: String(tel_code + contact_number)
            .replace("+", "")
            .trim(),
          years: age,
          gender,
          processed_by: username,
          doc_name,
          extra_params: extraParams,
          hospital_name,
          messageDateTime,
        }).catch((error) => {
          throw error;
        });
      }

      // await _mysql
      //   .executeQuery({
      //     query: `UPDATE hims_f_lab_order SET send_sms='Y' where visit_id=? and patient_id=? and status='V'`,
      //     values: [visit_id, patient_id],
      //   })
      //   .catch((err) => {
      //     console.error("In update Error===>", err);
      //   });
    } catch (e) {
      console.error("Error===>", e);
    }

    _mysql.releaseConnection();
    next();
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}

export async function rescheduleAppointmentSMS(req, res, next) {
  if (enableSMS !== "true") {
    next(new Error("SMS is not enabled..."));
    return;
  }

  const { publisher } = pub;
  const _mysql = new algaehMysql();

  const { username } = req.userIdentity;
  try {
    try {
      const {
        patient_name,
        doc_name,
        contact_number,
        tel_code,
        appointment_date,
        appointment_from_time,
      } = req.body;
      const { hospital_name } = req.userIdentity;
      let date = appointment_date;
      let time = appointment_from_time;
      // tell moment how to parse the input string
      let momentObj = moment(date + time, "YYYY-MM-DDLT");
      // conversion

      const messageDateTime = moment(momentObj).format("MMM Do YYYY, hh:mm A");
      await publisher("SMS", {
        template: "RESCHEDULED_APPOINTMENT",
        hospital_name,
        patient_name,
        contact_no: String(tel_code + contact_number)
          .replace("+", "")
          .trim(),
        doc_name,
        messageDateTime,
      }).catch((error) => {
        throw error;
      });
    } catch (e) {
      console.error("Error===>", e);
    }

    _mysql.releaseConnection();
    next();
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
