// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      // const utilities = new algaehUtilities();
      let input = {};

      const params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      let strQuery = "";
      if (input.return_status == "Y") {
        strQuery += ` and REH.return_done='Y'`;
      } else if (input.return_status == "N") {
        strQuery += ` and REH.return_done='N'`;
      }

      if (input.posted_status == "Y") {
        strQuery += ` and REH.posted='Y'`;
      } else if (input.posted_status == "N") {
        strQuery += ` and REH.posted='N'`;
      }

      options.mysql
        .executeQuery({
          query: `
          SELECT REH.hims_f_procurement_grn_header_id,REH.vendor_id,REH.grn_number,REH.grn_date,POH.purchase_number,
          VN.vendor_name, DN.delivery_note_number, DN.dn_date,REH.sub_total,REH.detail_discount,REH.net_total,REH.total_tax,
          REH.net_payable,EM.full_name as created_user,REH.created_by,REH.inovice_number,REH.invoice_date,
          case when REH.return_done='Y' then 'Yes' else 'No' end as return_done,
          case when REH.posted='Y' then 'Yes' else 'No' end as is_posted
          FROM hims_f_procurement_grn_header REH
          inner join  hims_f_procurement_grn_detail RED on RED.grn_header_id = REH.hims_f_procurement_grn_header_id
          inner join hims_f_procurement_po_header POH on POH.hims_f_procurement_po_header_id = REH.po_id and POH.po_from = 'PHR'
          inner join hims_d_vendor VN on VN.hims_d_vendor_id = REH.vendor_id
          inner join hims_f_procurement_dn_header DN on DN.hims_f_procurement_dn_header_id=RED.dn_header_id
          inner join algaeh_d_app_user USR on USR.algaeh_d_app_user_id = REH.created_by
          inner join hims_d_employee EM on EM.hims_d_employee_id=USR.employee_id
          where date(REH.grn_date)  between date(?) and date(?) and REH.hospital_id=? ${strQuery}; `,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          options.mysql.releaseConnection();

          if (result.length > 0) {
            const nationgWiseEmp = _.chain(result)
              .groupBy((g) => g.hims_f_procurement_grn_header_id)
              .map((m) => {
                return {
                  grn_number: m[0].grn_number,
                  grn_date: m[0].grn_date,
                  vendor_name: m[0].vendor_name,
                  purchase_number: m[0].purchase_number,
                  delivery_note_number: m[0].delivery_note_number,
                  inovice_number: m[0].inovice_number,
                  invoice_date: m[0].invoice_date,
                  created_user: m[0].created_user,
                  return_done: m[0].return_done,
                  is_posted: m[0].is_posted,
                  net_total: m[0].net_total,
                  total_tax: m[0].total_tax,
                  net_payable: m[0].net_payable,
                  poitems: m,
                };
              })
              .value();

            resolve({
              result: nationgWiseEmp,
              total_net_total: options.currencyFormat(
                _.sumBy(nationgWiseEmp, (s) => parseFloat(s.net_total)),
                options.args.crypto
              ),
              total_total_tax: options.currencyFormat(
                _.sumBy(nationgWiseEmp, (s) => parseFloat(s.total_tax)),
                options.args.crypto
              ),
              total_net_payable: options.currencyFormat(
                _.sumBy(nationgWiseEmp, (s) => parseFloat(s.net_payable)),
                options.args.crypto
              ),
              currencyOnly: {
                decimal_places,
                addSymbol: false,
                symbol_position,
                currency_symbol,
              },
            });
          } else {
            resolve({
              result: result,
              total_net_total: 0,
              total_total_tax: 0,
              total_net_payable: 0,
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
          }
        })
        .catch((e) => {
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
