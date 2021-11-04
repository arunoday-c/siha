// const { MONTHS } = require("./GlobalVariables.json");
// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      let input = {};
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;

      const params = options.args.reportParams;
      // const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQry = "";

      let limit_from = undefined;
      let limit_to = undefined;
      if (options.args.recordSetup) {
        limit_from = options.args.recordSetup
          ? options.args.recordSetup.limit_from
          : undefined;
        limit_to = options.args.recordSetup
          ? options.args.recordSetup.limit_to
          : undefined;
      }
      let totalQuery = "";
      let limitDefine = "";
      let rowsPerPage = undefined;
      // console.log("limit_from && limit_to", limit_from && limit_to);
      if (limit_from !== undefined && limit_from === 0) {
        totalQuery = "SELECT FOUND_ROWS() total_pages;";
        rowsPerPage = limit_to;
      }
      if (limit_from !== undefined && limit_to !== undefined) {
        limitDefine = ` limit ${limit_to} offset ${limit_from}`;
      }

      options.mysql
        .executeQuery({
          query: `
                select ${
                  totalQuery !== "" ? "SQL_CALC_FOUND_ROWS" : ""
                } * from view_date_wise_leaf_node where voucher_type_cl='year_end' and payment_date between (?) and (?)  ${strQry} order by payment_date ${limitDefine} ;
                ${totalQuery}
                `,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((out_put) => {
          const output = totalQuery !== "" ? out_put[0] : out_put;
          const totalRecords =
            totalQuery !== "" ? _.head(out_put[1]).total_pages : undefined;
          const { child_name, ledger_code } = _.head(output);
          resolve({
            account_name: child_name,
            ledger_code: ledger_code,
            from_date: moment(input.from_date, "YYYY-MM-DD").format(
              "DD-MM-YYYY"
            ),
            to_date: moment(input.to_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
            details: output,
            totalRecords,
            decimalOnly: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyOnly: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
          });
        })
        .catch((e) => {
          console.log("EEEE:", e);
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
