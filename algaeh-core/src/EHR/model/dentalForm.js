import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import algaehMail from "algaeh-utilities/mail-send";
import newAxios from "algaeh-utilities/axios";
const keyPath = require("algaeh-keys/keys");

let addDentalForm = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  let input = req.body;
  try {
    _mysql
      .executeQuery({
        query:
          "INSERT INTO hims_f_dental_form (patient_id,provider_id,visit_id,procedure_id,procedure_amt,vendor_id,request_status,\
            full_name,gender,age,patient_code,requested_date,date_of_birth,department_id,episode,approved,work_status,\
            due_date,bruxzir_anterior,ips_e_max,lava,lumineers,zirconia_e_max_layered,\
            bruxzir,nobel,white_high_nobel,non_precious,pmma,titanium,zirconia_w_ti_base,\
            biomet_3i_encode,screw_retained,flexi,analog,models,implant_parts,impression,\
            bite,shade_tab,others,photos,bags,rx_forms,created_date,created_by,updated_date,updated_by,hospital_id)\
                 values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.patient_id,
          input.provider_id,
          input.visit_id,
          input.hims_d_services_id,
          input.standard_fee,
          input.hims_d_vendor_id,
          input.request_status,
          input.full_name,
          input.gender,
          input.age,
          input.patient_code,
          input.requested_date,
          input.date_of_birth,
          input.department_id,
          input.episode,
          input.approved ? input.approved : "N",
          input.work_status ? input.work_status : "PEN",
          input.due_date,
          input.bruxzir_anterior,
          input.ips_e_max,
          input.lava,
          input.lumineers,
          input.zirconia_e_max_layered,
          input.bruxzir,
          input.nobel,
          input.white_high_nobel,
          input.non_precious,
          input.pmma,
          input.titanium,
          input.zirconia_w_ti_base,
          input.biomet_3i_encode,
          input.screw_retained,
          input.flexi,
          input.analog,
          input.models,
          input.implant_parts,
          input.impression,
          input.bite,
          input.shade_tab,
          input.others,
          input.photos,
          input.bags,
          input.rx_forms,

          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id,
        ],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  addDentalForm,
  getDentalLab: (req, res, next) => {
    const _mysql = new algaehMysql({ path: keyPath });
    //// TODO: to sort by hospital id is required or not
    try {
      let input = req.query;
      _mysql
        .executeQuery({
          query: `select 
          -- P.patient_code,concat(T.title,' ',P.full_name)as  patient_name,
             concat(ET.title,' ',E.full_name)as  employee_name,
             -- PL.hims_f_treatment_plan_id, PL.plan_name
       D.arrival_date, D.work_status,E.work_email,D.hims_f_dental_form_id,D.due_date ,D.department_id,D.requested_date,D.request_status,D.procedure_id, D.provider_id,D.procedure_amt,D.approved,D.date_of_birth,
        D.full_name, D.patient_code,D.gender, D.age,V.vendor_name,V.hims_d_vendor_id,S.service_name
         from hims_f_dental_form as D 
         -- inner join hims_f_patient as P on P.hims_d_patient_id=D.patient_id 
       -- left join hims_d_title as T on T.his_d_title_id = P.title_id 
         inner join hims_d_employee as E on  E.hims_d_employee_id =D.provider_id
         left join hims_d_title as ET on ET.his_d_title_id = E.title_id  
         left join hims_d_vendor as V on V.hims_d_vendor_id=D.vendor_id
         left join hims_d_services as S on S.hims_d_services_id =D.procedure_id
         -- inner join hims_f_treatment_plan as PL 
         -- on PL.patient_id = P.hims_d_patient_id and PL.visit_id = D.visit_id  and PL.episode_id = D.episode 
        where date(D.requested_date) >= date(?) and date(D.requested_date) <= date(?)`,
          values: [input.from_request_date, input.to_request_date],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;

          next();
        })
        .catch((error) => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (error) {
      next(error);
    }
  },

  updateDentalForm: (req, res, next) => {
    // const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query: `update hims_f_dental_form set patient_id=?,provider_id=?,procedure_id=?,procedure_amt=?,
        vendor_id=?,request_status=?,work_status=?,full_name=?,gender=?,age=?,patient_code=?,requested_date=?,
        date_of_birth=?,department_id=?,arrival_date=? where hims_f_dental_form_id=? `,

        values: [
          input.patient_id,
          input.provider_id,
          input.hims_d_services_id,
          input.standard_fee,
          input.hims_d_vendor_id,
          input.request_status ? input.request_status : "PEN",
          input.work_status ? input.work_status : "PEN",
          input.full_name,
          input.gender,
          input.age,
          input.patient_code,
          input.requested_date,
          input.date_of_birth,
          input.department_id,
          input.arrival_date,
          input.hims_f_dental_form_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        if (input.send_mail === true) {
          let input = req.body;

          const _mysql = new algaehMysql();

          _mysql
            .executeQuery({
              query: `select E.full_name as employee_name,

           D.arrival_date, D.work_status,E.work_email,D.hims_f_dental_form_id,D.due_date ,D.requested_date,D.request_status,D.procedure_id, D.provider_id,D.procedure_amt,D.approved,D.date_of_birth,
            D.full_name, D.patient_code,S.service_name
             from hims_f_dental_form as D

             inner join hims_d_employee as E on  E.hims_d_employee_id =D.provider_id
           

             left join hims_d_services as S on S.hims_d_services_id =D.procedure_id
             where D.hims_f_dental_form_id=?`,
              values: [input.hims_f_dental_form_id],
              printQuery: true,
            })
            .then((result) => {
              // console.log("result.request_status", result[0].work_email);
              let request_status =
                result[0].request_status === "APR"
                  ? "Approved"
                  : result[0].request_status === "REJ"
                  ? "Rejected"
                  : result[0].request_status === "RES"
                  ? "Resend"
                  : "Pending";
              let doctor_email = result[0].work_email;
              let work_status =
                result[0].work_status === "WIP"
                  ? "Ordered"
                  : result[0].work_status === "COM"
                  ? "Completed"
                  : "Pending";
              let requested_date = result[0].requested_date;
              let employee_name = result[0].employee_name;
              let service_name = result[0].service_name;
              let patient_code = result[0].patient_code;
              let full_name = result[0].full_name;
              let arrival_date = result[0].arrival_date;

              req.records = result;

              const { hospital_address, hospital_name } = req.userIdentity;
              try {
                newAxios(req, {
                  url: "http://localhost:3006/api/v1//Document/getEmailConfig",
                }).then((res) => {
                  const options = res.data;

                  new algaehMail(options.data[0])
                    .to(doctor_email)
                    .subject("Dental Order Update")
                    .templateHbs("dentalFormMail.hbs", {
                      request_status,
                      hospital_address,
                      hospital_name,
                      work_status,
                      requested_date,
                      employee_name,
                      service_name,
                      patient_code,
                      full_name,
                      arrival_date,
                    })
                    .send()
                    .then((response) => {
                      _mysql.releaseConnection();
                      next();
                    })
                    .catch((error) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                });
              } catch (e) {
                _mysql.releaseConnection();
                next(e);
              }
              _mysql.releaseConnection();

              next();
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          _mysql.releaseConnection();

          req.records = result;
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
};
