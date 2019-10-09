import algaehMysql from "algaeh-mysql";
// import _ from "lodash";
// import moment from "moment";
// import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  uploadEmployeeGratuity: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      const rawdata = req.body;

      const input = rawdata
        .filter(item => {
          return (
            !parseInt(item.employee_id) > 0 ||
            !parseInt(item.month) > 0 ||
            parseInt(item.month) > 12 ||
            !parseInt(item.year) > 0
          );
        })
        .map(m => {
          return m.employee_code;
        });

      if (input.length > 0) {
        req.records = {
          invalid_input: true,
          message: `Please Provide valid input for ${input}`
        };
        next();
      } else {
        const insurtColumns = [
          "employee_id",
          "year",
          "month",
          "gratuity_amount"
        ];

        _mysql
          .executeQuery({
            query:
              " INSERT INTO hims_f_gratuity_provision (??) VALUES ?  ON DUPLICATE KEY UPDATE \
              gratuity_amount=values(gratuity_amount);",
            values: rawdata,
            includeValues: insurtColumns,
            bulkInsertOrUpdate: true,
            printQuery: false
          })
          .then(finalResult => {
            _mysql.releaseConnection();
            req.records = finalResult;
            next();
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      }
    } catch (e) {
      next(e);
    }
  }
};
