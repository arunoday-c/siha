import algaehMysql from "algaeh-mysql";

module.exports = {
  getReceiptEntry: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let hims_f_receipt_header_id =
        req.records.hims_f_receipt_header_id ||
        req.records[0].receipt_header_id;
      _mysql
        .executeQuery({
          query:
            "select * from hims_f_receipt_header where hims_f_receipt_header_id=? and record_status='A'",
          values: [hims_f_receipt_header_id],
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_receipt_details where hims_f_receipt_header_id=? and record_status='A'",
                values: [hims_f_receipt_header_id],
                printQuery: true
              })
              .then(receiptdetails => {
                _mysql.releaseConnection();
                req.receptEntry = {
                  ...headerResult[0],
                  ...{ receiptdetails }
                };
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = headerResult;
            next();
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
