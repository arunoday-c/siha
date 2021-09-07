// import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import hims_adm_atd_admission from "../dbModels/hims_adm_atd_admission";
import hims_adm_atd_bed_details from "../dbModels/hims_adm_atd_bed_details";
import hims_f_ip_numgen from "../dbModels/hims_f_ip_numgen";
import algaeh_d_app_config from "../dbModels/algaeh_d_app_config";
import hims_f_patient_encounter from "../dbModels/hims_f_patient_encounter";
import { RunningNumber } from "../common/runningNum";
import { Request, Response, NextFunction } from "express";
import db from "../connection";
import moment from "moment";

export async function addPatienAdmission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const t = db.transaction();
  try {
    const input = req.body;
    //@ts-ignore

    const _RunningNumber = new RunningNumber<hims_f_ip_numgen, t>();
    console.log("admission_no");

    //                 inputParam.episode_id = currentEpisodeNo;
    //                 req.body.episode_id = inputParam.episode_id;
    const admission_no = await _RunningNumber
      .generateNumber("ATD")
      .catch((error) => {
        throw error;
      });

    console.log("admission_no", admission_no);

    let fromDate = moment(input.date_of_birth);
    let toDate = new Date();
    let age_in_years = moment(toDate).diff(fromDate, "year");
    fromDate.add(age_in_years, "years");
    let age_in_months = moment(toDate).diff(fromDate, "months");
    fromDate.add(age_in_months, "months");
    let age_in_days = moment(toDate).diff(fromDate, "days");

    const atd_result: any = await hims_adm_atd_admission.create({
      admission_number: admission_no,
      admission_date: new Date(),
      admission_type: input.admission_type,
      patient_id: input.patient_id,
      ward_id: input.ward_id,
      age_in_years: age_in_years,
      age_in_months: age_in_months,
      age_in_days: age_in_days,
      bed_id: input.bed_id,
      sub_department_id: input.sub_department_id,
      provider_id: input.provider_id,
      insurance_provider_id: input.insurance_provider_id,
      insurance_sub_id: input.insurance_sub_id,
      network_id: input.network_id,
      insurance_network_office_id: input.insurance_network_office_id,
      policy_number: input.policy_number,

      created_by: req["userIdentity"].algaeh_d_app_user_id,
      updated_by: req["userIdentity"].algaeh_d_app_user_id,
    });

    console.log("atd_result", atd_result);

    const bed_result = await hims_adm_atd_bed_details.create({
      admission_id: atd_result?.hims_adm_atd_admission_id,
      patient_id: input.patient_id,
      doctor_id: input.doctor_id,
      service_type_id: input.service_type_id,
      services_id: input.services_id,
      ward_id: input.ward_id,

      bed_id: input.bed_id,
      insurance_yesno: input.insurance_yesno,

      pre_approval: input.bed_details.pre_approval,
      billed: input.billed,
      quantity: "1",

      unit_cost: input.bed_details.unit_cost,
      gross_amount: input.bed_details.gross_amount,
      discount_percentage: input.bed_details.discount_percentage,
      discount_amout: input.bed_details.discount_amout,

      net_amout: input.bed_details.net_amout,
      copay_percentage: input.bed_details.copay_percentage,
      copay_amount: input.bed_details.copay_amount,
      deductable_percentage: input.bed_details.deductable_percentage,
      deductable_amount: input.bed_details.deductable_amount,

      patient_resp: input.bed_details.patient_resp,
      comapany_resp: input.bed_details.comapany_resp,
      patient_tax: input.bed_details.patient_tax,
      company_tax: input.bed_details.company_tax,
      patient_payable: input.bed_details.patient_payable,
      company_payble: input.bed_details.company_payble,
      total_tax: input.bed_details.total_tax,
      total_amount:
        parseFloat(input.bed_details.patient_payable) +
        parseFloat(input.bed_details.company_payble),
      hospital_id: req["userIdentity"].hospital_id,
    });
    const episode_reslt: any = await algaeh_d_app_config.findOne({
      where: {
        algaeh_d_app_config_id: "11",
      },
      attributes: ["episode_id"],
    });
    console.log("episode_reslt", episode_reslt.dataValues.episode_id);

    const nextEpisodeNo = episode_reslt.dataValues.episode_id + 1;

    const update_episode: any = await algaeh_d_app_config.update(
      { episode_id: nextEpisodeNo },
      {
        where: {
          algaeh_d_app_config_id: "11",
        },
      }
    );

    const insert_eposode: any = await hims_f_patient_encounter.create({
      patient_id: input.patient_id,
      provider_id: input.provider_id,
      ip_id: atd_result?.hims_adm_atd_admission_id,
      source: "I",
      episode_id: episode_reslt.dataValues.episode_id,
      age: age_in_years,
      payment_type: input.insurance_yesno === "Y" ? "I" : "S",
      created_by: req["userIdentity"].algaeh_d_app_user_id,
      updated_by: req["userIdentity"].algaeh_d_app_user_id,
    });

    console.log("update_episode", update_episode);
    console.log("insert_eposode", insert_eposode);

    req["records"] = atd_result;
    (await t).commit();
    next();
  } catch (e) {
    (await t).rollback();
    next(e);
  }
  //finally {
  //   _mysql.releaseConnection();
  // }
}
