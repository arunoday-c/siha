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

  const { username } = req.userIdentity;
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
      await publisher("SMS", {
        template: "CONFIRM_APPOINTMENT",
        patient_code,
        full_name: patient_name,
        primary_id_no,
        contact_no: String(tel_code + contact_number)
          .replace("+", "")
          .trim(),
        years: age,
        gender,
        processed_by: username,
        doc_name,
        appointment_date,
      }).catch((error) => {
        throw error;
      });
      if (
        new Date(appointment_date) >
        new Date(moment(new Date()).format("YYYY-MM-DD"))
      ) {
        const extraParams = EXTRA_PARAMS.replace(/\$dateTime/gi, `${dateTime}`);
        await publisher("SMS", {
          template: "RE_SEND_CONFIRM",
          patient_code,
          full_name: patient_name,
          primary_id_no,
          contact_no: String(tel_code + contact_number)
            .replace("+", "")
            .trim(),
          years: age,
          gender,
          processed_by: username,
          doc_name,
          extra_params: extraParams,
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
