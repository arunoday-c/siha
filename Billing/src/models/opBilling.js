import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  addOpBIlling: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const utilities = new algaehUtilities();

      _mysql
        .generateRunningNumber({
          modules: ["PAT_BILL", "RECEIPT"]
        })
        .then(generatedNumbers => {
          utilities.logger().log("generatedNumbers: ", generatedNumbers);
          req.genNumber = generatedNumbers;
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      next(e);
    }
  }
};
