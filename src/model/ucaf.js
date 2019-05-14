"use strict";

import algaehMysql from "algaeh-mysql";
import httpStatus from "../utils/httpStatus";

import { debugLog } from "../utils/logging";

const keyPath = require("algaeh-keys/keys");

//created by irfan: to get
let getPatientUCAF = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const _input = req.query;
  try {
    _mysql
      .executeQuery({
        query:
          "SELECT * FROM `hims_f_ucaf_header` where patient_id=? and (visit_id =? or date(visit_date)=date(?));select insured from hims_f_patient_visit where hims_f_patient_visit_id=?; ",
        values: [
          _input.patient_id,
          _input.visit_id,
          _input.visit_date,
          _input.visit_id
        ]
        // printQuery: true
      })
      .then(result => {
        const _isInsured = result[1][0]["insured"];
        if (_isInsured == "N") {
          _mysql.releaseConnection();
          next(new Error("Patient don't have any insurance"));
          return;
        }
        let hims_f_ucaf_header_id = result[0].hims_f_ucaf_header_id

        console.log("forceReplace", _input.forceReplace)
        if (_input.forceReplace == "true") {
          result[0] = [];
        }
        if (result[0].length == 0) {
          _mysql
            .executeQuery({
              query:
                "select  V.patient_id,V.hims_f_patient_visit_id as visit_id, \
                E.full_name as provider_name,V.new_visit_patient,null as patient_emergency_case,\
                V.appointment_patient,SD.sub_department_name,\
                P.patient_code,P.marital_status as patient_marital_status,date(V.visit_date) as visit_date,\
                P.full_name as patient_full_name,gender as patient_gender ,'OP' as case_type ,P.gender,V.age_in_years,\
                IM.primary_policy_num,IM.primary_effective_start_date, \
                IM.primary_effective_end_date,IM.primary_card_number \
                from hims_f_patient_visit V inner join hims_d_employee E \
                on V.doctor_id = E.hims_d_employee_id \
                inner join  hims_d_sub_department SD \
                on V.sub_department_id = SD.hims_d_sub_department_id \
                inner join hims_f_patient P on V.patient_id = P.hims_d_patient_id \
                inner join hims_m_patient_insurance_mapping IM on IM.patient_visit_id =V.hims_f_patient_visit_id \
                and IM.patient_id = V.patient_id \
                where V.patient_id=? and (date(visit_date) =date(?) or  V.hims_f_patient_visit_id=? )\
                and P.record_status='A'; \
                select distinct PV.vital_value,PV.formula_value,VH.vitals_name, \
                case VH.vitals_name when 'Weight' then 'patient_weight' when 'Heart Rate' then 'patient_pulse' \
                when 'Height' then 'patient_height' when 'BMI' then 'patient_bmi' when 'Temperature' then 'patient_temp' \
                when 'O2 Sat' then 'patient_o2stat' when 'Bp Systolic' then 'patient_bp_sys' when 'Bp Diastolic' \
                then 'patient_bp_dia' when 'Respiratory Rate' then 'patient_respiratory_rate' end patient_vitals \
                from hims_f_patient_vitals PV inner join hims_d_vitals_header VH \
                on PV.vital_id = VH.hims_d_vitals_header_id \
                where PV.patient_id=? and (date(PV.visit_date)=date(?) or visit_id=?) \
                order by PV.visit_date  desc;\
                select HPIH.hpi_description,case CC.pain when 'NH' then 'no hurts' when 'HLB' then 'hurts little bit' \
                when 'HLM' then 'hurts little more' when 'HEM' then 'hurts even more' when 'HWL' then 'hurts whole lot' \
                when 'HW' then 'hurts worst' end pain, case CC.severity when 'MI' then 'mild' when 'MO' then 'moderate' \
                when 'SE' then 'severe' end  severity,  CC.score,CC.duration,CC.comment,CC.onset_date \
                from hims_f_episode_chief_complaint CC \
                inner join hims_f_patient_visit PV \
                on CC.patient_id=PV.patient_id and CC.episode_id=PV.episode_id \
                left join hims_d_hpi_header HPIH on CC.chief_complaint_id = HPIH.hims_d_hpi_header_id \
                and HPIH.sub_department_id = PV.sub_department_id where PV.patient_id=? \
                and (date(PV.visit_date)=date(?) or PV.hims_f_patient_visit_id=?) and CC.record_status='A'; \
                select  ICD.long_icd_description,icd_code from hims_f_patient_diagnosis D inner join hims_d_icd ICD \
                on D.daignosis_id = ICD.hims_d_icd_id inner join hims_f_patient_visit V \
                on D.episode_id = V.episode_id  \
                where V.patient_id=? and  (date(V.visit_date)= date(?) or hims_f_patient_visit_id=?) \
                and D.record_status ='A' and D.final_daignosis='Y';\
                select CPT.cpt_code as service_code,ST.service_type,S.service_name,D.quantity as service_quantity,\
                D.net_amout as service_net_amout from hims_f_billing_header H inner join hims_f_billing_details D \
                on H.hims_f_billing_header_id = D.hims_f_billing_header_id inner join hims_f_patient_visit V \
                on V.hims_f_patient_visit_id = H.visit_id inner join hims_d_services S on \
                S.hims_d_services_id = D.services_id left outer join hims_d_cpt_code CPT on \
                CPT.hims_d_cpt_code_id = S.cpt_code inner join hims_d_service_type ST on \
                ST.hims_d_service_type_id = D.service_type_id \
                where V.patient_id = ? and (date(V.visit_date) = date(?) or visit_id=?)  ;\
                select G.generic_name,'' as type,PD.dispense as quantity from hims_f_prescription PH inner join \
                hims_f_prescription_detail PD on PD.prescription_id = PH.hims_f_prescription_id inner \
                join hims_f_patient_visit V on V.episode_id = PH.episode_id  left join hims_d_item_generic G on \
                PD.generic_id = G.hims_d_item_generic_id where V.patient_id=? and (date(V.visit_date) = date(?) or \
                hims_f_patient_visit_id=?); \
                select IM.primary_policy_num,IM.primary_effective_start_date,IM.primary_effective_end_date,\
                IM.primary_card_number,IM.primary_insurance_provider_id,IM.secondary_insurance_provider_id,\
                IM.secondary_policy_num,IM.secondary_card_number,IM.secondary_effective_start_date,\
                IM.secondary_effective_end_date,IP.insurance_provider_name as primary_insurance_company_name,\
                case IM.secondary_insurance_provider_id when IM.secondary_insurance_provider_id <> null then IP.insurance_provider_name else ''\
                end secondary_insurance_company_name ,SI.insurance_sub_name as primary_tpa_insurance_company_name, \
                case IM.secondary_insurance_provider_id when IM.secondary_insurance_provider_id <> null then SI.insurance_sub_name else '' \
                end secondary_tpa_insurance_company_name from hims_m_patient_insurance_mapping IM inner join  hims_d_insurance_provider IP \
                on IP.hims_d_insurance_provider_id = IM.primary_insurance_provider_id inner join hims_d_insurance_sub SI \
                on SI.hims_d_insurance_sub_id = IM.primary_sub_id inner join hims_f_patient_visit V \
                on V.hims_f_patient_visit_id = IM.patient_visit_id where IM.record_status='A' and IM.patient_id=? \
                and (date(V.visit_date)=date(?) or V.hims_f_patient_visit_id =? );\
                DELETE from hims_f_ucaf_header where hims_f_ucaf_header_id=?",
              values: [
                _input.patient_id,
                _input.visit_date,
                _input.visit_id,
                _input.patient_id,
                _input.visit_date,
                _input.visit_id,
                _input.patient_id,
                _input.visit_date,
                _input.visit_id,
                _input.patient_id,
                _input.visit_date,
                _input.visit_id,
                _input.patient_id,
                _input.visit_date,
                _input.visit_id,
                _input.patient_id,
                _input.visit_date,
                _input.visit_id,
                _input.patient_id,
                _input.visit_date,
                _input.visit_id,
                hims_f_ucaf_header_id
              ],
               printQuery: true
            })
            .then(outputResult => {
              // let errorString =
              //   outputResult[4].length == 0 ? "Services not yet added \n" : "";
              // errorString +=
              //   outputResult[5].length == 0
              //     ? "Medication not yet added \n"
              //     : "";
              // errorString +=
              //   outputResult[6].length == 0 ? "Insurance is not added \n" : "";
              // console.log("errorString", errorString);
              // if (errorString != "") {
              //   _mysql.releaseConnection();
              //   next(new Error(errorString));
              //   return;
              // }

              const _fields =
                outputResult[0].length > 0 ? { ...outputResult[0][0] } : {};

              for (var i = 0; i < outputResult[1].length; i++) {
                const _out = outputResult[1][i];
                const _vital = _out["patient_vitals"];
                if (
                  _vital == "patient_bp_sys" ||
                  _vital == "patient_bp_dia" ||
                  _vital == "patient_pulse" ||
                  _vital == "patient_temp" ||
                  _vital == "patient_weight" ||
                  _vital == "patient_height" ||
                  _vital == "patient_respiratory_rate"
                )
                  _fields[_vital] = _out["vital_value"];
              }
              _fields["patient_chief_comp_main_symptoms"] = "";
              for (var i = 0; i < outputResult[2].length; i++) {
                console.log("outputResult2", outputResult[2].length)
                const _out = outputResult[2][i];

                // if (_fields["patient_duration_of_illness"] == null) {
                //   _fields["patient_duration_of_illness"] = _out["duration"];
                // } else {
                  _fields["patient_duration_of_illness"] = _out["duration"];
                  if (_out["comment"] == "") {
                    _fields["patient_chief_comp_main_symptoms"] +=
                      _out["hpi_description"] +
                      " has pain as " +
                      _out["pain"] +
                      " ";
                    "sverity as " +
                      _out["severity"] +
                      "  from date " +
                      _out["onset_date"];
                  } else {
                    console.log("_out", _out["comment"])
                    _fields["patient_chief_comp_main_symptoms"] +=
                      _out["comment"];
                  }
                // }
              }
              _fields["patient_diagnosys"] = "";
              for (var i = 0; i < outputResult[3].length; i++) {
                const _out = outputResult[3][i];
                _fields["patient_diagnosys"] +=
                  _out["long_icd_description"] + ",";
                _fields["patient_principal_code_" + (i + 1)] = _out["icd_code"];
              }

              for (var i = 1; i < 5; i++) {
                if (_fields["patient_principal_code_" + i] === undefined) {
                  _fields["patient_principal_code_" + i] = undefined;
                }
              }
              _fields["patient_chronic"] = "N";
              _fields["patient_congenetal"] = "N";
              _fields["patient_rta"] = "N";
              _fields["patient_work_related"] = "N";
              _fields["patient_vaccination"] = "N";
              _fields["patient_check_up"] = "N";
              _fields["patient_psychiatric"] = "N";
              _fields["patient_infertility"] = "N";
              _fields["patient_pregnancy"] = "N";
              _fields["patient_indicated_LMP"] = "N";

              _mysql
                .executeQueryWithTransaction({
                  query:
                    "insert into hims_f_ucaf_header(`patient_id`,`visit_id`,`visit_date`,`provider_name`,\
                `new_visit_patient`,`appointment_patient`,`sub_department_name`,`patient_code`,\
                `patient_marital_status`,`patient_full_name`,`case_type`,`patient_emergency_case`,\
                `patient_bp_sys`,`patient_bp_dia`,`patient_pulse`,`patient_temp`,`patient_weight`,\
                `patient_height`,`patient_respiratory_rate`,`patient_duration_of_illness`,\
                `patient_chief_comp_main_symptoms`,`patient_significant_signs`,`patient_other_conditions`,\
                `patient_diagnosys`,`patient_principal_code_1`,`patient_principal_code_2`,\
                `patient_principal_code_3`,`patient_principal_code_4`,`patient_chronic`,`patient_congenetal`,\
                `patient_rta`,`patient_work_related`,`patient_vaccination`,`patient_check_up`,\
                `patient_psychiatric`,`patient_infertility`,`patient_pregnancy`,`patient_indicated_LMP`,\
                `patient_gender`,`age_in_years`) \
                values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);\
                ",
                  values: [
                    _fields.patient_id,
                    _fields.visit_id,
                    _fields.visit_date,
                    _fields.provider_name,
                    _fields.new_visit_patient,
                    _fields.appointment_patient,
                    _fields.sub_department_name,
                    _fields.patient_code,
                    _fields.patient_marital_status,
                    _fields.patient_full_name,
                    _fields.case_type,
                    _fields.patient_emergency_case,
                    _fields.patient_bp_sys,
                    _fields.patient_bp_dia,
                    _fields.patient_pulse,
                    _fields.patient_temp,
                    _fields.patient_weight,
                    _fields.patient_height,
                    _fields.patient_respiratory_rate,
                    _fields.patient_duration_of_illness,
                    _fields.patient_chief_comp_main_symptoms,
                    _fields.patient_significant_signs,
                    _fields.patient_other_conditions,
                    _fields.patient_diagnosys,
                    _fields.patient_principal_code_1,
                    _fields.patient_principal_code_2,
                    _fields.patient_principal_code_3,
                    _fields.patient_principal_code_4,
                    _fields.patient_chronic,
                    _fields.patient_congenetal,
                    _fields.patient_rta,
                    _fields.patient_work_related,
                    _fields.patient_vaccination,
                    _fields.patient_check_up,
                    _fields.patient_psychiatric,
                    _fields.patient_infertility,
                    _fields.patient_pregnancy,
                    _fields.patient_indicated_LMP,
                    _fields.patient_gender,
                    _fields.age_in_years
                  ],
                  printQuery: true
                })
                .then(headerResult => {
                  req["hims_f_ucaf_header_id"] = headerResult["insertId"];
                  let _services_query = {
                    query: "INSERT INTO hims_f_ucaf_services (??) values ?",
                    values: outputResult[4],
                    extraValues: {
                      hims_f_ucaf_header_id: headerResult["insertId"]
                    },
                    bulkInsertOrUpdate: true
                  };
                  if (outputResult[4].length == 0) {
                    _services_query = {
                      query: "select 1"
                    };
                  }
                  let _service_medication = {
                    query: "INSERT INTO hims_f_ucaf_medication (??) values ?",
                    values: outputResult[5],
                    extraValues: {
                      hims_f_ucaf_header_id: headerResult["insertId"]
                    },
                    bulkInsertOrUpdate: true
                  };
                  if (outputResult[5].length == 0) {
                    _service_medication = {
                      query: "select 1"
                    };
                  }
                  _mysql
                    .executeQuery(_services_query)
                    .then(serviceResult => {
                      _mysql
                        .executeQuery(_service_medication)
                        .then(medicationResult => {
                          _mysql
                            .executeQuery({
                              query:
                                "INSERT INTO hims_f_ucaf_insurance_details (??) values ?",
                              values: outputResult[6],
                              extraValues: {
                                hims_f_ucaf_header_id: headerResult["insertId"]
                              },
                              bulkInsertOrUpdate: true
                            })
                            .then(insuranceResult => {
                              _getUcafDetails(_mysql, req)
                                .then(allResult => {
                                  _mysql.commitTransaction(error => {
                                    _mysql.releaseConnection();
                                    if (error) {
                                      _mysql.rollBackTransaction(() => {
                                        next(error);
                                      });
                                    }
                                  });

                                  req.records = allResult;
                                  next();
                                })
                                .catch(error => {
                                  _mysql.releaseConnection();
                                  next(error);
                                });
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        })
                        .catch(error => {
                          _mysql.rollBackTransaction(() => {
                            next(error);
                          });
                        });
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            })
            .catch(error => {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            });
        } else {
          req["hims_f_ucaf_header_id"] = result[0][0]["hims_f_ucaf_header_id"];
          _getUcafDetails(_mysql, req)
            .then(allResult => {
              _mysql.releaseConnection();

              req.records = allResult;
              next();
            })
            .catch(error => {
              next(error);
            });
        }
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

const _getUcafDetails = (_mysql, req) => {
  return new Promise((resolve, reject) => {
    _mysql
      .executeQuery({
        query:
          "select * from hims_f_ucaf_header where hims_f_ucaf_header_id=?; \
          select * from hims_f_ucaf_insurance_details where hims_f_ucaf_header_id=?; \
          select * from hims_f_ucaf_medication where hims_f_ucaf_header_id=?; \
          select * from hims_f_ucaf_services where hims_f_ucaf_header_id=?;",
        values: [
          req.hims_f_ucaf_header_id,
          req.hims_f_ucaf_header_id,
          req.hims_f_ucaf_header_id,
          req.hims_f_ucaf_header_id
        ],
        printQuery: true
      })
      .then(result => {
        resolve({
          hims_f_ucaf_header: result[0],
          hims_f_ucaf_insurance_details: result[1],
          hims_f_ucaf_medication: result[2],
          hims_f_ucaf_services: result[3]
        });
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  getPatientUCAF
};
