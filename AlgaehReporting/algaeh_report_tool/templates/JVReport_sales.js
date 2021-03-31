const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      console.log("INPUT:", input);

      options.mysql
        .executeQuery({
          query: `SELECT VD.voucher_no,VD.voucher_type,VD.voucher_no,FD.sub_department_id,FD.project_id,PR.project_desc,SD.sub_department_name, 
          CASE WHEN cost_center_type ='P' THEN project_desc ELSE sub_department_name END as cost_center_name,
          AD.account_name, AD.arabic_account_name, CD.child_name,CD.arabic_child_name,CD.ledger_code,FD.debit_amount, FD.credit_amount,VD.amount,
          FD.payment_type, FD.payment_date, FD.narration as narration_detail, VD.narration as narration_head, FO.cost_center_type
          FROM finance_voucher_details as FD
          inner join finance_account_head AD on FD.head_id = AD.finance_account_head_id
          inner join finance_account_child CD on FD.child_id = CD.finance_account_child_id
          inner join finance_voucher_header VD on FD.voucher_header_id = VD.finance_voucher_header_id
          left join hims_d_sub_department SD on SD.hims_d_sub_department_id = FD.sub_department_id
          left join hims_d_project PR on PR.hims_d_project_id = FD.project_id
          left join finance_options FO on FO.default_branch_id = FD.hospital_id
          where VD.finance_voucher_header_id=? and FD.pl_entry ='N';`,
          values: [input.voucher_header_id],
          printQuery: true,
        })
        .then((result) => {
          // console.log("resultHeader=", result);
          resolve({
            resultHeader: result.length > 0 ? result[0] : {},
            // subTotal:resultHeader.amount,
            resultInvoice: result,
            totalDr: _.sumBy(result, (s) => parseFloat(s.debit_amount)),
            totalCr: _.sumBy(result, (s) => parseFloat(s.credit_amount)),
            currency: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyHeader: {
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
