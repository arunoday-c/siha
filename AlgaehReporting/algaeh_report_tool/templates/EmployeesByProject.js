// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      let input = [];
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      const xtype = options.xtype;
      if (xtype(input["result"][0]) === "multi_char_string") {
        let resultData = input["result"].map((item) => {
          return JSON.parse(item);
        });
        resolve({ result: resultData });
      } else {
        resolve({ result: input["result"] });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { executePDF };
