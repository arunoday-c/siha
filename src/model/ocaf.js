"use strict";

import algaehMysql from "algaeh-mysql";
import httpStatus from "../utils/httpStatus";

import { debugLog } from "../utils/logging";

const keyPath = require("algaeh-keys/keys");

//created by nowshad: to get
let getPatientOCAF = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const _input = req.query;
  try {
    _mysql
      .executeQuery({
        query:
          "SELECT * FROM `hims_f_ocaf_header` where patient_id=? and visit_id =?;select insured from hims_f_patient_visit where hims_f_patient_visit_id=?; ",
        values: [_input.patient_id, _input.visit_id, _input.visit_id],
        printQuery: true
      })
      .then(result => {
        const _isInsured = result[1][0]["insured"];
        if (_isInsured == "N") {
          _mysql.releaseConnection();
          next(new Error("Patient don't have any insurance"));
          return;
        }

        let hims_f_ocaf_header_id =
          result[0][0] == undefined ? null : result[0][0].hims_f_ocaf_header_id;

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
                P.full_name as patient_full_name,gender as patient_gender,'OP' as case_type ,P.gender,V.age_in_years,\
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
                select `bcva_dv_right_sch`,`bcva_dv_right_cyl`,`bcva_dv_right_axis`,`bcva_dv_right_prism`,\
                `bcva_dv_right_vision`,`bcva_nv_right_sch`,`bcva_nv_right_cyl`,\
                `bcva_nv_right_axis`,`bcva_nv_right_prism`,`bcva_nv_right_vision`,\
                `bcva_dv_left_sch`,`bcva_dv_left_cyl`,`bcva_dv_left_axis`,`bcva_dv_left_prism`,\
                `bcva_dv_left_vision`,`bcva_nv_left_sch`,`bcva_nv_left_cyl`,`bcva_nv_left_axis`,`bcva_nv_left_prism`,\
                `bcva_nv_left_vision`,`cl_type`,\
                multi_coated,varilux,light,aspheric,bifocal,medium,lenticular,single_vision,dark,\
                safety_thickness,anti_reflecting_coating,photosensitive,high_index,colored,anti_scratch\
                from hims_f_glass_prescription where patient_id=? and visit_id=?;\
                DELETE from hims_f_ocaf_insurance_details where hims_f_ocaf_header_id=?;\
                DELETE from hims_f_ocaf_header where hims_f_ocaf_header_id=?;",
              values: [
                _input.patient_id,
                _input.visit_date,
                _input.visit_id,
                _input.patient_id,
                _input.visit_date,
                _input.visit_id,
                _input.patient_id,
                _input.visit_id,
                hims_f_ocaf_header_id,
                hims_f_ocaf_header_id
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
              // if (errorString != "") {
              //   _mysql.releaseConnection();
              //   next(new Error(errorString));
              //   return;
              // }

              const _fields =
                outputResult[0].length > 0 ? { ...outputResult[0][0] } : {};

              for (var i = 0; i < outputResult[2].length; i++) {
                const _out = outputResult[2][i];
                _fields["dv_right_sch"] = _out["bcva_dv_right_sch"];
                _fields["dv_right_cyl"] = _out["bcva_dv_right_cyl"];
                _fields["dv_right_axis"] = _out["bcva_dv_right_axis"];
                _fields["dv_right_prism"] = _out["bcva_dv_right_prism"];
                _fields["dv_right_vision"] = _out["bcva_dv_right_vision"];

                _fields["nv_right_sch"] = _out["bcva_nv_right_sch"];
                _fields["nv_right_cyl"] = _out["bcva_nv_right_cyl"];
                _fields["nv_right_axis"] = _out["bcva_nv_right_axis"];
                _fields["nv_right_prism"] = _out["bcva_nv_right_prism"];
                _fields["nv_right_vision"] = _out["bcva_nv_right_vision"];

                _fields["dv_left_sch"] = _out["bcva_dv_left_sch"];
                _fields["dv_left_cyl"] = _out["bcva_dv_left_cyl"];
                _fields["dv_left_axis"] = _out["bcva_dv_left_axis"];
                _fields["dv_left_prism"] = _out["bcva_dv_left_prism"];
                _fields["dv_left_vision"] = _out["bcva_dv_left_vision"];

                _fields["nv_left_sch"] = _out["bcva_nv_left_sch"];
                _fields["nv_left_cyl"] = _out["bcva_nv_left_cyl"];
                _fields["nv_left_axis"] = _out["bcva_nv_left_axis"];
                _fields["nv_left_prism"] = _out["bcva_nv_left_prism"];
                _fields["nv_left_vision"] = _out["bcva_nv_left_vision"];

                _fields["contact_lense_type"] = _out["cl_type"];

                _fields["multi_coated"] = _out["multi_coated"];
                _fields["varilux"] = _out["varilux"];
                _fields["light"] = _out["light"];
                _fields["aspheric"] = _out["aspheric"];
                _fields["bifocal"] = _out["bifocal"];
                _fields["medium"] = _out["medium"];
                _fields["lenticular"] = _out["lenticular"];
                _fields["single_vision"] = _out["single_vision"];
                _fields["dark"] = _out["dark"];
                _fields["safety_thickness"] = _out["safety_thickness"];
                _fields["anti_reflecting_coating"] =
                  _out["anti_reflecting_coating"];
                _fields["photosensitive"] = _out["photosensitive"];

                _fields["high_index"] = _out["high_index"];
                _fields["colored"] = _out["colored"];
                _fields["anti_scratch"] = _out["anti_scratch"];
              }

              _mysql
                .executeQueryWithTransaction({
                  query:
                    "insert into hims_f_ocaf_header(`patient_id`,`visit_id`,`visit_date`,`provider_name`,\
                `new_visit_patient`,`sub_department_name`,`patient_code`,`patient_full_name`,\
                `patient_marital_status`,\
                `dv_right_sch`,`dv_right_cyl`,`dv_right_axis`,`dv_right_prism`,`dv_right_vision`,\
                `nv_right_sch`,`nv_right_cyl`,`nv_right_axis`,`nv_right_prism`,`nv_right_vision`,\
                `dv_left_sch`,`dv_left_cyl`,`dv_left_axis`,`dv_left_prism`,`dv_left_vision`,\
                `nv_left_sch`,`nv_left_cyl`,`nv_left_axis`,`nv_left_prism`,`nv_left_vision`,\
                `contact_lense_type`,`patient_gender`,`age_in_years`,multi_coated,varilux,light,\
                aspheric,bifocal,medium,lenticular,single_vision,dark,safety_thickness,\
                anti_reflecting_coating,photosensitive,high_index,colored,anti_scratch,\
                `created_date`,`created_by`,`updated_date`,\
                `updated_by`,`hospital_id`) \
                values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\
                  ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
                  values: [
                    _fields.patient_id,
                    _fields.visit_id,
                    _fields.visit_date,
                    _fields.provider_name,
                    _fields.new_visit_patient,
                    _fields.sub_department_name,
                    _fields.patient_code,
                    _fields.patient_full_name,
                    _fields.patient_marital_status,

                    _fields.dv_right_sch,
                    _fields.dv_right_cyl,
                    _fields.dv_right_axis,
                    _fields.dv_right_prism,
                    _fields.dv_right_vision,

                    _fields.nv_right_sch,
                    _fields.nv_right_cyl,
                    _fields.nv_right_axis,
                    _fields.nv_right_prism,
                    _fields.nv_right_vision,

                    _fields.dv_left_sch,
                    _fields.dv_left_cyl,
                    _fields.dv_left_axis,
                    _fields.dv_left_prism,
                    _fields.dv_left_vision,

                    _fields.nv_left_sch,
                    _fields.nv_left_cyl,
                    _fields.nv_left_axis,
                    _fields.nv_left_prism,
                    _fields.nv_left_vision,
                    _fields.contact_lense_type,

                    _fields.patient_gender,
                    _fields.age_in_years,

                    _fields.multi_coated,
                    _fields.varilux,
                    _fields.light,
                    _fields.aspheric,
                    _fields.bifocal,
                    _fields.medium,
                    _fields.lenticular,
                    _fields.single_vision,
                    _fields.dark,
                    _fields.safety_thickness,
                    _fields.anti_reflecting_coating,
                    _fields.photosensitive,
                    _fields.high_index,
                    _fields.colored,
                    _fields.anti_scratch,

                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    req.userIdentity["x-branch"]
                  ],
                  printQuery: true
                })
                .then(headerResult => {
                  req["hims_f_ocaf_header_id"] = headerResult["insertId"];
                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO hims_f_ocaf_insurance_details (??) values ?",
                      values: outputResult[1],
                      extraValues: {
                        hims_f_ocaf_header_id: headerResult["insertId"]
                      },
                      bulkInsertOrUpdate: true
                    })
                    .then(insuranceResult => {
                      _getocafDetails(_mysql, req)
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
        } else {
          req["hims_f_ocaf_header_id"] = result[0][0]["hims_f_ocaf_header_id"];
          _getocafDetails(_mysql, req)
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

const _getocafDetails = (_mysql, req) => {
  return new Promise((resolve, reject) => {
    _mysql
      .executeQuery({
        query:
          "select * from hims_f_ocaf_header where hims_f_ocaf_header_id=?; \
          select * from hims_f_ocaf_insurance_details where hims_f_ocaf_header_id=?;",
        values: [req.hims_f_ocaf_header_id, req.hims_f_ocaf_header_id],
        printQuery: true
      })
      .then(result => {
        resolve({
          hims_f_ocaf_header: result[0],
          hims_f_ocaf_insurance_details: result[1]
        });
      })
      .catch(error => {
        reject(error);
      });
  });
};

const updateOcafDetails = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });

  try {
    const input = req.body;

    _mysql
      .executeQuery({
        query:
          "update hims_f_ocaf_header set `patient_marital_status`=?,\
          `dv_right_sch`=?,`dv_right_cyl`=?,`dv_right_axis`=?,`dv_right_vision`=?,\
          `nv_right_sch`=?,`nv_right_cyl`=?,`nv_right_axis`=?,`nv_right_vision`=?,\
          `dv_left_sch`=?,`dv_left_cyl`=?,`dv_left_axis`=?,`dv_left_vision`=?,\
          `nv_left_sch`=?,`nv_left_cyl`=?,`nv_left_axis`=?,`nv_left_vision`=?,\
          `resgular_lense_type`=?,`multi_coated`=?,`varilux`=?,`light`=?,`aspheric`=?,\
          `bifocal`=?, `medium`=?, `lenticular`=?, `single_vision`=?, `dark`=?,\
          `safety_thickness`=?, `anti_reflecting_coating`=?, `photosensitive`=?,\
          `high_index`=?, `colored`=?, `anti_scratch`=?,`contact_lense_type`=?,\
          `frames`=?,`no_pairs`=?, `estimated_cost`=?,`lense_cost`=?,`frame_cost`=?,\
          `eye_pd1`=?, `eye_pd2`=?,`right_bifocal_add`=?,`left_bifocal_add`=?,`vertical_add`=?,\
          `updated_date`=?,`updated_by`=?\
          WHERE  `hims_f_ocaf_header_id`=?;",
        values: [
          input.patient_marital_status,
          input.dv_right_sch,
          input.dv_right_cyl,
          input.dv_right_axis,
          input.dv_right_vision,
          input.nv_right_sch,
          input.nv_right_cyl,
          input.nv_right_axis,
          input.nv_right_vision,
          input.dv_left_sch,
          input.dv_left_cyl,
          input.dv_left_axis,
          input.dv_left_vision,
          input.nv_left_sch,
          input.nv_left_cyl,
          input.nv_left_axis,
          input.nv_left_vision,
          input.resgular_lense_type,
          input.multi_coated,
          input.varilux,
          input.light,
          input.aspheric,
          input.bifocal,
          input.medium,
          input.lenticular,
          input.single_vision,
          input.dark,
          input.safety_thickness,
          input.anti_reflecting_coating,
          input.photosensitive,
          input.high_index,
          input.colored,
          input.anti_scratch,
          input.contact_lense_type,
          input.frames,
          input.no_pairs,
          input.estimated_cost,
          input.lense_cost,
          input.frame_cost,
          input.eye_pd1,
          input.eye_pd2,

          input.right_bifocal_add,
          input.left_bifocal_add,
          input.vertical_add,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_f_ocaf_header_id
        ],
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
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

module.exports = {
  getPatientOCAF,
  updateOcafDetails
};
