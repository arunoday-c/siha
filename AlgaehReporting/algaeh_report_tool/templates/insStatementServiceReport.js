const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;
      options.mysql
        .executeQuery({
          query: `select INS.insurance_statement_number,INS.seq_statememt_number,INS.total_gross_amount,INS.total_company_responsibility,INS.total_company_vat,INS.total_company_payable,INS.from_date,INS.to_date,INS.transaction_date,SUB.insurance_sub_name,SUB.arabic_sub_name,SUB.eng_address,SUB.ar_address,SUB.transaction_number
          from hims_f_invoice_header IVH
          inner join hims_f_insurance_statement INS on INS.hims_f_insurance_statement_id = IVH.insurance_statement_id
          inner join hims_d_insurance_sub SUB on SUB.hims_d_insurance_sub_id = IVH.sub_insurance_id
          where IVH.insurance_statement_id=? group by IVH.insurance_statement_id;
          select d.service_id, s.service_code,s.service_name,count(*) as quantity,d.unit_cost,sum(d.company_resp) as company_resp,sum(d.company_tax) as company_tax, sum(d.company_payable) as company_payable
            from hims_f_invoice_details d 
            inner join hims_d_services s on d.service_id = s.hims_d_services_id 
            where  invoice_header_id in (select hims_f_invoice_header_id from hims_f_invoice_header where insurance_statement_id= ?) group by d.service_id;`,
          values: [
            input.hims_f_insurance_statement_id,
            input.hims_f_insurance_statement_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          const header = _.head(result[0]);
          const detail = result[1];
          const data = {
            header: header,
            details: detail,
            net_company_resp: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.company_resp)),
              options.args.crypto
            ),
            net_company_tax: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.company_tax)),
              options.args.crypto
            ),
            net_company_payable: options.currencyFormat(
              _.sumBy(detail, (s) => parseFloat(s.company_payable)),
              options.args.crypto
            ),
            currency: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyheader: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
          };
          resolve(data);
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
