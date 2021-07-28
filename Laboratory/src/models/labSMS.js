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

const TEMPLATES = {
  LAB_TEST: "LAB_TEST",
  PCR_TEST: "PCR_TEST",
};
export async function processLabSMS(req, res, next) {
  if (enableSMS !== "true") {
    next(new Error("SMS is not enabled..."));
    return;
  }
  const { publisher } = pub;
  const _mysql = new algaehMysql();
  const { list } = req.body;
  const { username } = req.userIdentity;
  try {
    if (!Array.isArray(list)) {
      throw new Error("There is no SMS record found.");
    }
    for (let i = 0; i < list.length; i++) {
      try {
        const {
          hims_f_lab_order_id,
          primary_id_no,
          patient_code,
          full_name,
          isPCR,
          years,
          gender,
          contact_no,
          short_url,
          visit_id,
          patient_id,
        } = list[i];
        await publisher("SMS", {
          template: isPCR === "Y" ? TEMPLATES.PCR_TEST : TEMPLATES.LAB_TEST,
          patient_code,
          full_name,
          primary_id_no,
          hims_f_lab_order_id,
          contact_no: String(contact_no).replace("+", "").trim(),
          years,
          gender,
          processed_by: username,
          short_url,
        }).catch((error) => {
          throw error;
        });
        await _mysql
          .executeQuery({
            query: `UPDATE hims_f_lab_order SET send_sms='Y' where visit_id=? and patient_id=? and status='V'`,
            values: [visit_id, patient_id],
          })
          .catch((err) => {
            console.error("In update Error===>", err);
          });
      } catch (e) {
        console.error("Error===>", e);
      }
    }
    _mysql.releaseConnection();
    next();
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}

export async function getValidatedResults(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { from_date, to_date, status } = req.query;
    let condition = "";
    if (status === "V") {
      condition = `and LO.send_sms='N'`;
    } else if (status === "S") {
      condition = `and LO.send_sms='Y'`;
    }
    const result = await _mysql
      .executeQuery({
        query: `select LO.hims_f_lab_order_id,LO.patient_id,LO.visit_id,LO.critical_status,
        IT.isPCR,P.patient_code,UCASE(P.full_name) as full_name,P.gender,P.primary_id_no,
        concat(DATE_FORMAT(FROM_DAYS(DATEDIFF(CURDATE(),P.date_of_birth)), '%Y')+0,'Y') as years,
        IT.description as service_name,LO.short_url,LO.ordered_date,concat(P.tel_code,P.contact_number) as contact_no,
        LO.sms_message_response,LO.sms_message_id,LO.sms_response_code
         from hims_f_lab_order as LO
        inner join hims_d_investigation_test as IT on IT.hims_d_investigation_test_id = LO.test_id
        inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'
        where date(LO.ordered_date) between date(?) and (?)
        and LO.status='V' and LO.record_status='A' ${condition};`,
        values: [from_date, to_date],
        printQuery: true,
      })
      .catch((error) => {
        throw error;
      });
    _mysql.releaseConnection();
    let dataSet = [];
    _.chain(result)
      .groupBy((g) => g.patient_id)
      .forEach((detail) => {
        const nonPCR = _.chain(detail)
          .filter((f) => f.isPCR === "N")
          .maxBy((m) => m.ordered_date)
          .value();
        const PCR = _.chain(detail)
          .filter((f) => f.isPCR === "Y")
          .maxBy((m) => m.ordered_date)
          .value();
        if (nonPCR) {
          dataSet.push(nonPCR);
        }
        if (PCR) {
          dataSet.push(PCR);
        }
      })
      .value();

    req["result"] = dataSet;
    next();
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
export async function updateSMSStatus(data) {
  const _mysql = new algaehMysql();
  try {
    const { hims_f_lab_order_id, code, message, message_id } = data;
    await _mysql
      .executeQuery({
        query: `UPDATE hims_f_lab_order SET sms_response_code=?,sms_message_id=?,sms_message_response=? where hims_f_lab_order_id=?;`,
        values: [code, message_id, message, hims_f_lab_order_id],
      })
      .catch((error) => {
        throw error;
      });
    _mysql.releaseConnection();
    return true;
  } catch (e) {
    _mysql.releaseConnection();
    console.error(
      `Error in updating hims_f_lab_order '${hims_f_lab_order_id}' @${new Date().toLocaleString()}===>`,
      e
    );
  }
}
