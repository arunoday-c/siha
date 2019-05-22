// import moment from "moment";
import _ from "lodash";
import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  endOfService: (req, res, next) => {
    const _input = req.query;
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    _mysql
      .executeQuery({
        query:
          "select employee_id from hims_f_end_of_service EOS where employee_id = ? ;",
        values: [_input.hims_d_employee_id]
      })
      .then(end_of_service => {
        let endofServexit = false;
        utilities.logger().log("end_of_service: ", end_of_service);

        if (end_of_service.length > 0) {
          endofServexit = true;
        }
        _mysql
          .executeQuery({
            query:
              "select E.date_of_joining,E.hims_d_employee_id,E.date_of_resignation,E.employee_status, E.employe_exit_type, \
              datediff(date(date_of_resignation),date(date_of_joining))/365 endOfServiceYears,E.employee_code,E.exit_date,\
              E.full_name,E.arabic_name,E.sex,E.employee_type ,E.title_id,T.title ,T.arabic_title,\
              E.sub_department_id,E.employee_designation_id,E.date_of_birth,\
              SD.sub_department_name,SD.arabic_sub_department_name \
            from hims_d_employee E Left join hims_d_sub_department SD \
             on SD.hims_d_sub_department_id = E.sub_department_id \
            left join hims_d_title T \
            on T.his_d_title_id = E.title_id \
            where hims_d_employee_id in(?) and employee_status not in('A','I');select * from hims_d_end_of_service_options;",
            values: [_input.hims_d_employee_id],
            printQuery: true
          })
          .then(result => {
            const _result = result[0];
            const _options = result[1];

            utilities.logger().log("_result: ", _result);

            if (_result.length == 0) {
              _mysql.releaseConnection();
              next(
                utilities
                  .httpStatus()
                  .generateError(
                    utilities.httpStatus().noContent,
                    "There are no employees to process end of service"
                  )
              );
              return;
            }

            utilities.logger().log("_options: ", _options);

            if (_options.length == 0) {
              _mysql.releaseConnection();
              next(
                utilities
                  .httpStatus()
                  .generateError(500, "Please update end of service options.")
              );
              return;
            }
            const _employee = _result[0];
            const _optionsDetals = _options[0];
            let _eligibleDays = 0;
            if (_optionsDetals.end_of_service_type == "S") {
              if (
                _employee.endOfServiceYears >= 0 &&
                _employee.endOfServiceYears <=
                  _optionsDetals.from_service_range1
              ) {
                _eligibleDays =
                  _employee.endOfServiceYears * _optionsDetals.eligible_days1;
              } else if (
                _employee.endOfServiceYears >=
                  _optionsDetals.from_service_range1 &&
                _employee.endOfServiceYears <=
                  _optionsDetals.from_service_range2
              ) {
                _eligibleDays =
                  _employee.endOfServiceYears * _optionsDetals.eligible_days2;
              } else if (
                _employee.endOfServiceYears >=
                  _optionsDetals.from_service_range2 &&
                _employee.endOfServiceYears <=
                  _optionsDetals.from_service_range3
              ) {
                _eligibleDays =
                  _employee.endOfServiceYears * _optionsDetals.eligible_days3;
              } else if (
                _employee.endOfServiceYears >=
                  _optionsDetals.from_service_range3 &&
                _employee.endOfServiceYears <=
                  _optionsDetals.from_service_range4
              ) {
                _eligibleDays =
                  _employee.endOfServiceYears * _optionsDetals.eligible_days4;
              } else if (
                _employee.endOfServiceYears >=
                  _optionsDetals.from_service_range4 &&
                _employee.endOfServiceYears <=
                  _optionsDetals.from_service_range5
              ) {
                _eligibleDays =
                  _employee.endOfServiceYears * _optionsDetals.eligible_days5;
              } else if (
                _employee.endOfServiceYears >=
                _optionsDetals.from_service_range5
              ) {
                _eligibleDays =
                  _employee.endOfServiceYears * _optionsDetals.eligible_days5;
              }
            } else if (_optionsDetals.end_of_service_type == "H") {
              let by =
                _employee.endOfServiceYears -
                _optionsDetals.from_service_range1;
              let ted = 0;
              if (by > 0) {
                ted =
                  _optionsDetals.from_service_range1 *
                  _optionsDetals.eligible_days1;
                by =
                  _employee.endOfServiceYears -
                  _optionsDetals.from_service_range2;
                if (by > 0) {
                  ted =
                    (ted +
                      (_optionsDetals.from_service_range2 -
                        _optionsDetals.from_service_range1)) *
                    by;
                  by =
                    _employee.endOfServiceYears -
                    _optionsDetals.from_service_range3;
                  if (by > 0) {
                    ted =
                      (ted +
                        (_optionsDetals.from_service_range3 -
                          _optionsDetals.from_service_range2)) *
                      by;
                    by =
                      _employee.endOfServiceYears -
                      _optionsDetals.from_service_range3;
                    if (by > 0) {
                      ted =
                        (ted +
                          (_optionsDetals.from_service_range4 -
                            _optionsDetals.from_service_range3)) *
                        by;
                      by =
                        _employee.endOfServiceYears -
                        _optionsDetals.from_service_range4;
                      if (by > 0) {
                        ted =
                          (ted +
                            (_optionsDetals.from_service_range5 -
                              _optionsDetals.from_service_range4)) *
                          by;
                      } else {
                        _eligibleDays =
                          ted + by * _optionsDetals.eligible_days4;
                      }
                    } else {
                      _eligibleDays = ted + by * _optionsDetals.eligible_days3;
                    }
                  }
                } else {
                  _eligibleDays = ted + by * _optionsDetals.eligible_days2;
                }
              } else {
                ted =
                  _employee.endOfServiceYears * _optionsDetals.eligible_days1;
              }
              ted = _eligibleDays;
            }

            utilities.logger().log("_optionsDetals: ", _optionsDetals);

            let _componentsList_total = [];
            if (_optionsDetals.end_of_service_component1 != null) {
              _componentsList_total.push(
                _optionsDetals.end_of_service_component1
              );
            }
            if (_optionsDetals.end_of_service_component2 != null) {
              _componentsList_total.push(
                _optionsDetals.end_of_service_component2
              );
            }
            if (_optionsDetals.end_of_service_component3 != null) {
              _componentsList_total.push(
                _optionsDetals.end_of_service_component3
              );
            }
            if (_optionsDetals.end_of_service_component4 != null) {
              _componentsList_total.push(
                _optionsDetals.end_of_service_component4
              );
            }

            utilities
              .logger()
              .log("_componentsList_total: ", _componentsList_total);

            _mysql
              .executeQuery({
                query:
                  "select hims_d_employee_earnings_id,employee_id, earnings_id,earning_deduction_description,\
                  EE.short_desc, amount from hims_d_employee_earnings EE, hims_d_earning_deduction ED where \
                  ED.hims_d_earning_deduction_id = EE.earnings_id \
                  and EE.employee_id=? and ED.hims_d_earning_deduction_id in(?) and ED.record_status='A'",
                values: [_input.hims_d_employee_id, _componentsList_total],
                printQuery: true
              })
              .then(earnings => {
                _mysql.releaseConnection();
                let _computatedAmout = [];
                if (_optionsDetals.end_of_service_calculation == "AN") {
                  _computatedAmout = _.chain(earnings).map(items => {
                    return (items.amount * 12) / 365;
                  });
                } else if (_optionsDetals.end_of_service_calculation == "FI") {
                  _computatedAmout = _.chain(earnings).map(items => {
                    return items.amount / _optionsDetals.end_of_service_days;
                  });
                }
                const _sumOfTotalEarningComponents = _.sumBy(earnings, s => {
                  return s.amount;
                });
                const _computatedAmoutSum =
                  _computatedAmout.reduce((a, b) => {
                    return a + b;
                  }, 0) * _eligibleDays;
                req.records = {
                  computed_amount: _computatedAmoutSum,
                  paybale_amout: _computatedAmoutSum,
                  ..._employee,
                  componentList: earnings,
                  totalEarningComponents: _sumOfTotalEarningComponents,
                  eligible_day: _eligibleDays,
                  endofServexit: endofServexit
                };
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  endOfServiceAdd: (req, res, next) => {
    const _input = req.body;
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    _mysql
      .executeQuery({
        query:
          "select employee_id from hims_f_end_of_service EOS where employee_id = ? ;",
        values: [_input.employee_id]
      })
      .then(end_of_service => {
        utilities.logger().log("end_of_service: ", end_of_service.length);
        if (end_of_service.length > 0) {
          _mysql.releaseConnection();
          req.records = {
            message: "End of Service/Gratuity already processed."
          };
          req.flag = 1;
          next();
        } else {
          _mysql
            .generateRunningNumber({
              modules: ["END_OF_SERVICE_NO"]
            })
            .then(result => {
              if (result.length == 0) {
                _mysql.rollBackTransaction(() => {
                  next(
                    utilities
                      .httpStatus()
                      .generateError(
                        utilities.httpStatus().noContent,
                        "Please add number generation for end of service"
                      )
                  );
                });
                return;
              }

              _mysql
                .executeQuery({
                  query:
                    "insert into hims_f_end_of_service(`end_of_service_number`,\
            `employee_id`,`transaction_date`,`exit_type`,`join_date`,\
            `exit_date`,`service_years`,`payable_days`,`previous_gratuity_amount`,\
            `calculated_gratutity_amount`,`payable_amount`, `gratuity_status`, `remarks`,\
            `created_by`,`created_date`,`updated_by`,`updated_date`,hospital_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  values: [
                    result[0],
                    _input.employee_id,
                    new Date(),
                    _input.exit_type,
                    _input.join_date,
                    _input.exit_date,
                    _input.service_years,
                    _input.payable_days,
                    0,
                    _input.computed_amount,
                    _input.paybale_amout,
                    _input.gratuity_status,
                    _input.remarks,
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    req.userIdentity.hospital_id
                  ]
                })
                .then(insertResult => {
                  _mysql.commitTransaction((error, resu) => {
                    if (error) {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    } else {
                      req.records = {
                        ...insertResult,
                        end_of_service_number: result[0]
                      };
                      next();
                    }
                  });
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            })
            .catch(e => {
              next(e);
            });
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  }
};
