//created by irfan:
let processTimeSheet = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      const syscCall = async function(attDate, religion_id, i) {
        return await new Promise((resolve, reject) => {
          try {
            connection.query(
              " select * from hims_f_leave_application where employee_id=1 and cancelled='N'\
              and (`status`='APR' or `status`='PRO') and date(?) \
              between date(from_date) and date(to_date);\
              select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday\
              from hims_d_holiday where (((date(holiday_date)= date(?) and weekoff='Y') or \
              (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
              (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?))); ",
              [attDate, attDate, attDate, attDate, religion_id],
              (error, leaveHoliday) => {
                if (error) {
                  reject(error);
                }
                setTimeout(() => {
                  resolve(leaveHoliday);
                }, 1000);
              }
            );
          } catch (e) {
            reject(e);
          }
        });
      };
      let _promises = [];
      for (let i = 0; i < 10; i++) {
        debugLog("am one:", i);
        let _sycCall = syscCall("2017-05-05", 1, i);

        _sycCall
          .then(rest => {
            debugLog("am two:", i);
          })
          .catch(e => {
            debugLog("eeeee:", e);
          });
        _promises.push(_sycCall);
      }
      Promise.all(_promises)
        .then(rse => {
          debugLog("rest:", rse);
        })
        .catch(e => {
          debugLog("e:", e);
        });
    });
  } catch (e) {
    next(e);
  }
};
