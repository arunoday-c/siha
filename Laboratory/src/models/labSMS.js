import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import publisher from "../rabbitMQ/publisher";
const TEMPLATES = {
  LAB_TEST: "LAB_TEST",
  PCR_TEST: "PCR_TEST",
};
export async function processLabSMS(req, res, next) {
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
            query: `UPDATE hims_f_lab_order SET send_sms='Y' where hims_f_lab_order_id=?`,
            values: [hims_f_lab_order_id],
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
    const { from_date, to_date } = req.query;
    const result = await _mysql
      .executeQuery({
        query: `select LO.hims_f_lab_order_id,LO.patient_id,LO.visit_id,LO.critical_status,
        IT.isPCR,P.patient_code,UCASE(P.full_name) as full_name,P.gender,
        concat(DATE_FORMAT(FROM_DAYS(DATEDIFF(CURDATE(),P.date_of_birth)), '%Y')+0,'Y') as years,
        S.service_name,U.username as validated_by,LO.validated_date,LO.short_url
         from hims_f_lab_order as LO
        inner join hims_d_investigation_test as IT on IT.hims_d_investigation_test_id = LO.test_id
        inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'
        inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'
        inner join algaeh_d_app_user as U on LO.validated_by = U.algaeh_d_app_user_id and U.record_status='A'
        where LO.send_sms='N' and date(ordered_date) between date(?) and (?)
        and LO.status='V' and LO.record_status='A' ;`,
        values: [from_date, to_date],
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
          .maxBy((m) => m.validated_date)
          .value();
        const PCR = _.chain(detail)
          .filter((f) => f.isPCR === "Y")
          .maxBy((m) => m.validated_date)
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
