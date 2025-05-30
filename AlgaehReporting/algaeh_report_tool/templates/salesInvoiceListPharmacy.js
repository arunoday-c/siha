// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `
          select PH.hims_f_pharmacy_pos_header_id,PH.pos_number, PH.pos_date, EM.full_name as cashier_name,
          CASE WHEN PH.pos_customer_type='OP' THEN P.full_name else PH.patient_name END as patient_full_name,
          PH.patient_tax,PH.patient_payable,PH.company_tax,PH.company_payable,PH.net_amount,
          PD.item_id,ITM.item_code,IC.category_desc,ITM.item_description, PD.quantity,PD.expiry_date,PD.qtyhand,PD.quantity,PD.batchno,PD.insurance_yesno,
          PD.patient_responsibility as PD_patient_responsibility,PD.patient_tax as PD_patient_tax,PD.patient_payable as PD_patient_payable,
          PD.company_responsibility as PD_company_responsibility,PD.company_tax as PD_company_tax,PD.company_payable as PD_company_payable,
          PD.net_extended_cost as PD_net_extended_cost, COALESCE(PD.patient_payable,0) as PD_net_payable
          from hims_f_pharmacy_pos_detail PD
          left join hims_f_pharmacy_pos_header PH on PD.pharmacy_pos_header_id = PH.hims_f_pharmacy_pos_header_id
          left join hims_f_patient P on PH.patient_id = P.hims_d_patient_id
          inner join hims_d_item_master ITM on ITM.hims_d_item_master_id = PD.item_id
          left join hims_d_item_category IC on ITM.category_id = IC.hims_d_item_category_id
          inner join algaeh_d_app_user USR on USR.algaeh_d_app_user_id = PH.created_by
          inner join hims_d_employee EM on EM.hims_d_employee_id = USR.employee_id
          where PD.pharmacy_pos_header_id = PH.hims_f_pharmacy_pos_header_id and 
          PH.record_status ='A' and PH.location_id=? and PH.hospital_id=? and PH.cancelled='N' 
          and PH.cancelled='N' and PH.posted='Y' and date(PH.pos_date) between date(?) and date(?);
          `,
          values: [
            input.location_id,
            input.hospital_id,
            input.from_date,
            input.to_date,
          ],
          printQuery: true,
        })
        .then((results) => {
          const result = _.chain(results)
            .groupBy((g) => g.hims_f_pharmacy_pos_header_id)
            .map(function (dtl, key) {
              // const sum_amount = _.chain(dtl)
              //   .sumBy((s) => parseFloat(s.net_amount))
              //   .value()
              //   .toFixed(decimal_places);

              const { pos_number, pos_date, cashier_name } = _.head(dtl);
              return {
                service_type: key,
                detailList: dtl,
                cashier_name,
                pos_number,
                pos_date,
                net_PD_patient_responsibility: _.sumBy(dtl, (s) =>
                  parseFloat(s.PD_patient_responsibility)
                ),
                net_PD_patient_tax: _.sumBy(dtl, (s) =>
                  parseFloat(s.PD_patient_tax)
                ),
                net_PD_company_responsibility: _.sumBy(dtl, (s) =>
                  parseFloat(s.PD_company_responsibility)
                ),
                net_PD_company_tax: _.sumBy(dtl, (s) =>
                  parseFloat(s.PD_company_tax)
                ),
                net_PD_net_payable: _.sumBy(dtl, (s) =>
                  parseFloat(s.PD_net_payable)
                ),
                // sum_amount: sum_amount,
              };
            })
            .value();

          const final_net_PD_patient_responsibility = _.sumBy(result, (s) =>
            parseFloat(s.net_PD_patient_responsibility)
          );
          const final_net_PD_patient_tax = _.sumBy(result, (s) =>
            parseFloat(s.net_PD_patient_tax)
          );
          const final_net_PD_company_responsibility = _.sumBy(result, (s) =>
            parseFloat(s.net_PD_company_responsibility)
          );
          const final_net_PD_company_tax = _.sumBy(result, (s) =>
            parseFloat(s.net_PD_company_tax)
          );
          const final_net_PD_net_payable = _.sumBy(result, (s) =>
            parseFloat(s.net_PD_net_payable)
          );

          resolve({
            detail: result,
            final_net_PD_patient_responsibility: final_net_PD_patient_responsibility,
            final_net_PD_patient_tax: final_net_PD_patient_tax,
            final_net_PD_company_responsibility: final_net_PD_company_responsibility,
            final_net_PD_company_tax: final_net_PD_company_tax,
            final_net_PD_net_payable: final_net_PD_net_payable,
            decimalOnly: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyOnly: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
          });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
