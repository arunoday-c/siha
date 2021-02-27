import algaehMysql from "algaeh-mysql";
import axios from "axios";
import _ from "lodash";
export async function macro(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { from_date, to_date, bill_number, transation_type } = req.query;

    let whereCondition = "";
    let records = [];
    let strUrl = "";
    if (transation_type === "1") {
      strUrl = "http://localhost:3014/api/v1/billing/generateAccountEntry";
      if (from_date && to_date) {
        whereCondition = ` DATE(bill_date) between DATE('${from_date}') and DATE('${to_date}')`;
      }
      if (bill_number) {
        // if (whereCondition.length > 0) {
        // whereCondition += ` and bill_number='${bill_number}'`;
        // } else {
        whereCondition = ` bill_number='${bill_number}'`;
        // }
      }
      const result = await _mysql
        .executeQuery({
          query: ` select * from regenerate_billing_dayend where ${whereCondition};`,
          printQuery: true,
        })
        .catch((error) => {
          throw error;
        });

      records = _.chain(result)
        .groupBy((g) => g.hims_f_billing_header_id)
        .map((details) => {
          const {
            hims_f_billing_header_id,
            bill_date,
            finance_day_end_header_id,
            patient_code,
            bill_number,
            pack_advance_adjust,
            company_payable,
            total_tax,
            sheet_discount_amount,
            receiveable_amount,
            ScreenCode,
            sub_department_id,
          } = _.head(details);
          let receiptdetails = [];
          let billdetails = [];
          details.forEach((items) => {
            const {
              // hims_f_billing_details_id,
              // service_type_id,
              services_id,
              // quantity,
              // unit_cost,
              // insurance_yesno,
              // gross_amount,
              // discount_amout,
              // discount_percentage,
              net_amout,
              // copay_percentage,
              // copay_amount,
              // deductable_amount,
              // deductable_percentage,
              // tax_inclusive,
              patient_tax,
              // company_tax,
              // total_tax,
              patient_resp,
              // patient_payable,
              // comapany_resp,
              // company_payble,
              // pre_approval,
              // commission_given,
              // teeth_number,
              // cancel_yes_no,
              // cancel_by,
              // ordered_services_id,
              // ordered_inventory_id,
              // ordered_package_id,
              hims_f_receipt_details_id,
              hims_f_receipt_header_id,
              card_check_number,
              bank_card_id,
              expiry_date,
              pay_type,
              amount,
            } = items;
            billdetails.push({
              // hims_f_billing_details_id,
              // service_type_id,
              services_id,
              // quantity,
              // unit_cost,
              // insurance_yesno,
              // gross_amount,
              // discount_amout,
              // discount_percentage,
              net_amout,
              // copay_percentage,
              // copay_amount,
              // deductable_amount,
              // deductable_percentage,
              // tax_inclusive,
              patient_tax,
              // company_tax,
              // total_tax,
              patient_resp,
              // patient_payable,
              // comapany_resp,
              // company_payble,
              // pre_approval,
              // commission_given,
              // teeth_number,
              // cancel_yes_no,
              // cancel_by,
              // ordered_services_id,
              // ordered_inventory_id,
              // ordered_package_id,
            });
            receiptdetails.push({
              hims_f_receipt_details_id,
              hims_f_receipt_header_id,
              card_check_number,
              bank_card_id,
              expiry_date,
              pay_type,
              amount,
            });
          });

          return {
            hims_f_billing_header_id,
            bill_date,
            finance_day_end_header_id,
            bill_number,
            patient_code,
            pack_advance_adjust,
            company_payable,
            total_tax,
            sheet_discount_amount,
            ScreenCode,
            receiveable_amount,
            billdetails,
            receiptdetails,
            sub_department_id,
          };
        })
        .value();
    } else if (transation_type === "2") {
      strUrl =
        "http://localhost:3014/api/v1/opBillCancellation/generateAccountEntry";
      if (from_date && to_date) {
        whereCondition = ` DATE(bill_cancel_date) between DATE('${from_date}') and DATE('${to_date}')`;
      }
      if (bill_number) {
        if (whereCondition.length > 0) {
          whereCondition += ` and bill_cancel_number='${bill_number}'`;
        } else {
          whereCondition = ` bill_cancel_number='${bill_number}'`;
        }
      }
      const result = await _mysql
        .executeQuery({
          query: ` select * from regenerate_can_billing_dayend where ${whereCondition};`,
          printQuery: true,
        })
        .catch((error) => {
          throw error;
        });

      records = _.chain(result)
        .groupBy((g) => g.hims_f_bill_cancel_header_id)
        .map((details) => {
          const {
            hims_f_bill_cancel_header_id,
            bill_cancel_date,
            finance_day_end_header_id,
            patient_code,
            bill_cancel_number,
            company_payable,
            total_tax,
            sheet_discount_amount,
            receiveable_amount,
            ScreenCode,
            sub_department_id,
          } = _.head(details);
          let receiptdetails = [];
          let billdetails = [];
          details.forEach((items) => {
            const {
              // hims_f_bill_cancel_details_id,
              // service_type_id,
              services_id,
              // quantity,
              // unit_cost,
              // insurance_yesno,
              // gross_amount,
              // discount_amout,
              // discount_percentage,
              net_amout,
              // copay_percentage,
              // copay_amount,
              // deductable_amount,
              // deductable_percentage,
              // tax_inclusive,
              patient_tax,
              // company_tax,
              // total_tax,
              patient_resp,
              // patient_payable,
              // comapany_resp,
              // company_payble,
              // pre_approval,
              // commission_given,
              // cancel_yes_no,
              // cancel_by,
              // ordered_services_id,
              // ordered_inventory_id,
              // ordered_package_id,
              hims_f_receipt_details_id,
              hims_f_receipt_header_id,
              card_check_number,
              bank_card_id,
              expiry_date,
              pay_type,
              amount,
            } = items;
            billdetails.push({
              // hims_f_billing_details_id,
              // service_type_id,
              services_id,
              // quantity,
              // unit_cost,
              // insurance_yesno,
              // gross_amount,
              // discount_amout,
              // discount_percentage,
              net_amout,
              // copay_percentage,
              // copay_amount,
              // deductable_amount,
              // deductable_percentage,
              // tax_inclusive,
              patient_tax,
              // company_tax,
              // total_tax,
              patient_resp,
              // patient_payable,
              // comapany_resp,
              // company_payble,
              // pre_approval,
              // commission_given,
              // teeth_number,
              // cancel_yes_no,
              // cancel_by,
              // ordered_services_id,
              // ordered_inventory_id,
              // ordered_package_id,
            });
            receiptdetails.push({
              hims_f_receipt_details_id,
              hims_f_receipt_header_id,
              card_check_number,
              bank_card_id,
              expiry_date,
              pay_type,
              amount,
            });
          });

          return {
            hims_f_bill_cancel_header_id,
            bill_cancel_date,
            finance_day_end_header_id,
            bill_cancel_number,
            patient_code,
            company_payable,
            total_tax,
            sheet_discount_amount,
            ScreenCode,
            receiveable_amount,
            billdetails,
            receiptdetails,
            sub_department_id,
          };
        })
        .value();
    }

    const { headers } = req;

    for (let i = 0; i < records.length; i++) {
      const {
        finance_day_end_header_id,
        // bill_number,
        // pack_advance_adjust,
        // company_payable,
        // total_tax,
        // sheet_discount_amount,
        // ScreenCode,
        // billdetails,
        // receiptdetails,
      } = records[i];

      if (finance_day_end_header_id > 0) {
        const deteRecords = await _mysql
          .executeQuery({
            query: `insert into finance_day_end_header_roll_back select * from finance_day_end_header
            where finance_day_end_header_id =?; 
            insert into finance_day_end_sub_detail_roll_back select * from finance_day_end_sub_detail
            where day_end_header_id =?;
            delete from  finance_day_end_sub_detail where day_end_header_id =?;
            delete from  finance_day_end_header where finance_day_end_header_id =?;            
          `,
            values: [
              finance_day_end_header_id,
              finance_day_end_header_id,
              finance_day_end_header_id,
              finance_day_end_header_id,
            ],
            printQuery: true,
          })
          .catch((error) => {
            throw error;
          });
      }
      await axios({
        method: "POST",
        url: strUrl,
        data: { ...records[i], closeConnection: true },
        headers: { ...headers },
      }).catch(async (error) => {
        await _mysql.executeQuery({
          query: `insert into finance_day_end_header select * from finance_day_end_header_roll_back where finance_day_end_header_id=?;
          insert into finance_day_end_sub_detail select * from finance_day_end_sub_detail_roll_back where day_end_header_id =?;
          delete from finance_day_end_header_roll_back where finance_day_end_header_id=?;
           delete from finance_day_end_sub_detail_roll_back where day_end_header_id =?;
          `,
          values: [
            finance_day_end_header_id,
            finance_day_end_header_id,
            finance_day_end_header_id,
            finance_day_end_header_id,
          ],
          printQuery: true,
        });
        if (error.response.data?.message) {
          throw new Error(error.response.data?.message);
        } else {
          throw error;
        }
      });
    }
    next();
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
