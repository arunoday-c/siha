import dotenv from "dotenv";
import algaehMysql from "algaeh-mysql";
import _ from "lodash";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const enableSMS = process.env.enableSMS;

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
      } = req.body;

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
      }).catch((error) => {
        throw error;
      });
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
