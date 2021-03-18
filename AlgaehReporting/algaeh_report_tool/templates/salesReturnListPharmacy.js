// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `
          select SRH.hims_f_pharmcy_sales_return_header_id,SRH.sales_return_number,SRH.sales_return_date,SRH.net_amount, EM.full_name as cashier_name,
          PD.item_id,ITM.item_code,ITM.item_description, PD.expiry_date,PD.return_quantity,PD.quantity,PD.batchno,PD.insurance_yesno,
          PD.patient_responsibility as PD_patient_responsibility,PD.patient_tax as PD_patient_tax,PD.patient_payable as PD_patient_payable,
          PD.company_responsibility as PD_company_responsibility,PD.company_tax as PD_company_tax,PD.company_payable as PD_company_payable,
          PD.net_extended_cost as PD_net_extended_cost, (COALESCE(PD.patient_payable,0) + COALESCE(PD.company_payable,0)) as PD_net_payable
          from hims_f_pharmacy_sales_return_detail PD
          left join hims_f_pharmcy_sales_return_header SRH on PD.sales_return_header_id = SRH.hims_f_pharmcy_sales_return_header_id
          left join hims_f_patient P on SRH.patient_id = P.hims_d_patient_id
          inner join hims_d_item_master ITM on ITM.hims_d_item_master_id = PD.item_id
          inner join algaeh_d_app_user USR on USR.algaeh_d_app_user_id = SRH.created_by
          inner join hims_d_employee EM on EM.hims_d_employee_id = USR.employee_id
          where SRH.record_status='A' and SRH.location_id=? and SRH.hospital_id=? 
          and SRH.posted='Y' and date(SRH.sales_return_date) between date(?) and  date(?);
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
            .groupBy((g) => g.hims_f_pharmcy_sales_return_header_id)
            .map(function (dtl, key) {
              const {
                sales_return_number,
                sales_return_date,
                cashier_name,
              } = _.head(dtl);
              return {
                service_type: key,
                detailList: dtl,
                sales_return_number,
                sales_return_date,
                cashier_name,
                net_amount: _.sumBy(dtl, (s) => parseFloat(s.PD_net_payable)),
              };
            })
            .value();

          const net_total = options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.net_amount)),
            options.args.crypto
          );
          resolve({
            detail: result,
            net_total: net_total,
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
