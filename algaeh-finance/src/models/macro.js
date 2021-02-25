import algaehMysql from "algaeh-mysql";
import _ from "lodash";
export async function macro(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { from_date, to_date, bill_number } = req.query;

    let whereCondition = "";
    if (from_date && to_date) {
      whereCondition = ` DATE(bill_date) between DATE('${from_date}') and DATE('${to_date}')`;
    }
    if (bill_number) {
      if (whereCondition.length > 0) {
        whereCondition += ` and bill_number='${bill_number}'`;
      } else {
        whereCondition = ` bill_number='${bill_number}'`;
      }
    }

    const result = await _mysql
      .executeQuery({
        query: ` select * from renew_dayend_non_posted where ${whereCondition};`,
      })
      .catch((error) => {
        throw error;
      });

    const records = _.chain(result)
      .groupBy((g) => g.hims_f_billing_header_id)
      .map((details) => {
        const {
          hims_f_billing_header_id,
          finance_day_end_header_id,
          bill_number,
          pack_advance_adjust,
          company_payable,
          total_tax,
          sheet_discount_amount,
          ScreenCode,
        } = _.head(details);
        let receiptdetails = [];
        let billdetails = [];
        details.forEach((items) => {
          const {
            hims_f_billing_details_id,
            service_type_id,
            services_id,
            quantity,
            unit_cost,
            insurance_yesno,
            gross_amount,
            discount_amout,
            discount_percentage,
            net_amout,
            copay_percentage,
            copay_amount,
            deductable_amount,
            deductable_percentage,
            tax_inclusive,
            patient_tax,
            company_tax,
            total_tax,
            patient_resp,
            patient_payable,
            comapany_resp,
            company_payble,
            pre_approval,
            commission_given,
            teeth_number,
            cancel_yes_no,
            cancel_by,
            ordered_services_id,
            ordered_inventory_id,
            ordered_package_id,
            hims_f_receipt_details_id,
            hims_f_receipt_header_id,
            card_check_number,
            bank_card_id,
            expiry_date,
            pay_type,
            amount,
          } = items;
          billdetails.push({
            hims_f_billing_details_id,
            service_type_id,
            services_id,
            quantity,
            unit_cost,
            insurance_yesno,
            gross_amount,
            discount_amout,
            discount_percentage,
            net_amout,
            copay_percentage,
            copay_amount,
            deductable_amount,
            deductable_percentage,
            tax_inclusive,
            patient_tax,
            company_tax,
            total_tax,
            patient_resp,
            patient_payable,
            comapany_resp,
            company_payble,
            pre_approval,
            commission_given,
            teeth_number,
            cancel_yes_no,
            cancel_by,
            ordered_services_id,
            ordered_inventory_id,
            ordered_package_id,
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
          finance_day_end_header_id,
          bill_number,
          pack_advance_adjust,
          company_payable,
          total_tax,
          sheet_discount_amount,
          ScreenCode,
          billdetails,
          receiptdetails,
        };
      })
      .value();

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

      const deteRecords = await _mysql
        .executeQuery({
          query: `delete from  finance_day_end_sub_detail where day_end_header_id =?;
          delete from  finance_day_end_header where finance_day_end_header_id =?;`,
          values: [finance_day_end_header_id, finance_day_end_header_id],
        })
        .catch((error) => {
          throw error;
        });

      const generateAccountEntry = await fetch(
        "http://localhost:3014/api/v1/billing/generateAccountEntry",
        {
          method: "POST",
          body: JSON.stringify(records[i]),
          headers: { ...headers },
        }
      ).catch((error) => {
        throw error;
      });
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
