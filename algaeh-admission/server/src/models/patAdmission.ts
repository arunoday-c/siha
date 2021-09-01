// import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import hims_f_atd_admission from "../dbModels/hims_f_atd_admission";
import hims_f_atd_bed_details from "../dbModels/hims_f_atd_bed_details";
import hims_f_admission_numgen from "../dbModels/hims_f_admission_numgen";
import { RunningNumber } from "../common/runningNum";
import { Request, Response, NextFunction } from "express";
import db from "../connection";
export async function addPatienAdmission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const t = db.transaction();
  try {
    const input = req.body;
    //@ts-ignore
    const _RunningNumber = new RunningNumber<hims_f_admission_numgen, t>();
    const admission_no = await _RunningNumber
      .generateNumber("ATD")
      .catch((error) => {
        throw error;
      });

    const atd_result = await hims_f_atd_admission.create({
      admission_number: admission_no,
      admission_date: new Date(),
      admission_type: input.admission_type,
      patient_id: input.patient_id,
      ward_id: input.ward_id,
      bed_id: input.bed_id,
      sub_department_id: input.sub_department_id,
      provider_id: input.provider_id,

      created_by: req["userIdentity"].algaeh_d_app_user_id,
      updated_by: req["userIdentity"].algaeh_d_app_user_id,
    });

    const bed_result = await hims_f_atd_bed_details.create({
      admission_id: input.admission_id,
      patient_id: input.patient_id,
      doctor_id: input.doctor_id,
      service_type_id: input.service_type_id,
      services_id: input.services_id,
      ward_id: input.ward_id,

      bed_id: input.bed_id,
      insurance_yesno: input.insurance_yesno,
      insurance_provider_id: input.insurance_provider_id,
      insurance_sub_id: input.insurance_sub_id,
      network_id: input.network_id,
      insurance_network_office_id: input.insurance_network_office_id,
      policy_number: input.policy_number,

      pre_approval: input.pre_approval,
      apprv_status: input.apprv_status,
      billed: input.billed,
      quantity: input.quantity,

      unit_cost: input.unit_cost,
      gross_amount: input.gross_amount,
      discount_percentage: input.discount_percentage,
      discount_amout: input.discount_amout,

      net_amout: input.net_amout,
      copay_percentage: input.copay_percentage,
      copay_amount: input.copay_amount,
      deductable_percentage: input.deductable_percentage,
      deductable_amount: input.deductable_amount,

      patient_resp: input.patient_resp,
      comapany_resp: input.comapany_resp,
      patient_tax: input.patient_tax,
      company_tax: input.company_tax,
      patient_payable: input.patient_payable,
      company_payble: input.company_payble,
      total_tax: input.total_tax,
      total_amount: input.total_amount,
      hospital_id: req["userIdentity"].hospital_id,
    });
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
