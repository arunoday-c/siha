import algaehMysql from "algaeh-mysql";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import appsettings from "algaeh-utilities/appsettings.json";
import pad from "node-string-pad";
import moment from "moment";
import mysql from "mysql";
import _ from "lodash";
import axios from "axios";
import algaehMail from "algaeh-utilities/mail-send";
import "regenerator-runtime/runtime";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();
const { PORTAL_HOST } = process.env;
// export default
const labModal = {
  getLabOrderedServices_old: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputValues = [];
      let _stringData = "";

      _stringData += " LO.hospital_id=?";
      inputValues.push(req.userIdentity.hospital_id);

      if (req.query.from_date != null) {
        _stringData +=
          " and date(ordered_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        _stringData += " and date(ordered_date) <= date(now())";
      }

      if (req.query.hassanShow === "withhassan") {
        _stringData += " and LO.hassan_number is not null";
      }
      if (req.query.hassanShow === "withOuthassan") {
        _stringData += " and LO.hassan_number is null";
      }

      if (req.query.patient_id != null) {
        _stringData += " and LO.patient_id=?";
        inputValues.push(req.query.patient_id);
      }

      if (req.query.visit_id != null) {
        _stringData += " and LO.visit_id=?";
        inputValues.push(req.query.visit_id);
      }

      if (req.query.status != null) {
        _stringData += " and LO.status=?";
        inputValues.push(req.query.status);
      }

      if (req.query.send_sms) {
        _stringData += " and LO.send_sms=?";
        inputValues.push(req.query.send_sms);
      }

      if (req.query.test_type != null) {
        _stringData += " and LO.test_type=?";
        inputValues.push(req.query.test_type);
      }

      _mysql
        .executeQuery({
          query:
            " select hims_f_lab_order_id,V.episode_id, LO.patient_id,hassan_number_updated_date,hesn_upload_updated_date,hassan_number,hesn_upload, entered_by, confirmed_by, validated_by, visit_id, critical_status,\
            group_id, organism_type, bacteria_name, bacteria_type, V.visit_code, provider_id, LO.send_out_test,LO.send_in_test,\
            E.full_name as doctor_name, billed, service_id,  S.service_code, S.service_name, \
            LO.status, cancelled, provider_id, ordered_date, test_type, concat(V.age_in_years,'Y')years, \
            concat(V.age_in_months,'M')months, concat(V.age_in_days,'D')days, \
            lab_id_number, run_type, P.primary_id_no,P.patient_code,P.full_name,P.date_of_birth, P.gender,CONCAT(P.tel_code,P.contact_number) as contact_no, LS.sample_id, LS.container_id, \
            LS.collected, LS.collected_by, LS.remarks, LS.collected_date, LS.hims_d_lab_sample_id, \
            LS.status as sample_status, TC.test_section,DLS.urine_specimen, IT.hims_d_investigation_test_id,IT.isPCR,IT.culture_test, \
            case when LO.run_type='1' then '1 Time' when LO.run_type='2' then '2 Times' when LO.run_type='3' then '3 times' else '-' end as run_types, \
            LO.contaminated_culture, LS.barcode_gen, IT.auto_validate,\
            max(if(CL.algaeh_d_app_user_id=LO.entered_by, EM.full_name,'' )) as entered_by_name, \
            max(if(CL.algaeh_d_app_user_id=LO.confirmed_by, EM.full_name,'')) as confirm_by_name, \
            max(if(CL.algaeh_d_app_user_id=LO.validated_by, EM.full_name,'')) as validate_by_name,\
            max(if(CL.algaeh_d_app_user_id=LO.hassan_number_updated_by, EM.full_name,'')) as haasan_updated_by_name,\
            max(if(CL.algaeh_d_app_user_id=LO.hesn_upload_updated_by, EM.full_name,'')) as hesn_upload_updated_by_name,  \
            LO.entered_date,LO.confirmed_date,LO.validated_date, LO.credit_order  from hims_f_lab_order LO \
            inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'\
            inner join hims_f_patient_visit V on LO.visit_id=V.hims_f_patient_visit_id \
            inner join hims_d_investigation_test as IT on IT.hims_d_investigation_test_id = LO.test_id \
            inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'\
            left join hims_d_employee E on LO.provider_id=E.hims_d_employee_id and  E.record_status='A'\
            left outer join hims_f_lab_sample LS on  LO.hims_f_lab_order_id = LS.order_id  and LS.record_status='A' \
            left join hims_d_title as T on T.his_d_title_id = E.title_id \
            left join hims_d_lab_specimen as DLS on DLS.hims_d_lab_specimen_id = LS.sample_id \
            left join hims_d_test_category as TC on TC.hims_d_test_category_id = IT.category_id \
            left join algaeh_d_app_user CL on (CL.algaeh_d_app_user_id=LO.entered_by or \
            CL.algaeh_d_app_user_id=LO.validated_by or CL.algaeh_d_app_user_id=LO.confirmed_by or CL.algaeh_d_app_user_id=LO.hassan_number_updated_by or CL.algaeh_d_app_user_id=LO.hesn_upload_updated_by) \
            left join hims_d_employee EM on EM.hims_d_employee_id=CL.employee_id WHERE " +
            _stringData +
            " group by hims_f_lab_order_id order by hims_f_lab_order_id desc",
          values: inputValues,
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getLabOrderedServices: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputValues = [];
      let _stringData = "";

      _stringData += " LO.hospital_id=?";
      inputValues.push(req.userIdentity.hospital_id);

      if (req.query.from_date != null) {
        _stringData +=
          " and date(ordered_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        _stringData += " and date(ordered_date) <= date(now())";
      }

      if (req.query.hassanShow === "withhassan") {
        _stringData += " and LO.hassan_number is not null";
      }
      if (req.query.hassanShow === "withOuthassan") {
        _stringData += " and LO.hassan_number is null";
      }

      if (req.query.patient_id != null) {
        _stringData += " and LO.patient_id=?";
        inputValues.push(req.query.patient_id);
      }

      if (req.query.visit_id != null) {
        _stringData += " and LO.visit_id=?";
        inputValues.push(req.query.visit_id);
      }

      if (req.query.status != null) {
        _stringData += " and LO.status=?";
        inputValues.push(req.query.status);
      }

      if (req.query.sample_status != null) {
        _stringData += " and LS.status=?";
        inputValues.push(req.query.sample_status);
      }

      if (req.query.send_sms) {
        _stringData += " and LO.send_sms=?";
        inputValues.push(req.query.send_sms);
      }

      if (req.query.test_type != null) {
        _stringData += " and LO.test_type=?";
        inputValues.push(req.query.test_type);
      }

      // left join hims_d_employee E on LO.provider_id=E.hims_d_employee_id and  E.record_status='A'\
      // E.full_name as doctor_name

      _mysql
        .executeQuery({
          query:
            "SELECT hims_f_lab_order_id, test_id, service_id, LO.patient_id, primary_id_no, patient_code, P.full_name, \
            P.date_of_birth, P.gender, ordered_date, LS.barcode_gen,visit_code, LO.credit_order,\
            LO.status, test_type, visit_id, LO.lab_id_number, LS.status as sample_status,S.service_code, S.service_name,\
            case when LO.run_type='1' then '1 Time' when LO.run_type='2' then '2 Times' when LO.run_type='3' then '3 times' else '-' end as run_types, \
            hims_d_lab_sample_id, collected_by, collected_date, billed,sample_id, container_id, collected, hesn_upload, LO.send_in_test, LO.send_out_test, \
            LS.remarks, IT.isPCR, IT.auto_validate FROM hims_f_lab_order LO\
            inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'\
            INNER JOIN hims_f_patient P on P.hims_d_patient_id = LO.patient_id\
            INNER JOIN hims_f_patient_visit PV on PV.hims_f_patient_visit_id = LO.visit_id\
            LEFT JOIN hims_f_lab_sample LS on  LO.hims_f_lab_order_id = LS.order_id  and LS.record_status='A'\
            left join hims_d_lab_specimen as DLS on DLS.hims_d_lab_specimen_id = LS.sample_id \
            inner join hims_d_investigation_test as IT on IT.hims_d_investigation_test_id = LO.test_id \
            WHERE " +
            _stringData +
            " group by hims_f_lab_order_id order by hims_f_lab_order_id desc",
          values: inputValues,
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  patientPortalData: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputValues = req.query;

      _mysql
        .executeQuery({
          query: `select * from hims_f_portal_patient where  date(created_date) between date(?) AND date(?)`,
          values: [inputValues.from_date, inputValues.to_date],
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  updateLabOrderServiceForDoc: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      // let _mysql = options._mysql;

      // let inputParam = extend([], req.body.updatedeptDetails);
      let qry = "";

      let updateLabOrderDetails = req.body.updateArray;
      updateLabOrderDetails.map((item) => {
        qry += mysql.format(
          `update hims_f_lab_order set doctor_viewed=? where hims_f_lab_order_id=?;`,
          [item.doctor_viewed, item.hims_f_lab_order_id]
        );
      });

      _mysql
        .executeQuery({
          query: qry,
          bulkInsertOrUpdate: true,
          printQuery: true,
        })
        .then((result) => {
          req.records = result;
          _mysql.releaseConnection();
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getLabOrderServiceForDoc: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputData = req.query;
      let strQuery =
        " select hims_f_lab_order_id, LO.patient_id, entered_by, confirmed_by,LO.doctor_viewed, validated_by, LO.visit_id, critical_status,\
      group_id, organism_type, bacteria_name, bacteria_type, V.visit_code, provider_id, LO.send_out_test,\
      E.full_name as doctor_name, billed, service_id,  S.service_code, S.service_name, \
      LO.status, cancelled, provider_id, ordered_date, test_type, concat(V.age_in_years,'Y')years, \
      concat(V.age_in_months,'M')months, concat(V.age_in_days,'D')days, \
      lab_id_number, run_type, P.patient_code,P.full_name,P.date_of_birth, P.gender, LS.sample_id, LS.container_id, \
      LS.collected, LS.collected_by, LS.remarks, LS.collected_date, LS.hims_d_lab_sample_id, \
      LS.status as sample_status, TC.test_section,DLS.urine_specimen, IT.hims_d_investigation_test_id from hims_f_lab_order LO \
      inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'\
      inner join hims_f_patient_visit V on LO.visit_id=V.hims_f_patient_visit_id \
      inner join hims_d_employee E on LO.provider_id=E.hims_d_employee_id and  E.record_status='A'\
      inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'\
      left outer join hims_f_lab_sample LS on  LO.hims_f_lab_order_id = LS.order_id  and LS.record_status='A' \
      left join hims_d_title as T on T.his_d_title_id = E.title_id \
      left join hims_d_investigation_test as IT on IT.services_id = LO.service_id \
      left join hims_d_lab_specimen as DLS on DLS.hims_d_lab_specimen_id = LS.sample_id \
      left join hims_d_test_category as TC on TC.hims_d_test_category_id = IT.category_id WHERE  LO.status='V' and date(LO.validated_date) between date(?) and date(?)  ";

      if (inputData.provider_id !== null) {
        strQuery += " and LO.provider_id='" + inputData.provider_id + "'";
      }

      if (inputData.doctor_viewed) {
        strQuery += " and LO.doctor_viewed='" + inputData.doctor_viewed + "'";
      }

      _mysql
        .executeQuery({
          query: strQuery,
          values: [inputData.from_date, inputData.to_date],
          printQuery: true,
        })
        // const utilities = new algaehUtilities();
        // utilities.logger().log("getLabOrderedServices: ");
        //  let input=req.query.
        // utilities.logger().log("_stringData: ", _stringData);

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
  },
  getLabOrderedServicesPatient: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      // const utilities = new algaehUtilities();
      // utilities.logger().log("getLabOrderedServices: ");

      // utilities.logger().log("_stringData: ", _stringData);
      _mysql
        .executeQuery({
          query:
            " select hims_f_lab_order_id, LO.patient_id, entered_by, confirmed_by, validated_by, visit_id, critical_status,\
            group_id, organism_type, bacteria_name, bacteria_type, V.visit_code, provider_id, LO.send_out_test,\
            E.full_name as doctor_name, billed, service_id,  S.service_code, S.service_name, \
            LO.status, cancelled, provider_id, ordered_date, test_type, concat(V.age_in_years,'Y')years, \
            concat(V.age_in_months,'M')months, concat(V.age_in_days,'D')days, \
            lab_id_number, run_type, P.primary_id_no,P.patient_code,P.full_name,P.date_of_birth, P.gender, LS.sample_id, LS.container_id, \
            LS.collected, LS.collected_by, LS.remarks, LS.collected_date, LS.hims_d_lab_sample_id, \
            LS.status as sample_status, TC.test_section,DLS.urine_specimen, IT.hims_d_investigation_test_id from hims_f_lab_order LO \
            inner join hims_d_services S on LO.service_id=S.hims_d_services_id and S.record_status='A'\
            inner join hims_f_patient_visit V on LO.visit_id=V.hims_f_patient_visit_id \
            inner join hims_d_employee E on LO.provider_id=E.hims_d_employee_id and  E.record_status='A'\
            inner join hims_f_patient P on LO.patient_id=P.hims_d_patient_id and  P.record_status='A'\
            left outer join hims_f_lab_sample LS on  LO.hims_f_lab_order_id = LS.order_id  and LS.record_status='A' \
            left join hims_d_title as T on T.his_d_title_id = E.title_id \
            left join hims_d_investigation_test as IT on IT.services_id = LO.service_id \
            left join hims_d_lab_specimen as DLS on DLS.hims_d_lab_specimen_id = LS.sample_id \
            left join hims_d_test_category as TC on TC.hims_d_test_category_id = IT.category_id WHERE LO.hospital_id=?  and LO.patient_id=?  and LO.status=? order by hims_f_lab_order_id desc;",
          values: [
            req.userIdentity.hospital_id,
            req.query.patient_id,
            req.query.status,
          ],
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getLabOrderedComment: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            " select comments from hims_f_lab_order WHERE hims_f_lab_order_id = ?",
          values: [req.query.hims_f_lab_order_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result[0];
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
  },

  getHESNServices: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputValues = [];
      let _stringData = "";

      _stringData += " and LO.hospital_id=?";
      inputValues.push(req.userIdentity.hospital_id);

      if (req.query.from_date != null) {
        _stringData +=
          " and date(ordered_date) between date('" +
          req.query.from_date +
          "') AND date('" +
          req.query.to_date +
          "')";
      } else {
        _stringData += " and date(ordered_date) <= date(now())";
      }

      if (req.query.hassanShow === "withhassan") {
        _stringData += " and LO.hassan_number is not null";
      }
      if (req.query.hassanShow === "withOuthassan") {
        _stringData += " and LO.hassan_number is null";
      }
      _mysql
        .executeQuery({
          query:
            "select LO.ordered_date,LO.lab_id_number,LO.hassan_number,LO.hassan_number_updated_date, \
            LO.hesn_upload,LO.hesn_upload_updated_date,P.patient_code,P.full_name,P.primary_id_no, \
            INV.description,USR.user_display_name as hesn_no_updated_by,USRR.user_display_name as hesn_file_updated_by \
            from hims_f_lab_order LO \
            inner join hims_d_investigation_test INV on INV.hims_d_investigation_test_id=LO.test_id \
            inner join hims_f_patient P on P.hims_d_patient_id=LO.patient_id \
            left join algaeh_d_app_user USR on USR.algaeh_d_app_user_id=LO.hassan_number_updated_by \
            left join algaeh_d_app_user USRR on USRR.algaeh_d_app_user_id=LO.hesn_upload_updated_by WHERE INV.isPCR='Y' and LO.billed='Y' " +
            _stringData +
            ";",
          values: inputValues,
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  insertLadOrderedServices_BAKP_JAN_30_2020: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();

      let input = req.body;
      // let Services =
      //   req.records.ResultOfFetchOrderIds == null
      //     ? req.body.billdetails
      //     : req.records.ResultOfFetchOrderIds;
      const labServices = [
        ...new Set(
          new LINQ(req.body.billdetails)
            .Where(
              (w) =>
                w.service_type_id ==
                appsettings.hims_d_service_type.service_type_id.Lab
            )
            .Select((s) => {
              return {
                ordered_services_id: s.hims_f_ordered_services_id || null,
                ordered_package_id: s.ordered_package_id || null,
                patient_id: req.body.patient_id,
                provider_id: req.body.incharge_or_provider,
                visit_id: req.body.visit_id,
                service_id: s.services_id,
                billed: req.body.billed,
                ordered_date: s.created_date,
                test_type: s.test_type,
              };
            })
            .ToArray()
        ),
      ];

      const IncludeValues = [
        "ordered_services_id",
        "ordered_package_id",
        "patient_id",
        "visit_id",
        "provider_id",
        "service_id",
        "billed",
        "ordered_date",
        "test_type",
      ];

      if (labServices.length > 0) {
        _mysql
          .executeQuery({
            query: "INSERT IGNORE INTO hims_f_lab_order(??) VALUES ?",
            values: labServices,
            includeValues: IncludeValues,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              hospital_id: req.userIdentity.hospital_id,
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((insert_lab_order) => {
            const get_services_id = new LINQ(labServices)
              .Select((s) => {
                return s.service_id;
              })
              .ToArray();
            _mysql
              .executeQuery({
                query:
                  "select  hims_d_investigation_test_id from hims_d_investigation_test where record_status='A' and services_id in (?);\
                  select case when days<31 then 'D' when days<365 then 'M' else 'Y' end as age_type,\
                  TIMESTAMPDIFF(day, ?, curdate()) as days,\
                  TIMESTAMPDIFF(month, ?, curdate()) as months,\
                  TIMESTAMPDIFF(year, ?, curdate()) as years from \
                  (select  TIMESTAMPDIFF(day, ?, curdate()) as days) as a;",
                values: [
                  get_services_id,
                  input.date_of_birth,
                  input.date_of_birth,
                  input.date_of_birth,
                  input.date_of_birth,
                ],
                printQuery: true,
              })
              .then((results) => {
                let investigation_test = results[0];
                const age_data = results[1][0];
                const age_type = age_data["age_type"];
                let age = "";
                switch (age_type) {
                  case "D":
                    age = age_data["days"];

                    break;
                  case "M":
                    age = age_data["months"];
                    break;
                  case "Y":
                    age = age_data["years"];
                    break;
                }

                const test_id = new LINQ(investigation_test)
                  .Select((s) => {
                    return s.hims_d_investigation_test_id;
                  })
                  .ToArray();
                _mysql
                  .executeQuery({
                    query:
                      "select services_id, specimen_id, container_id FROM  hims_m_lab_specimen,hims_d_investigation_test \
                      where hims_d_investigation_test_id=hims_m_lab_specimen.test_id and \
                      hims_m_lab_specimen.record_status='A' and test_id in (?); \
                      select hims_f_lab_order_id,service_id from hims_f_lab_order where record_status='A' \
                      and visit_id =? and service_id in (?); \
                      select hims_d_investigation_test.services_id, analyte_type, result_unit, analyte_id, \
                      critical_low, critical_high, normal_low,normal_high from hims_d_investigation_test,  hims_m_lab_analyte where hims_d_investigation_test_id=hims_m_lab_analyte.test_id and \
                      hims_m_lab_analyte.record_status='A' and hims_m_lab_analyte.test_id in  (?) \
                      and gender=? and age_type=? and ? between from_age and to_age;",
                    values: [
                      test_id,
                      req.body.visit_id,
                      get_services_id,
                      test_id,
                      input.gender,
                      age_type,
                      age,
                    ],
                    printQuery: true,
                  })
                  .then((specimentRecords) => {
                    // if (
                    //   specimentRecords[0] == null ||
                    //   specimentRecords[0].length == 0
                    // ) {
                    //   _mysql.rollBackTransaction(() => {
                    //     next(
                    //       utilities
                    //         .httpStatus()
                    //         .generateError(
                    //           httpStatus.forbidden,
                    //           "No Specimen Avilable"
                    //         )
                    //     );
                    //   });
                    // }

                    const insertedLabSample = new LINQ(specimentRecords[0])
                      .Select((s) => {
                        return {
                          order_id: new LINQ(specimentRecords[1])
                            .Where((w) => w.service_id == s.services_id)
                            .FirstOrDefault().hims_f_lab_order_id,
                          sample_id: s.specimen_id,
                          container_id: s.container_id,
                        };
                      })
                      .ToArray();

                    const sample = ["order_id", "sample_id", "container_id"];

                    _mysql
                      .executeQuery({
                        query:
                          "INSERT IGNORE INTO hims_f_lab_sample(??) VALUES ?",
                        values: insertedLabSample,
                        includeValues: sample,
                        extraValues: {
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          hospital_id: req.userIdentity.hospital_id,
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: true,
                      })
                      .then((insert_lab_sample) => {
                        if (
                          specimentRecords[2] == null &&
                          specimentRecords[2].length == 0
                        ) {
                          _mysql.rollBackTransaction(() => {
                            next(
                              utilities
                                .httpStatus()
                                .generateError(
                                  httpStatus.forbidden,
                                  "No Analytes Avilable"
                                )
                            );
                          });
                        }

                        const analyts = [
                          "order_id",
                          "analyte_id",
                          "analyte_type",
                          "result_unit",
                          "critical_low",
                          "critical_high",
                          "normal_low",
                          "normal_high",
                        ];

                        const labAnalytes = new LINQ(specimentRecords[2])
                          .Select((s) => {
                            return {
                              analyte_id: s.analyte_id,
                              order_id: new LINQ(specimentRecords[1])
                                .Where((w) => w.service_id == s.services_id)
                                .FirstOrDefault().hims_f_lab_order_id,
                              analyte_type: s.analyte_type,
                              result_unit: s.result_unit,
                              critical_low: s.critical_low,
                              critical_high: s.critical_high,
                              normal_low: s.normal_low,
                              normal_high: s.normal_high,
                            };
                          })
                          .ToArray();

                        if (labAnalytes.length > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT IGNORE INTO hims_f_ord_analytes(??) VALUES ?",
                              values: labAnalytes,
                              includeValues: analyts,
                              extraValues: {
                                created_by:
                                  req.userIdentity.algaeh_d_app_user_id,
                                updated_by:
                                  req.userIdentity.algaeh_d_app_user_id,
                              },
                              bulkInsertOrUpdate: true,
                              printQuery: true,
                            })
                            .then((ord_analytes) => {
                              if (req.connection == null) {
                                // _mysql.commitTransaction(() => {
                                //   _mysql.releaseConnection();
                                req.records = ord_analytes;
                                next();
                                // });
                              } else {
                                next();
                              }
                            })
                            .catch((e) => {
                              _mysql.rollBackTransaction(() => {
                                next(e);
                              });
                            });
                        } else {
                          if (req.connection == null) {
                            // _mysql.commitTransaction(() => {
                            //   _mysql.releaseConnection();
                            req.records = insert_lab_sample;
                            next();
                            // });
                          } else {
                            next();
                          }
                        }
                      })
                      .catch((e) => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  })
                  .catch((e) => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  //Recreated by Irfan:
  insertLadOrderedServices: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let Services =
        req.records.ResultOfFetchOrderIds == null
          ? req.body.billdetails
          : req.records.ResultOfFetchOrderIds;

      const labServices = Services.filter(
        (f) =>
          f.service_type_id ==
          appsettings.hims_d_service_type.service_type_id.Lab
      ).map((s) => {
        return {
          ordered_services_id: s.hims_f_ordered_services_id || null,
          ordered_package_id: s.ordered_package_id || null,
          billing_header_id: req.body.hims_f_billing_header_id || null,
          patient_id: req.body.patient_id,
          provider_id: req.body.incharge_or_provider,
          visit_id: req.body.visit_id,
          service_id: s.services_id,
          billed: req.body.billed,
          ordered_date: s.created_date,
          test_type: s.test_type,
          test_id: s.test_id,
          send_out_test: s.send_out_test === "Y" ? "Y" : "N",
          credit_order: parseFloat(req.body.credit_amount) > 0 ? "Y" : "N",
        };
      });

      if (labServices.length > 0) {
        const IncludeValues = [
          "ordered_services_id",
          "ordered_package_id",
          "billing_header_id",
          "patient_id",
          "visit_id",
          "provider_id",
          "service_id",
          "billed",
          "ordered_date",
          "test_type",
          "test_id",
          "credit_order",
          "send_out_test",
        ];

        _mysql
          .executeQuery({
            query: "INSERT IGNORE INTO hims_f_lab_order(??) VALUES ?",
            values: labServices,
            includeValues: IncludeValues,
            extraValues: {
              created_by: req.userIdentity.algaeh_d_app_user_id,
              updated_by: req.userIdentity.algaeh_d_app_user_id,
              hospital_id: req.userIdentity.hospital_id,
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((insert_lab_order) => {
            const get_services_id = labServices.map((s) => {
              return s.service_id;
            });
            _mysql
              .executeQuery({
                query:
                  "SELECT T.hims_d_investigation_test_id,T.description ,C.test_section \
                  FROM hims_d_investigation_test T inner join  hims_d_test_category C on \
                  T.category_id=C.hims_d_test_category_id and T.services_id in (?) \
                  group by T.hims_d_investigation_test_id;",
                values: [get_services_id],
                printQuery: true,
              })
              .then((investigation_test) => {
                let invst_test = [];
                if (investigation_test.length > 0) {
                  invst_test = investigation_test;
                }
                // const no_analyte = invst_test.find((f) => {
                //   return f.test_section != "M" && f.analyte_id == null;
                // });
                // if (no_analyte) {
                //   _mysql.rollBackTransaction(() => {
                //     next(
                //       httpStatus.generateError(
                //         httpStatus.forbidden,
                //         "Analytes not deifined for the test :" +
                //         no_analyte["description"]
                //       )
                //     );
                //   });
                // } else {
                const test_id = invst_test.map((s) => {
                  return s.hims_d_investigation_test_id;
                });

                _mysql
                  .executeQuery({
                    query:
                      "select services_id,specimen_id,test_id, container_id FROM  hims_m_lab_specimen,hims_d_investigation_test \
                    where hims_d_investigation_test_id=hims_m_lab_specimen.test_id and \
                    hims_m_lab_specimen.record_status='A' and test_id in (?); \
                    select hims_f_lab_order_id,service_id from hims_f_lab_order where record_status='A' \
                    and visit_id =? and service_id in (?);",
                    values: [test_id, req.body.visit_id, get_services_id],
                    printQuery: true,
                  })
                  .then((specimentRecords) => {
                    if (specimentRecords[0].length > 0) {
                      const specimen_list = specimentRecords[0];
                      const lab_orders = specimentRecords[1];
                      const inserteLabSample = [];

                      lab_orders.forEach((ord) => {
                        let temp = specimen_list
                          .filter((f) => {
                            return f.services_id == ord.service_id;
                          })
                          .map((m) => {
                            return {
                              sample_id: m.specimen_id,
                              container_id: m.container_id,
                              test_id: m.test_id,
                              order_id: ord.hims_f_lab_order_id,
                            };
                          });
                        inserteLabSample.push(...temp);
                      });

                      const sample = ["order_id", "sample_id", "container_id"];

                      _mysql
                        .executeQuery({
                          query:
                            "INSERT IGNORE INTO hims_f_lab_sample(??) VALUES ?",
                          values: inserteLabSample,
                          includeValues: sample,
                          extraValues: {
                            created_by: req.userIdentity.algaeh_d_app_user_id,
                            updated_by: req.userIdentity.algaeh_d_app_user_id,
                            hospital_id: req.userIdentity.hospital_id,
                          },
                          bulkInsertOrUpdate: true,
                          printQuery: true,
                        })
                        .then((insert_lab_sample) => {
                          if (req.connection == null) {
                            req.records = insert_lab_sample;
                            next();
                          } else {
                            next();
                          }
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    } else {
                      if (req.connection == null) {
                        req.records = insert_lab_sample;
                        next();
                      } else {
                        next();
                      }
                      // _mysql.rollBackTransaction(() => {
                      //   next(new Error("No Specimen Avilable"));
                      // });
                    }
                  })
                  .catch((e) => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
                // }
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  generateBarCode: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      let _date = new Date();
      _date = moment(_date).format("YYYY-MM-DD");
      return new Promise((resolve, reject) => {
        let strQuery = "";
        if (inputParam.hims_d_lab_sample_id === null) {
          strQuery = mysql.format(
            "SELECT hims_d_lab_container_id AS container_id, container_id AS container_code \
            FROM hims_d_lab_container WHERE hims_d_lab_container_id=?; \
            SELECT lab_location_code from hims_d_hospital where hims_d_hospital_id=?;",
            [inputParam.container_id, inputParam.hims_d_hospital_id]
          );
        } else {
          strQuery = mysql.format(
            "SELECT distinct LS.container_id, LC.container_id as container_code FROM hims_m_lab_specimen LS \
          inner join hims_d_investigation_test IT on IT.hims_d_investigation_test_id = LS.test_id \
          inner join hims_d_lab_container LC on LC.hims_d_lab_container_id = LS.container_id \
          where IT.services_id=?;\
          SELECT lab_location_code from hims_d_hospital where hims_d_hospital_id=?;",
            [inputParam.service_id, inputParam.hims_d_hospital_id]
          );
        }

        _mysql
          .executeQueryWithTransaction({
            query: strQuery,
            printQuery: true,
          })
          .then((update_lab_sample) => {
            inputParam.container_id = update_lab_sample[0][0].container_id;
            inputParam.container_code = update_lab_sample[0][0].container_code;
            inputParam.lab_location_code =
              update_lab_sample[1][0].lab_location_code;
            resolve(update_lab_sample);
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
              reject(e);
            });
          });
      })
        .then((result) => {
          let _date = new Date();
          _date = moment(_date).format("YYYY-MM-DD");
          return new Promise((resolve, reject) => {
            _mysql
              .executeQuery({
                query:
                  "select number,hims_m_hospital_container_mapping_id from hims_m_hospital_container_mapping \
                  where hospital_id =? and container_id=? and date =?",
                values: [
                  inputParam.hims_d_hospital_id,
                  inputParam.container_id,
                  _date,
                ],
                printQuery: true,
              })
              .then((container_mapping) => {
                resolve(container_mapping);
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                  reject(e);
                });
              });
          }).then((record) => {
            let query = "";
            let condition = [];
            let padNum = "";
            let _newNumber = 1;
            if (record != null && record.length > 0) {
              _newNumber = parseInt(record[0].number, 10);
              _newNumber = _newNumber + 1;
              padNum = pad(String(_newNumber), 3, "LEFT", "0");
              condition.push(
                _newNumber,
                req.userIdentity.algaeh_d_app_user_id,
                record[0].hims_m_hospital_container_mapping_id
              );

              condition.push;
              query =
                "Update hims_m_hospital_container_mapping set number =?,updated_by=?,updated_date=now() \
            where hims_m_hospital_container_mapping_id =?";
            } else {
              condition.push(
                inputParam.hims_d_hospital_id,
                inputParam.container_id,
                _date,
                1,
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.algaeh_d_app_user_id
              );

              query =
                "insert into hims_m_hospital_container_mapping (`hospital_id`,`container_id`,`date`,\
            `number`,`created_by`,`updated_by`) values (?,?,?,?,?,?)";
            }

            padNum = pad(String(_newNumber), 3, "LEFT", "0");
            const dayOfYear = moment().dayOfYear();
            const labIdNumber =
              inputParam.lab_location_code +
              moment().format("YY") +
              dayOfYear +
              inputParam.container_code +
              padNum;

            _mysql
              .executeQuery({
                query:
                  query +
                  ";update hims_f_lab_order set lab_id_number ='" +
                  labIdNumber +
                  "' ,barcode_gen = now() where hims_f_lab_order_id=" +
                  inputParam.hims_f_lab_order_id,
                values: condition,
                printQuery: true,
              })
              .then((result) => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    lab_id_number: labIdNumber,
                  };
                  next();
                });
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          });
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      // _mysql.releaseConnection();
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateHassanNo: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let inputParam = { ...req.body };
      // cancelled

      let strQuery = "";
      if (inputParam.isDirty === true) {
        strQuery += `,hassan_number_updated_date='${moment(new Date()).format(
          "YYYY-MM-DD HH:mm:ss"
        )}',hassan_number_updated_by=${
          req["userIdentity"].algaeh_d_app_user_id
        } `;
      }
      if (inputParam.isDirtyUpdate === true) {
        strQuery += `,hesn_upload_updated_date='${moment(new Date()).format(
          "YYYY-MM-DD HH:mm:ss"
        )}',hesn_upload_updated_by=${
          req["userIdentity"].algaeh_d_app_user_id
        } `;
      }
      _mysql
        .executeQuery({
          query: `update hims_f_lab_order set hassan_number=?,hesn_upload=? ${strQuery} where hims_f_lab_order_id=?;`,
          values: [
            inputParam.hassan_number,
            inputParam.hesn_upload,

            inputParam.hims_f_lab_order_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          req.records = result;
          _mysql.releaseConnection();
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
  },

  getOrderByTestCategory: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "  date(LO.ordered_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `  SELECT L.category_id,T.category_name,L.description FROM hims_f_lab_order as LO
          inner join hims_d_investigation_test L on L.hims_d_investigation_test_id=LO.test_id
          inner join hims_d_test_category T on T.hims_d_test_category_id=L.category_id
          where ${_stringData}`,

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          const arrangedData = _.chain(result)
            .groupBy((g) => g.category_id)
            .map((details, key) => {
              const { category_name } = _.head(details);

              return {
                category_name: category_name,
                detailsOf: details,
              };
            })
            .value();
          req.records = arrangedData;
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
  },
  getSendInAndSendOutTestDetails: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "  date(ordered_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: ` SELECT ordered_date,send_out_test,hims_f_lab_order_id FROM hims_f_lab_order where ${_stringData} ;`,

          printQuery: true,
        })
        .then((result) => {
          const arrangedData = _.chain(result)
            .groupBy((g) => moment(g.ordered_date).format("YYYY-MM-DD"))
            .map((details, key) => {
              const { ordered_date } = _.head(details);
              return {
                date: ordered_date,
                detailsOf: _.chain(details)
                  .groupBy((it) => it.send_out_test)
                  .map((detail, index) => {
                    const { send_out_test } = _.head(detail);
                    return {
                      send_out_test: send_out_test,
                      detail: detail,
                      date: ordered_date,
                    };
                  })
                  .value(),
              };
            })
            .value();
          req.records = arrangedData;
          _mysql.releaseConnection();
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
  },
  top10LabOrders: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let _stringData = "";
      const input = req.query;

      if (input.from_date != null) {
        _stringData +=
          "  date(ordered_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      }

      _mysql
        .executeQuery({
          query: `SELECT LO.service_id,S.service_name, count(LO.service_id) as service_count FROM hims_f_lab_order as LO
          inner join hims_d_services S on S.hims_d_services_id=LO.service_id
          where ${_stringData} group by LO.service_id order by service_count DESC limit 0,10;`,

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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getTestAnalytes: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: `SELECT 
          EMO.full_name as ordered_by_name,
          max(if(CL.algaeh_d_app_user_id=LB.entered_by, EM.full_name,'' )) as entered_by_name,
          max(if(CL.algaeh_d_app_user_id=LB.confirmed_by, EM.full_name,'')) as confirm_by_name,
          max(if(CL.algaeh_d_app_user_id=LB.validated_by, EM.full_name,'')) as validate_by_name,
          LB.entered_by,LB.confirmed_by,LB.validated_by,
          LO.*,LB.service_id,
          LO.text_value as val_text_value, LA.description,max(if(LM.formula is not null,LM.formula,null)) as formula,
          max(if(LM.display_formula is not null,LM.display_formula,null)) as display_formula,
          max(if(LM.decimals is not null,LM.decimals,null)) as decimals,
          LB.ordered_date, LB.entered_date, LB.confirmed_date, LB.validated_date from hims_f_ord_analytes LO
          inner join hims_d_lab_analytes LA on LA.hims_d_lab_analytes_id = LO.analyte_id
          inner join hims_f_lab_order LB on LB.hims_f_lab_order_id = LO.order_id
          inner join hims_m_lab_analyte as LM on LM.analyte_id = LA.hims_d_lab_analytes_id
          left join algaeh_d_app_user CL on (CL.algaeh_d_app_user_id=LB.entered_by or 
            CL.algaeh_d_app_user_id=LB.validated_by or CL.algaeh_d_app_user_id=LB.confirmed_by)
          left join hims_d_employee EM on EM.hims_d_employee_id=CL.employee_id
          left join hims_d_employee EMO on EMO.hims_d_employee_id=LB.provider_id
          where LO.record_status='A'  AND LO.order_id=? group by LO.analyte_id order by LO.hims_f_ord_analytes_id;`,
          //             SELECT if(CL.algaeh_d_app_user_id=LO.entered_by, EM.full_name,'' ) as entered_by_name,if(CL.algaeh_d_app_user_id=LO.confirm_by, EM.full_name,'') as confirm_by_name,
          // if(CL.algaeh_d_app_user_id=LO.validate_by, EM.full_name,'') as validate_by_name,LO.*, LA.description from hims_f_ord_analytes LO
          // inner join hims_d_lab_analytes LA on LA.hims_d_lab_analytes_id = LO.analyte_id
          // LEFT join algaeh_d_app_user CL on (CL.algaeh_d_app_user_id=LO.entered_by or CL.algaeh_d_app_user_id=LO.validate_by or CL.algaeh_d_app_user_id=LO.confirm_by)
          // LEFT join hims_d_employee EM on EM.hims_d_employee_id=CL.employee_id
          // where LO.record_status='A' AND LO.order_id=354 order by LO.hims_f_ord_analytes_id; changed by suhail
          values: [req.query.order_id],
          printQuery: true,
        })
        .then((result) => {
          console.log("result", result);
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
  },
  getMicroDetails: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: ` SELECT  EMO.full_name as ordered_by_name,
          max(if(CL.algaeh_d_app_user_id=LB.entered_by, EM.full_name,'' )) as entered_by_name,
          max(if(CL.algaeh_d_app_user_id=LB.confirmed_by, EM.full_name,'')) as confirm_by_name,
          max(if(CL.algaeh_d_app_user_id=LB.validated_by, EM.full_name,'')) as validate_by_name,
          LB.entered_by,LB.confirmed_by,LB.validated_by
          from hims_f_lab_order LB
          left join algaeh_d_app_user CL on (CL.algaeh_d_app_user_id=LB.entered_by or 
            CL.algaeh_d_app_user_id=LB.validated_by or CL.algaeh_d_app_user_id=LB.confirmed_by)
          left join hims_d_employee EM on EM.hims_d_employee_id=CL.employee_id
          left join hims_d_employee EMO on EMO.hims_d_employee_id=LB.provider_id
          where LB.record_status='A'  AND LB.hims_f_lab_order_id=?;`,
          values: [req.query.order_id],
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  getAnalytesByTestID: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: `SELECT la.description,la.hims_d_lab_analytes_id from  hims_d_lab_analytes la, hims_m_lab_analyte MAP  where 
          la.hims_d_lab_analytes_id = MAP.analyte_id and MAP.test_id=?`,
          values: [req.query.test_id],
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getInvestigationResult: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const { patient_id, service_id } = req.query;
      _mysql
        .executeQuery({
          query: `select * from hims_f_lab_order L inner join hims_f_ord_analytes O on L.hims_f_lab_order_id =O.order_id
        inner join hims_d_lab_analytes LA on LA.hims_d_lab_analytes_id =O.analyte_id where L.service_id=? and L.patient_id=? and LA.analyte_type='QN';`,
          values: [service_id, patient_id],
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  getMicroResult: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT MR.*,A.antibiotic_name from hims_f_micro_result MR, hims_d_antibiotic A where  \
           A.hims_d_antibiotic_id = MR.antibiotic_id AND order_id=?",
          values: [req.query.order_id],
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  updateLabSampleStatus: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };
      let collected = ",";
      let strHisQry = "";
      if (input.status == "R") {
        collected = ", collected='N' ,";

        strHisQry = mysql.format(
          "insert into hims_f_sample_can_history (`order_id`,`sample_id`, \
          `lab_sample_id`,`patient_id`,`visit_id`, `remarks`, `barcode_gen`,`rejected_by`, `rejected_date`) \
          values (?,?,?,?,?,?,?,?,?);",
          [
            input.order_id,
            input.sample_id,
            input.hims_d_lab_sample_id,
            input.patient_id,
            input.visit_id,
            input.remarks,
            input.barcode_gen,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
          ]
        );
      }
      let queryBuilder =
        "update hims_f_lab_sample set `status`=?" +
        collected +
        "remarks=?,updated_date=?,updated_by=? where hims_d_lab_sample_id=?;";

      queryBuilder += mysql.format(
        "select case when days<31 then 'D' when days<365 then 'M' else 'Y' end as age_type,\
                  TIMESTAMPDIFF(day, ?, curdate()) as days,\
                  TIMESTAMPDIFF(month, ?, curdate()) as months,\
                  TIMESTAMPDIFF(year, ?, curdate()) as years from \
                  (select  TIMESTAMPDIFF(day, ?, curdate()) as days) as a;",
        [
          req.body.date_of_birth,
          req.body.date_of_birth,
          req.body.date_of_birth,
          req.body.date_of_birth,
        ]
      );

      let inputs = [
        input.status,
        input.remarks,
        new Date(),
        input.updated_by,
        input.hims_d_lab_sample_id,
      ];
      _mysql
        .executeQueryWithTransaction({
          query: queryBuilder + strHisQry,
          values: inputs,
          printQuery: true,
        })
        .then((results) => {
          if (input.status == "R") {
            _mysql
              .executeQuery({
                query:
                  "UPDATE `hims_f_lab_order` SET `status`='O',updated_date=?,updated_by=?  WHERE `hims_f_lab_order_id`=?;\
                  SELECT L.service_id, visit_code, primary_id_no FROM hims_f_lab_order L \
                  INNER JOIN hims_f_patient P ON P.hims_d_patient_id=L.patient_id\
                  INNER JOIN hims_f_patient_visit PV ON PV.hims_f_patient_visit_id=L.visit_id \
                  where hims_f_lab_order_id = ?;",
                values: [
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  input.order_id,
                  input.order_id,
                ],
                printQuery: true,
              })
              .then(async (lab_order) => {
                if (input.portal_exists === "Y") {
                  const portal_input = lab_order[1][0];
                  const portal_data = {
                    service_id: portal_input.service_id,
                    visit_code: portal_input.visit_code,
                    patient_identity: portal_input.primary_id_no,
                    service_status: "ORDERED",
                  };

                  console.log("portal_data", portal_data);
                  // consol.log("portal_data", portal_data);

                  await axios
                    .post(
                      `${PORTAL_HOST}/info/deletePatientService`,
                      portal_data
                    )
                    .catch((e) => {
                      throw e;
                    });
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = lab_order;
                    next();
                  });
                } else {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = lab_order;
                    next();
                  });
                }
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            const age_data = results[1][0];
            const age_type = age_data["age_type"];
            let age = "";
            switch (age_type) {
              case "D":
                age = age_data["days"];

                break;
              case "M":
                age = age_data["months"];
                break;
              case "Y":
                age = age_data["years"];
                break;
            }

            _mysql
              .executeQuery({
                query:
                  "select hims_m_lab_analyte_id,test_id,M.analyte_id, R.gender, R.age_type, R.from_age,\
                    R.to_age, R.critical_value_req, R.critical_low,  R.critical_high, R.normal_low, R.normal_high ,\
                    R.normal_qualitative_value,R.text_value ,A.analyte_type,A.result_unit from hims_m_lab_analyte  M \
                    left join hims_d_lab_analytes A on M.analyte_id=A.hims_d_lab_analytes_id\
                    left join  hims_d_lab_analytes_range R on  M.analyte_id=R.analyte_id\
                    and (R.gender=? or R.gender='BOTH') and (R.age_type=? or R.age_type='Y') and ? between R.from_age and R.to_age\
                    where M.test_id in(?) order by display_order;",
                values: [req.body.gender, age_type, age, input.test_id],
                printQuery: true,
              })
              .then((all_analytes) => {
                if (all_analytes.length > 0) {
                  const analyts = [
                    "order_id",
                    "analyte_id",
                    "analyte_type",
                    "result_unit",
                    "critical_value_req",
                    "critical_low",
                    "critical_high",
                    "normal_low",
                    "normal_high",
                    "text_value",
                    "normal_qualitative_value",
                  ];
                  _mysql
                    .executeQuery({
                      query:
                        "INSERT IGNORE INTO hims_f_ord_analytes(??) VALUES ? \
                        ON DUPLICATE KEY UPDATE normal_low=values(normal_low),normal_high=values(normal_high), \
                        critical_value_req = values(critical_value_req), critical_low=values(critical_low), critical_high=values(critical_high), text_value=values(text_value)",
                      values: all_analytes,
                      includeValues: analyts,
                      extraValues: {
                        created_by: req.userIdentity.algaeh_d_app_user_id,
                        updated_by: req.userIdentity.algaeh_d_app_user_id,
                        order_id: input.order_id,
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true,
                    })
                    .then((ord_analytes) => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = ord_analytes;
                        next();
                      });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = results[0];
                    next();
                  });
                }
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          }
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  reloadAnalytesMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const input = { ...req.body };

      _mysql
        .executeQueryWithTransaction({
          query:
            "select case when days<31 then 'D' when days<365 then 'M' else 'Y' end as age_type,\
          TIMESTAMPDIFF(day, ?, curdate()) as days,\
          TIMESTAMPDIFF(month, ?, curdate()) as months,\
          TIMESTAMPDIFF(year, ?, curdate()) as years from \
          (select  TIMESTAMPDIFF(day, ?, curdate()) as days) as a;",
          values: [
            input.date_of_birth,
            input.date_of_birth,
            input.date_of_birth,
            input.date_of_birth,
          ],
          printQuery: true,
        })
        .then((results) => {
          const age_data = results[0];
          const age_type = age_data["age_type"];
          let age = "";
          switch (age_type) {
            case "D":
              age = age_data["days"];

              break;
            case "M":
              age = age_data["months"];
              break;
            case "Y":
              age = age_data["years"];
              break;
          }

          _mysql
            .executeQuery({
              query:
                "select hims_m_lab_analyte_id,test_id,M.analyte_id, R.gender, R.age_type, R.from_age,\
                    R.to_age, R.critical_value_req, R.critical_low,  R.critical_high, R.normal_low, R.normal_high ,\
                    R.normal_qualitative_value,R.text_value ,A.analyte_type,A.result_unit from hims_m_lab_analyte  M \
                    left join hims_d_lab_analytes A on M.analyte_id=A.hims_d_lab_analytes_id\
                    left join  hims_d_lab_analytes_range R on  M.analyte_id=R.analyte_id\
                    and (R.gender=? or R.gender='BOTH') and (R.age_type=? or R.age_type='Y') and ? between R.from_age and R.to_age\
                    where M.test_id in(?);",
              values: [input.gender, age_type, age, input.test_id],
              printQuery: true,
            })
            .then((all_analytes) => {
              if (all_analytes.length > 0) {
                const analyts = [
                  "order_id",
                  "analyte_id",
                  "analyte_type",
                  "result_unit",
                  "critical_value_req",
                  "critical_low",
                  "critical_high",
                  "normal_low",
                  "normal_high",
                  "text_value",
                  "normal_qualitative_value",
                ];
                _mysql
                  .executeQuery({
                    query:
                      "INSERT IGNORE INTO hims_f_ord_analytes(??) VALUES ? \
                        ON DUPLICATE KEY UPDATE analyte_type=values(analyte_type), normal_low=values(normal_low),normal_high=values(normal_high), \
                        critical_value_req = values(critical_value_req), critical_low=values(critical_low), critical_high=values(critical_high), text_value=values(text_value)",
                    values: all_analytes,
                    includeValues: analyts,
                    extraValues: {
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_by: req.userIdentity.algaeh_d_app_user_id,
                      order_id: input.order_id,
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true,
                  })
                  .then((ord_analytes) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = ord_analytes;
                      next();
                    });
                  })
                  .catch((e) => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              } else {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = results[0];
                  next();
                });
              }
            })
            .catch((error) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateLabResultEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    try {
      let inputParam = req.body;

      let status_C = new LINQ(inputParam)
        .Where((w) => w.status == "C")
        .ToArray().length;
      let status_V = new LINQ(inputParam)
        .Where((w) => w.status == "V")
        .ToArray().length;

      let status_AV = new LINQ(inputParam)
        .Where((w) => w.status == "AV")
        .ToArray().length;

      let status_N = new LINQ(inputParam)
        .Where((w) => w.status == "N")
        .ToArray().length;

      let status_E = new LINQ(inputParam)
        .Where((w) => w.status == "E")
        .ToArray().length;
      utilities.logger().log("runtype: ");

      let { runtype } = inputParam[inputParam.length - 1];

      let ref = null;
      let entered_by = null;
      let confirmed_by = null;
      let validated_by = null;
      let strQuery = "",
        strAnaQry = "";
      switch (inputParam.length - 1) {
        case status_C:
          //Do functionality for C here
          ref = "CF";
          confirmed_by = req.userIdentity.algaeh_d_app_user_id;
          strQuery +=
            ", confirmed_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', confirmed_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "'  ";

          strAnaQry +=
            ", confirm_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', confirmed_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "'  ";
          break;

        case status_V:
          //Do functionality for V here
          ref = "V";
          validated_by = req.userIdentity.algaeh_d_app_user_id;
          strQuery +=
            ", validated_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', validated_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "'  ";

          strAnaQry +=
            ", validate_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', validated_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "'  ";
          break;
        case status_AV:
          //Do functionality for V here
          ref = "V";
          validated_by = req.userIdentity.algaeh_d_app_user_id;
          confirmed_by = req.userIdentity.algaeh_d_app_user_id;
          strQuery +=
            ", confirmed_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', confirmed_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "', validated_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', validated_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "'";

          strAnaQry +=
            ", confirm_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', confirmed_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "' , validate_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', validated_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "'  ";
          break;

        case status_N:
          //Do functionality for CL here
          ref = "CL";
          break;

        case status_E:
          ref = "CL";
          entered_by = req.userIdentity.algaeh_d_app_user_id;
          strQuery +=
            ", entered_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', entered_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "' ";
          strAnaQry +=
            ", entered_by='" +
            req.userIdentity.algaeh_d_app_user_id +
            "', entered_date = '" +
            moment().format("YYYY-MM-DD HH:mm") +
            "' ";
          break;
        default:
          ref = null;
      }

      utilities.logger().log("ref: ", ref);

      let qry = "";

      for (let i = 0; i < req.body.length; i++) {
        qry += mysql.format(
          "UPDATE `hims_f_ord_analytes` SET result_unit=?, result=?,\
        `status`=?,`remarks`=?,`run1`=?,`run2`=?,`run3`=?,`critical_type`=?, \
          amended=?,amended_date=?,normal_low=?, normal_high=?, text_value=?,\
          updated_date=?,updated_by=? " +
            strAnaQry +
            " where order_id=? AND hims_f_ord_analytes_id=?;",
          [
            inputParam[i].result_unit,
            inputParam[i].result,
            inputParam[i].status === "AV" ? "V" : inputParam[i].status,
            inputParam[i].remarks,
            inputParam[i].run1,
            inputParam[i].run2,
            inputParam[i].run3,
            inputParam[i].critical_type,
            inputParam[i].amended,
            inputParam[i].amended === "Y"
              ? moment().format("YYYY-MM-DD HH:mm")
              : null,
            inputParam[i].normal_low,
            inputParam[i].normal_high,
            inputParam[i].val_text_value,
            moment().format("YYYY-MM-DD HH:mm"),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam[i].order_id,
            inputParam[i].hims_f_ord_analytes_id,
          ]
        );
      }

      _mysql
        .executeQuery({
          query: qry,
          printQuery: true,
        })
        .then((results) => {
          if (results != null && ref != null) {
            _mysql
              .executeQuery({
                query:
                  "update hims_f_lab_order set `status`=?, run_type=?, updated_date= ?, updated_by=?, comments=?, `critical_status`=? " +
                  strQuery +
                  " where hims_f_lab_order_id=?; ",
                values: [
                  ref,
                  String(runtype),
                  moment().format("YYYY-MM-DD HH:mm"),
                  req.userIdentity.algaeh_d_app_user_id,
                  inputParam[0].comments,
                  inputParam[0].critical_status,
                  inputParam[0].order_id,
                ],
                printQuery: true,
              })
              .then(async (update_lab_order) => {
                console.log("portal_exists", inputParam[0].portal_exists);
                console.log("ref", ref);
                if (
                  inputParam[0].portal_exists === "Y" &&
                  (ref === "N" || ref === "CF" || ref === "V")
                ) {
                  const portal_data = {
                    service_id: inputParam[0].service_id,
                    visit_code: inputParam[0].visit_code,
                    patient_identity: inputParam[0].primary_id_no,
                    service_status:
                      ref === "CF"
                        ? "RESULT CONFIRMED"
                        : ref === "V"
                        ? "RESULT VALIDATED"
                        : "SAMPLE COLLECTED",
                  };

                  console.log("portal_data", portal_data);
                  // consol.log("portal_data", portal_data);
                  await axios
                    .post(
                      `${PORTAL_HOST}/info/deletePatientService`,
                      portal_data
                    )
                    .catch((e) => {
                      throw e;
                    });
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      results,
                      entered_by: entered_by,
                      confirmed_by: confirmed_by,
                      validated_by: validated_by,
                    };
                    next();
                  });
                } else {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {
                      results,
                      entered_by: entered_by,
                      confirmed_by: confirmed_by,
                      validated_by: validated_by,
                    };
                    next();
                  });
                }
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = {
                results,
                entered_by: entered_by,
                confirmed_by: confirmed_by,
                validated_by: validated_by,
              };
              next();
            });
          }
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateMicroResultEntry: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let inputParam = req.body;

      let qry = {
        query: "select 1=1;",
        printQuery: true,
      };
      let entered_by = null;
      let confirmed_by = null;
      let validated_by = null;
      let strQuery = "";
      let updateQuery = "";

      if (inputParam.status == "E") {
        if (inputParam.bacteria_type === "G") {
          if (inputParam.data_exists == true) {
            for (let i = 0; i < inputParam.microAntbiotic.length; i++) {
              updateQuery += mysql.format(
                "UPDATE `hims_f_micro_result` SET susceptible=?,\
            `intermediate`=?,`resistant`=? where hims_f_micro_result_id=?;",
                [
                  inputParam.microAntbiotic[i].susceptible,
                  inputParam.microAntbiotic[i].intermediate,
                  inputParam.microAntbiotic[i].resistant,
                  inputParam.microAntbiotic[i].hims_f_micro_result_id,
                ]
              );
            }
            qry = {
              query: updateQuery,
              printQuery: true,
            };
          } else {
            let insertedValues = [
              "antibiotic_id",
              "susceptible",
              "intermediate",
              "resistant",
            ];
            qry = {
              query: "INSERT INTO hims_f_micro_result(??) VALUES ?",
              values: inputParam.microAntbiotic,
              includeValues: insertedValues,
              extraValues: {
                order_id: inputParam.hims_f_lab_order_id,
              },
              bulkInsertOrUpdate: true,
              printQuery: true,
            };
          }
        }
        entered_by = req.userIdentity.algaeh_d_app_user_id;
        strQuery +=
          " ,status = 'CL', entered_by='" +
          req.userIdentity.algaeh_d_app_user_id +
          "', entered_date = '" +
          moment().format("YYYY-MM-DD HH:mm") +
          "' ";
      } else if (inputParam.status == "CF") {
        if (inputParam.bacteria_type === "G") {
          for (let i = 0; i < inputParam.microAntbiotic.length; i++) {
            updateQuery += mysql.format(
              "UPDATE `hims_f_micro_result` SET susceptible=?,\
          `intermediate`=?,`resistant`=? where hims_f_micro_result_id=?;",
              [
                inputParam.microAntbiotic[i].susceptible,
                inputParam.microAntbiotic[i].intermediate,
                inputParam.microAntbiotic[i].resistant,
                inputParam.microAntbiotic[i].hims_f_micro_result_id,
              ]
            );
          }
          qry = {
            query: updateQuery,
            printQuery: true,
          };
        }
        confirmed_by = req.userIdentity.algaeh_d_app_user_id;
        strQuery +=
          " ,status = 'CF', confirmed_by='" +
          req.userIdentity.algaeh_d_app_user_id +
          "', confirmed_date = '" +
          moment().format("YYYY-MM-DD HH:mm") +
          "'  ";
      } else if (inputParam.status == "V" || inputParam.status == "AV") {
        if (inputParam.bacteria_type === "G") {
          for (let i = 0; i < inputParam.microAntbiotic.length; i++) {
            updateQuery += mysql.format(
              "UPDATE `hims_f_micro_result` SET susceptible=?,\
          `intermediate`=?,`resistant`=? where hims_f_micro_result_id=?;",
              [
                inputParam.microAntbiotic[i].susceptible,
                inputParam.microAntbiotic[i].intermediate,
                inputParam.microAntbiotic[i].resistant,
                inputParam.microAntbiotic[i].hims_f_micro_result_id,
              ]
            );
          }
          qry = {
            query: updateQuery,
            printQuery: true,
          };
        }
        validated_by = req.userIdentity.algaeh_d_app_user_id;
        strQuery +=
          " ,status = 'V', validated_by='" +
          req.userIdentity.algaeh_d_app_user_id +
          "', validated_date = '" +
          moment().format("YYYY-MM-DD HH:mm") +
          "'  ";
      }

      _mysql
        .executeQueryWithTransaction(qry)
        .then((results) => {
          if (results != null) {
            _mysql
              .executeQuery({
                query:
                  "update hims_f_lab_order set `group_id`=?, `organism_type`=?, `bacteria_name`=?,`bacteria_type`=?, \
                  contaminated_culture=?, updated_date= ?, updated_by=?, comments=?" +
                  strQuery +
                  "where hims_f_lab_order_id=? ",
                values: [
                  inputParam.group_id,
                  inputParam.organism_type,
                  inputParam.bacteria_name,
                  inputParam.bacteria_type,
                  inputParam.contaminated_culture,
                  moment().format("YYYY-MM-DD HH:mm"),
                  req.userIdentity.algaeh_d_app_user_id,
                  inputParam.comments,
                  inputParam.hims_f_lab_order_id,
                ],
                printQuery: true,
              })
              .then((update_lab_order) => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    results,
                    entered_by: entered_by,
                    confirmed_by: confirmed_by,
                    validated_by: validated_by,
                  };
                  next();
                });
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = {
                results,
                entered_by: entered_by,
                confirmed_by: confirmed_by,
                validated_by: validated_by,
              };
              next();
            });
          }
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updateLabOrderedBilled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let OrderServices = new LINQ(req.body.billdetails)
        .Where(
          (w) =>
            w.hims_f_ordered_services_id > 0 &&
            w.service_type_id ==
              appsettings.hims_d_service_type.service_type_id.Lab
        )
        .Select((s) => {
          return {
            ordered_services_id: s.hims_f_ordered_services_id,
            billed: "Y",
            updated_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
          };
        })
        .ToArray();

      const ord_lab_services = req.body.billdetails.filter(
        (f) =>
          f.service_type_id ==
          appsettings.hims_d_service_type.service_type_id.Lab
      );

      const credit_order = parseFloat(req.body.credit_amount) > 0 ? "Y" : "N";
      if (OrderServices.length > 0) {
        let qry = "";

        for (let i = 0; i < OrderServices.length; i++) {
          qry += mysql.format(
            "UPDATE `hims_f_lab_order` SET billing_header_id=?, billed=?,credit_order=?,\
          updated_date=?,updated_by=? where ordered_services_id=?;",
            [
              req.body.hims_f_billing_header_id,

              OrderServices[i].billed,
              credit_order,
              moment().format("YYYY-MM-DD HH:mm"),
              OrderServices[i].updated_by,
              OrderServices[i].ordered_services_id,
            ]
          );
        }
        _mysql
          .executeQuery({
            query: qry,
            printQuery: true,
          })
          .then((result) => {
            if (
              req.body.LAB_Package === true ||
              ord_lab_services.length !== OrderServices.length
            ) {
              req.records = { LAB: true };
            } else {
              req.records = { LAB: false };
            }

            next();
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      } else {
        req.records = { LAB: true };
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  //created by: Irfan to compare lab results
  getComparedLabResult: (req, res, next) => {
    try {
      if (req.query.pre_order_id > 0 && req.query.cur_order_id) {
        const _mysql = new algaehMysql();
        _mysql
          .executeQuery({
            query:
              "  select OA.analyte_id,A.description as analyte ,OA.result,A.result_unit,OA.critical_type from \
            hims_f_ord_analytes  OA   inner join hims_d_lab_analytes A on OA.analyte_id=A.hims_d_lab_analytes_id\
            where OA.order_id=?;\
            select OA.analyte_id,OA.result,OA.critical_type from hims_f_ord_analytes  OA    inner join hims_d_lab_analytes A on \
            OA.analyte_id=A.hims_d_lab_analytes_id  where OA.order_id=?; ",
            values: [req.query.cur_order_id, req.query.pre_order_id],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();

            if (result[0].length > 0) {
              const outputArray = [];

              result[0].forEach((item) => {
                const data = result[1].find((val) => {
                  return val["analyte_id"] == item["analyte_id"];
                });

                if (data) {
                  let valur_flucuate = "N";
                  if (parseFloat(item["result"]) > parseFloat(data["result"])) {
                    valur_flucuate = "U";
                  } else if (
                    parseFloat(item["result"]) < parseFloat(data["result"])
                  ) {
                    valur_flucuate = "D";
                  }
                  outputArray.push({
                    analyte: item["analyte"],
                    result_unit: item["result_unit"],
                    cur_result: item["result"],
                    pre_result: data["result"],
                    cur_critical_type: item["critical_type"],
                    pre_critical_type: data["critical_type"],
                    valur_flucuate: valur_flucuate,
                  });
                }
              });
              req.records = outputArray;
              next();
            } else {
              req.records = result[0];
              next();
            }
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide Valid cur_order_id and pre_order_id",
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },

  getPatientTestList: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "SELECT *,la.description from hims_f_ord_analytes, hims_d_lab_analytes la where hims_f_ord_analytes.record_status='A' \
              and la.hims_d_lab_analytes_id = hims_f_ord_analytes.analyte_id AND order_id=?;\
            SELECT V.visit_code, V.visit_date, LA.hims_f_lab_order_id,LA.service_id FROM hims_f_lab_order LA, hims_f_patient_visit V \
            where LA.visit_id = V.hims_f_patient_visit_id and LA.patient_id=? and LA.provider_id=? and LA.status='V' \
            AND LA.service_id=? AND LA.visit_id!=?;",
          values: [
            req.query.order_id,
            req.query.patient_id,
            req.query.provider_id,
            req.query.service_id,
            req.query.visit_id,
          ],
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
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  updateResultFromMachine: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let input = req.body;

      _mysql
        .executeQuery({
          query:
            "select hims_f_lab_order_id from hims_f_lab_order where lab_id_number=?;",
          values: [input.sampleNo],
          printQuery: true,
        })
        .then((lab_order) => {
          // MachineId
          if (lab_order.length > 0) {
            _mysql
              .executeQuery({
                query:
                  "select hims_f_ord_analytes_id, analyte_id, critical_low, normal_low, normal_high, critical_high \
                  from hims_f_ord_analytes where order_id=?;",
                values: [lab_order[0].hims_f_lab_order_id],
                printQuery: true,
              })
              .then((ord_analytes) => {
                let strResultUpdate = "";
                for (let i = 0; i < input.result.length; i++) {
                  _mysql
                    .executeQuery({
                      query:
                        "select D.analyte_id from hims_m_machine_analytes_header H, hims_m_machine_analytes_detail D \
                      where H.hims_m_machine_analytes_header_id = D.machine_analytes_header_id and \
                      H.machine_id = ? and machine_analyte_code=?;",
                      values: [input.MachineId, input.result[i].tesCode],
                      printQuery: true,
                    })
                    .then((analyte_data) => {
                      let selected_analyte = _.find(
                        ord_analytes,
                        (f) => f.analyte_id === analyte_data[0].analyte_id
                      );

                      let critical_type = "";
                      if (
                        parseFloat(input.result[i].rawResult) <=
                        parseFloat(selected_analyte.critical_low)
                      ) {
                        critical_type = "CL";
                      } else if (
                        parseFloat(input.result[i].rawResult) <
                        parseFloat(selected_analyte.normal_low)
                      ) {
                        critical_type = "L";
                      } else if (
                        parseFloat(input.result[i].rawResult) <
                        parseFloat(selected_analyte.normal_high)
                      ) {
                        critical_type = "N";
                      } else if (
                        parseFloat(input.result[i].rawResult) <
                        parseFloat(selected_analyte.critical_high)
                      ) {
                        critical_type = "H";
                      } else {
                        critical_type = "CH";
                      }

                      strResultUpdate += mysql.format(
                        "UPDATE `hims_f_ord_analytes` SET result=?, critical_type=? where hims_f_ord_analytes_id=?;",
                        [
                          input.result[i].rawResult,
                          critical_type,
                          selected_analyte.hims_f_ord_analytes_id,
                        ]
                      );

                      if (i == input.result.length - 1) {
                        _mysql
                          .executeQuery({
                            query: strResultUpdate,
                            printQuery: true,
                          })
                          .then((update_result) => {
                            _mysql.releaseConnection();
                            req.records = update_result;
                            next();
                          })
                          .catch((e) => {
                            _mysql.releaseConnection();
                            next(e);
                          });
                      }
                    })
                    .catch((e) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                }
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = lab_order;
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  labDashBoardWithAttachment: (req, res, next) => {
    // const _mysql = new algaehMysql();
    const { hospital_address, hospital_name } = req.userIdentity;
    const {
      reportName,
      MailName,
      paramName1,
      paramValue1,
      paramName2,
      paramValue2,
      to_mail_id,
      body_mail,
    } = req.query;

    const mail_body = body_mail ? body_mail : "";
    try {
      const reportInput = [
        {
          report: {
            reportName: reportName,
            reportParams: [
              {
                name: paramName1,
                value: paramValue1,
              },
              {
                name: paramName2 ? paramName2 : "",
                value: paramValue2 ? paramValue2 : "",
              },
            ],
            outputFileType: "PDF",
          },
        },
      ];

      newAxios(req, {
        url: "http://localhost:3006/api/v1//Document/getEmailConfig",
      }).then((res) => {
        const options = res.data;
        const mailSender = new algaehMail(options.data[0])
          .to(to_mail_id)
          .subject(MailName)
          .templateHbs("labDashBoardMails.hbs", {
            hospital_address,
            hospital_name,
            mail_body,
          });

        // if (send_attachment === "true") {
        mailSender.attachReportsAndSend(req, reportInput, (error, records) => {
          if (error) {
            next(error);
            return;
          }

          next();
        });
      });
    } catch (e) {
      next(e);
    }
  },
};
export default labModal;

export async function updateLabOrderServices(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    let inputParam = { ...req.body };

    // return new Promise((resolve, reject) => {
    let strQuery = "";
    let _date = new Date();
    _date = moment(_date).format("YYYY-MM-DD");

    if (inputParam.hims_d_lab_sample_id === null) {
      strQuery = mysql.format(
        "SELECT hims_d_lab_container_id AS container_id, container_id AS container_code \
          FROM hims_d_lab_container WHERE hims_d_lab_container_id=?; \
          SELECT lab_location_code from hims_d_hospital where hims_d_hospital_id=?; \
          select number,hims_m_hospital_container_mapping_id from hims_m_hospital_container_mapping \
          where hospital_id =? and container_id=? and date =?; SELECT lab_id_number FROM hims_f_lab_order L \
          INNER JOIN hims_f_lab_sample S ON S.order_id = L.hims_f_lab_order_id \
          where L.visit_id=? and S.sample_id=? and S.container_id=? and L.billed='Y' and S.collected='Y';\
          INSERT INTO hims_f_lab_sample (`order_id`,`sample_id`, \
          `container_id`,`collected`,`status`, `collected_by`, `collected_date`, `barcode_gen`, hospital_id) values (?,?,?,?,?,?,?,?,?); \
          INSERT IGNORE INTO `hims_m_lab_specimen` (test_id, specimen_id, container_id, container_code, created_by, created_date, \
            updated_by, updated_date) VALUE(?,?,?,?,?,?,?,?);",
        [
          inputParam.container_id,
          inputParam.hims_d_hospital_id,
          inputParam.hims_d_hospital_id,
          inputParam.container_id,
          _date,
          inputParam.visit_id,
          inputParam.sample_id,
          inputParam.container_id,

          inputParam.order_id,
          inputParam.sample_id,
          inputParam.container_id,
          inputParam.collected,
          inputParam.status,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          new Date(),
          inputParam.hims_d_hospital_id,
          inputParam.test_id,
          inputParam.sample_id,
          inputParam.container_id,
          inputParam.container_code,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
        ]
      );
    } else {
      strQuery = mysql.format(
        "SELECT container_id as container_code FROM hims_d_lab_container \
          where hims_d_lab_container_id=?;\
          SELECT lab_location_code from hims_d_hospital where hims_d_hospital_id=?;\
          select number,hims_m_hospital_container_mapping_id from hims_m_hospital_container_mapping \
          where hospital_id =? and container_id=? and date =?; SELECT lab_id_number FROM hims_f_lab_order L \
          INNER JOIN hims_f_lab_sample S ON S.order_id = L.hims_f_lab_order_id \
          where L.visit_id=? and S.sample_id=? and S.container_id=? and L.billed='Y' and S.collected='Y';",
        [
          inputParam.container_id,
          inputParam.hims_d_hospital_id,
          inputParam.hims_d_hospital_id,
          inputParam.container_id,
          _date,
          inputParam.visit_id,
          inputParam.sample_id,
          inputParam.container_id,
        ]
      );
    }
    strQuery += "";
    _mysql
      .executeQueryWithTransaction({
        query: strQuery,
        printQuery: true,
      })
      .then((update_lab_sample) => {
        inputParam.container_code = update_lab_sample[0][0].container_code;
        inputParam.lab_location_code =
          update_lab_sample[1][0].lab_location_code;
        const today_date = moment().format("YYYY-MM-DD HH:mm:ss");
        if (inputParam.lab_id_number != null) {
          _mysql
            .executeQuery({
              query: `update hims_f_lab_order L  \
                      INNER JOIN hims_f_lab_sample S ON S.order_id = L.hims_f_lab_order_id SET S.container_id=${
                        inputParam.container_id
                      }, S.sample_id=${inputParam.sample_id},S.collected='${
                inputParam.collected
              }', L.status='CL', send_out_test='${
                inputParam.send_out_test
              }',send_in_test='${inputParam.send_in_test}',S.collected_by=${
                req.userIdentity.algaeh_d_app_user_id
              }, S.collected_date ='${
                inputParam.collected_date
                  ? `${inputParam.collected_date}`
                  : `${today_date}`
              }', L.barcode_gen = now() where hims_f_lab_order_id=${
                inputParam.hims_f_lab_order_id
              }`,
              // values: condition,
              printQuery: true,
            })
            .then(async (result) => {
              if (inputParam.portal_exists === "Y") {
                const portal_data = {
                  service_id: inputParam.service_id,
                  visit_code: inputParam.visit_code,
                  patient_identity: inputParam.primary_id_no,
                  service_status: "SAMPLE COLLECTED",
                };
                // console.log("portal_data", portal_data);
                // consol.log("portal_data", portal_data);
                await axios
                  .post(`${PORTAL_HOST}/info/deletePatientService`, portal_data)
                  .catch((e) => {
                    throw e;
                  });
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    collected: inputParam.collected,
                  };
                  next();
                });
              } else {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    collected: inputParam.collected,
                  };
                  next();
                });
              }
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else {
          const record = update_lab_sample[2];
          const test_exists = update_lab_sample[3];
          let query = "";
          let condition = [];
          let padNum = "";
          let labIdNumber = "";
          let _newNumber = 1;

          if (test_exists.length === 0 || test_exists[0].labIdNumber === null) {
            if (record != null && record.length > 0) {
              _newNumber = parseInt(record[0].number, 10);
              _newNumber = _newNumber + 1;
              padNum = pad(String(_newNumber), 3, "LEFT", "0");
              condition.push(
                _newNumber,
                req.userIdentity.algaeh_d_app_user_id,
                record[0].hims_m_hospital_container_mapping_id
              );

              condition.push;
              query =
                "Update hims_m_hospital_container_mapping set number =?,updated_by=?,updated_date=now() \
                      where hims_m_hospital_container_mapping_id =?;";
            } else {
              condition.push(
                inputParam.hims_d_hospital_id,
                inputParam.container_id,
                _date,
                1,
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.algaeh_d_app_user_id
              );

              query =
                "insert into hims_m_hospital_container_mapping (`hospital_id`,`container_id`,`date`,\
                            `number`,`created_by`,`updated_by`) values (?,?,?,?,?,?);";
            }
            padNum = pad(String(_newNumber), 3, "LEFT", "0");
            const dayOfYear = moment().dayOfYear();
            labIdNumber =
              inputParam.lab_location_code +
              moment().format("YY") +
              dayOfYear +
              inputParam.container_code +
              padNum;
          } else {
            labIdNumber = test_exists[0].lab_id_number;
          }

          _mysql
            .executeQuery({
              query:
                query +
                `UPDATE hims_f_lab_order L 
                  INNER JOIN hims_f_lab_sample S ON S.order_id = L.hims_f_lab_order_id 
                  SET S.container_id=${inputParam.container_id}, S.sample_id=${
                  inputParam.sample_id
                }, 
                  S.collected='${inputParam.collected}', S.status='${
                  inputParam.status
                }', 
                  S.collected_by=${req.userIdentity.algaeh_d_app_user_id},
                  S.collected_date ='${
                    inputParam.collected_date
                      ? `${inputParam.collected_date}`
                      : `${today_date}`
                  }', S.barcode_gen = now(), lab_id_number ='${labIdNumber}'
                  ,L.status='CL', send_out_test='${
                    inputParam.send_out_test
                  }',send_in_test='${inputParam.send_in_test}'
                  where L.hims_f_lab_order_id=${
                    inputParam.hims_f_lab_order_id
                  };`,
              values: condition,
              printQuery: true,
            })
            .then(async (result) => {
              if (inputParam.portal_exists === "Y") {
                const portal_data = {
                  service_id: inputParam.service_id,
                  visit_code: inputParam.visit_code,
                  patient_identity: inputParam.primary_id_no,
                  service_status: "SAMPLE COLLECTED",
                };
                await axios
                  .post(`${PORTAL_HOST}/info/deletePatientService`, portal_data)
                  .catch((e) => {
                    throw e;
                  });
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    collected: inputParam.collected,
                    collected_by: req.userIdentity.algaeh_d_app_user_id,
                    collected_date: inputParam.collected_date
                      ? inputParam.collected_date
                      : new Date(),
                    send_in_test: inputParam.send_in_test,
                    lab_id_number: labIdNumber,
                    status: "CL",
                  };
                  next();
                });
              } else {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    collected: inputParam.collected,
                    collected_by: req.userIdentity.algaeh_d_app_user_id,
                    collected_date: inputParam.collected_date
                      ? inputParam.collected_date
                      : new Date(),
                    send_in_test: inputParam.send_in_test,
                    lab_id_number: labIdNumber,
                    status: "CL",
                  };
                  next();
                });
              }
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        }
      });
  } catch (e) {
    // _mysql.releaseConnection();
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}

export async function updateLabOrderServiceStatus(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQueryWithTransaction({
        query: `
        UPDATE hims_f_lab_order L 
        INNER JOIN hims_f_lab_sample S ON S.order_id = L.hims_f_lab_order_id 
        set L.status='O', L.updated_by=?, L.updated_date=?, S.status='N', S.collected='N',
        S.collected_by=null, S.collected_date = null, S.barcode_gen = null,
        S.updated_by=?, S.updated_date=? where L.hims_f_lab_order_id in (?);
        SELECT L.service_id, visit_code, primary_id_no FROM hims_f_lab_order L
        INNER JOIN hims_f_patient P ON P.hims_d_patient_id=L.patient_id
        INNER JOIN hims_f_patient_visit PV ON PV.hims_f_patient_visit_id=L.visit_id 
        where hims_f_lab_order_id in (?)`,
        values: [
          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          req["userIdentity"].algaeh_d_app_user_id,
          new Date(),
          req.body.hims_f_lab_order_id,
          req.body.hims_f_lab_order_id,
        ],
        printQuery: true,
      })
      .then(async (result) => {
        console.log("req.body.portal_exists", req.body.portal_exists);
        if (req.body.portal_exists === "Y") {
          const calncel_details = result[1];

          for (let i = 0; i < calncel_details.length; i++) {
            const portal_data = {
              service_id: calncel_details[i].service_id,
              visit_code: calncel_details[i].visit_code,
              patient_identity: calncel_details[i].primary_id_no,
              service_status: "ORDERED",
            };
            // console.log("portal_data", portal_data);
            // consol.log("portal_data", portal_data);
            await axios
              .post(`${PORTAL_HOST}/info/deletePatientService`, portal_data)
              .catch((e) => {
                throw e;
              });
            if (i === calncel_details.length - 1) {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });
            }
          }
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          });
        }
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}

export async function bulkSampleCollection(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const input = req.body;

    let collection_done = [];
    for (let i = 0; i < input.bulkCollection.length; i++) {
      let item = input.bulkCollection[i];
      item.portal_exists = input.portal_exists;
      req.body = {
        ...item,
      };

      const xyz = await updateLabOrderServices(req, res, next);
      collection_done.push(xyz);
    }
    Promise.all(collection_done)
      .then(() => {
        next();
      })
      .catch((e) => {
        throw e;
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}

export function createPCRBatch(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const inputParam = req.query;
    const batch_number =
      "BAT-" +
      moment().format("YYYYMMDDHHMMSS") +
      req.userIdentity.algaeh_d_app_user_id;

    console.log("batch_number", batch_number);
    consol.log("batch_number", batch_number);
    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO hims_f_lab_batch_header (`batch_number`,`batch_name`,`batch_type`, \
      `created_by`,`updated_by`) values (?, ?, ?, ?, ?);",
        values: [batch_number, inputParam.batch_name, inputParam.batch_type],
        printQuery: true,
      })
      .then((headerResult) => {
        const IncludeValues = ["id_number"];
        _mysql
          .executeQueryWithTransaction({
            query: "INSERT INTO hims_f_lab_batch_detail(??) VALUES ?",
            values: inputParam.batch_list,
            includeValues: IncludeValues,
            extraValues: {
              batch_header_id: headerResult.insertId,
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
          .then((result) => {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          })
          .catch((e) => {
            mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}
