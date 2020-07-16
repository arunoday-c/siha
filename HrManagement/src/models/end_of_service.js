// import moment from "moment";
import _ from "lodash";
import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  endOfServiceAdd: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    try {
      _mysql
        .executeQuery({
          query: `UPDATE hims_f_end_of_service set transaction_date=?,join_date=?,exit_date=?,payable_days=?,
        service_years=?,calculated_gratutity_amount=?,gratuity_status=?,
        exit_type=?,remarks=?,created_date=?,created_by=?,
        updated_date=?,updated_by=? where employee_id=? `,
          values: [
            new Date(),
            input.join_date,
            input.exit_date,
            input.payable_days,
            input.service_years,
            input.computed_amount,
            // input.payable_amout,
            input.gratuity_status,
            input.exit_type,
            input.remarks,

            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.employee_id,
          ],
        })
        .then((result) => {
          _mysql.commitTransaction((error, resu) => {
            if (error) {
              _mysql.rollBackTransaction(() => {
                next(error);
              });
            } else {
              req.records = {
                result,
              };
              next();
            }
          });
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  endOfService: (req, res, next) => {
    const _input = req.query;
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    const { decimal_places, org_country_id } = req.userIdentity;
    _mysql
      .executeQuery({
        query: `select EOS.hims_f_end_of_service_id, EOS.employee_id,EOS.join_date,EOS.exit_date,
        EOS.payable_days,EOS.service_years,EOS.payable_days,EOS.calculated_gratutity_amount,
        EOS.payable_amount,EOS.gratuity_status,EOS.remarks,EOS.total_gratutity_amount,EOS.transaction_date from hims_f_end_of_service EOS 
        where employee_id = ?;`,
        values: [_input.hims_d_employee_id],
      })
      .then((end_of_service) => {
        let endofServexit = false;
        if (
          !end_of_service.length > 0 ||
          end_of_service[0].gratuity_status === "PEN" ||
          end_of_service[0].gratuity_status === "PEF"
        ) {
          endofServexit = true;
          _mysql
            .executeQuery({
              query:
                "select E.date_of_joining,E.hims_d_employee_id,E.date_of_resignation,E.employee_status, E.employe_exit_type, \
              datediff(date(exit_date),date(date_of_joining))/365 endOfServiceYears,E.employee_code,E.exit_date,\
              E.full_name,E.arabic_name,E.sex,E.employee_type ,E.title_id,T.title ,T.arabic_title,\
              E.sub_department_id,E.employee_designation_id,E.date_of_birth,E.eos_id,\
              SD.sub_department_name,SD.arabic_sub_department_name,E.gratuity_encash \
            from hims_d_employee E Left join hims_d_sub_department SD \
             on SD.hims_d_sub_department_id = E.sub_department_id \
            left join hims_d_title T \
            on T.his_d_title_id = E.title_id \
            where hims_d_employee_id in(?) and employee_status not in('A','I');select * from hims_d_end_of_service_options;",
              values: [_input.hims_d_employee_id],
              printQuery: true,
            })
            .then((result) => {
              const _result = result[0];
              const _options = result[1];
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
              const isRoundOffRequired =
                _optionsDetals["round_off_nearest_year"];
              if (isRoundOffRequired === "Y") {
                _employee.endOfServiceYears = parseFloat(
                  _employee.endOfServiceYears
                ).toFixed(decimal_places);
              }

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
                const queryForm = _mysql.executeQuery({
                  query:
                    "select hims_d_employee_earnings_id,employee_id, earnings_id,earning_deduction_description,\
                  EE.short_desc, amount from hims_d_employee_earnings EE, hims_d_earning_deduction ED where \
                  ED.hims_d_earning_deduction_id = EE.earnings_id \
                  and EE.employee_id=? and ED.hims_d_earning_deduction_id in(?) and ED.record_status='A'",
                  values: [_input.hims_d_employee_id, _componentsList_total],
                  printQuery: true,
                });
                if (org_country_id === 178) {
                  eosBySaudaiRule(
                    _optionsDetals,
                    _employee,
                    queryForm,
                    _mysql,
                    req,
                    next
                  );
                } else {
                  const empEOSYears = parseFloat(_employee.endOfServiceYears);
                  let difference =
                    empEOSYears - _optionsDetals.from_service_range1;
                  if (difference > 0) {
                    let hirearchical =
                      _optionsDetals.from_service_range1 *
                      _optionsDetals.eligible_days1;
                    _eligibleDays = hirearchical;
                    difference =
                      empEOSYears - _optionsDetals.from_service_range2;
                    if (difference > 0) {
                      hirearchical =
                        empEOSYears - _optionsDetals.from_service_range2;
                      if (hirearchical > 0) {
                        hirearchical =
                          empEOSYears - _optionsDetals.from_service_range3;
                        if (hirearchical > 0) {
                          hirearchical =
                            empEOSYears - _optionsDetals.from_service_range4;

                          _eligibleDays +=
                            (empEOSYears - _optionsDetals.from_service_range3) *
                            _optionsDetals.eligible_days5;
                        } else {
                          _eligibleDays +=
                            (empEOSYears - _optionsDetals.from_service_range3) *
                            _optionsDetals.eligible_days4;
                        }
                      } else {
                        _eligibleDays +=
                          (empEOSYears - _optionsDetals.from_service_range2) *
                          _optionsDetals.eligible_days3;
                      }
                    } else {
                      _eligibleDays +=
                        (empEOSYears - _optionsDetals.from_service_range1) *
                        _optionsDetals.eligible_days2;
                    }
                  } else {
                    _eligibleDays = empEOSYears * _optionsDetals.eligible_days1;
                  }
                  queryForm
                    .then((earnings) => {
                      _mysql.releaseConnection();
                      let _computatedAmout = 0;
                      const _sumOfTotalEarningComponents = _.sumBy(
                        earnings,
                        (s) => {
                          return s.amount;
                        }
                      );
                      let gratuity = 0;
                      const gratuity_encash = parseFloat(
                        _employee["gratuity_encash"]
                      );
                      if (_optionsDetals.end_of_service_calculation == "AN") {
                        gratuity = (_sumOfTotalEarningComponents * 12) / 365;
                      } else if (
                        _optionsDetals.end_of_service_calculation == "FI"
                      ) {
                        gratuity = _sumOfTotalEarningComponents / 30;
                      }
                      const actual_maount = _eligibleDays * gratuity;
                      _computatedAmout = actual_maount - gratuity_encash;
                      const remarks = end_of_service[0]
                        ? end_of_service[0].remarks
                        : "";
                      const gratuityStatus = end_of_service[0]
                        ? end_of_service[0].gratuity_status
                        : "";
                      req.records = {
                        computed_amount: _computatedAmout, //_computatedAmoutSum,
                        paybale_amout: _computatedAmout, //_computatedAmoutSum,
                        ..._employee,
                        componentList: earnings, //earnings,
                        totalEarningComponents: _sumOfTotalEarningComponents,
                        eligible_day: _eligibleDays,
                        endofServexit: endofServexit,
                        gratuity_amount: gratuity,
                        gratuity_encash: gratuity_encash,
                        actual_maount: actual_maount,
                        gratuity_status: gratuityStatus,
                        total_gratutity_amount: actual_maount,
                        remarks: remarks,
                      };

                      next();
                    })
                    .catch((error) => {
                      _mysql.releaseConnection();
                      next(error);
                    });
                }
              }
              // _mysql.releaseConnection();
              // next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql
            .executeQuery({
              query: `select E.hims_d_employee_id,E.date_of_resignation,E.employee_status, E.employe_exit_type,E.employee_code,\
            E.full_name,E.arabic_name,E.sex,E.employee_type ,E.title_id,T.title ,T.arabic_title,\
            E.sub_department_id,E.employee_designation_id,E.date_of_birth,E.eos_id,\
            SD.sub_department_name,SD.arabic_sub_department_name,E.gratuity_encash \
          from hims_d_employee E Left join hims_d_sub_department SD \
           on SD.hims_d_sub_department_id = E.sub_department_id \
          left join hims_d_title T \
          on T.his_d_title_id = E.title_id \
          where hims_d_employee_id in(?) and employee_status not in('A','I'); `,
              values: [_input.hims_d_employee_id],
            })
            .then((result) => {
              const endOfService = end_of_service[0];
              const result1 = result[0];

              // const gratuityAmount =
              //   parseFloat(endOfService.calculated_gratutity_amount) +
              //   parseFloat(result1.gratuity_encash);

              req.records = Object.assign(
                {
                  ...endOfService,
                  actual_maount: endOfService.total_gratutity_amount,
                  date_of_joining: endOfService.join_date,
                  endOfServiceYears: endOfService.service_years,
                  eligible_day: endOfService.payable_days,
                },
                ...result
              );

              _mysql.releaseConnection();
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  saveEndOfService: (req, res, next) => {
    const _input = req.body;
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    _mysql
      .executeQuery({
        query:
          "select employee_id from hims_f_end_of_service EOS where employee_id = ? ;",
        values: [_input.employee_id],
      })
      .then((end_of_service) => {
        utilities.logger().log("end_of_service: ", end_of_service.length);
        if (end_of_service.length > 0) {
          if (end_of_service[0].gratuity_status === "PRO") {
            _mysql.releaseConnection();
            req.records = {
              message: "End of Service/Gratuity already processed.",
            };
            req.flag = 1;
            next();
          } else {
            _mysql
              .executeQuery({
                query: `UPDATE hims_f_end_of_service set join_date=?,exit_date=?,payable_days=?,
            service_years=?,calculated_gratutity_amount=?,payable_amount=?,gratuity_status=?,
            exit_type=?,remarks=?,total_gratutity_amount=?,transaction_date=?,created_date=?,created_by=?,
            updated_date=?,updated_by=? where employee_id= ? `,
                values: [
                  _input.join_date,
                  _input.exit_date,
                  _input.payable_days,
                  _input.service_years,
                  _input.computed_amount,
                  _input.paybale_amout,
                  _input.gratuity_status,
                  _input.exit_type,
                  _input.remarks,
                  _input.total_gratutity_amount,
                  new Date(),

                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  _input.employee_id,
                ],
              })
              .then((result) => {
                _mysql.releaseConnection();
                req.records = { result };
                next();
              })
              .catch((error) => {
                _mysql.releaseConnection();
                next(error);
              });
          }
        } else {
          _mysql
            .generateRunningNumber({
              user_id: req.userIdentity.algaeh_d_app_user_id,
              numgen_codes: ["END_OF_SERVICE_NO"],
              table_name: "hims_f_hrpayroll_numgen",
            })
            .then((generatedNumbers) => {
              // if (result.length == 0) {
              //   _mysql.rollBackTransaction(() => {
              //     next(
              //       utilities
              //         .httpStatus()
              //         .generateError(
              //           utilities.httpStatus().noContent,
              //           "Please add number generation for end of service"
              //         )
              //     );
              //   });
              //   return;
              // }

              _mysql
                .executeQuery({
                  query:
                    "insert into hims_f_end_of_service(`end_of_service_number`,\
            `employee_id`,`exit_type`,`join_date`,\
            `exit_date`,`service_years`,`payable_days`,`previous_gratuity_amount`,\
            `calculated_gratutity_amount`,`payable_amount`, `gratuity_status`, `remarks`,`total_gratutity_amount`,\
            `transaction_date`,`created_by`,`created_date`,`updated_by`,`updated_date`,hospital_id) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  values: [
                    generatedNumbers.END_OF_SERVICE_NO,
                    _input.employee_id,

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
                    _input.total_gratutity_amount,
                    new Date(),

                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    req.userIdentity.hospital_id,
                  ],
                })
                .then((insertResult) => {
                  _mysql.commitTransaction((error, resu) => {
                    if (error) {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    } else {
                      req.records = {
                        ...insertResult,
                        end_of_service_number:
                          generatedNumbers.END_OF_SERVICE_NO,
                      };
                      next();
                    }
                  });
                })
                .catch((error) => {
                  _mysql.releaseConnection();
                  next(error);
                });
            })
            .catch((e) => {
              next(e);
            });
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
};

function eosBySaudaiRule(options, employee, queryForm, _mysql, req, next) {
  const { endOfServiceYears, employee_status } = employee;
  const {
    from_service_range1,
    from_service_range2,
    from_service_range3,
    from_service_range4,
    from_service_range5,
    eligible_days1,
    eligible_days2,
    eligible_days3,
    eligible_days4,
    eligible_days5,
    benifit_day1,
    benifit_day2,
    benifit_day3,
    benifit_day4,
    benifit_day5,
  } = options;

  const eosYears =
    typeof endOfServiceYears === "string"
      ? parseFloat(endOfServiceYears)
      : endOfServiceYears;
  queryForm.then((earnings) => {
    _mysql.releaseConnection();
    const sumOfEarning = _.sumBy(earnings, (s) => {
      return typeof s.amount === "string" ? parseFloat(s.amount) : s.amount;
    });
    const frm_ser_range1 = parseFloat(from_service_range1);
    const frm_ser_range2 = parseFloat(from_service_range2);
    const frm_ser_range3 = parseFloat(from_service_range3);
    const frm_ser_range4 = parseFloat(from_service_range4);
    const frm_ser_range5 = parseFloat(from_service_range5);
    let entitled_amount = 0;
    let benefit_amount = 0;
    if (employee_status === "R") {
      if (eosYears >= frm_ser_range1) {
        const service =
          eosYears >= frm_ser_range2 ? frm_ser_range2 : frm_ser_range1;
        let total = sumOfEarning * service;
        entitled_amount = total * (eligible_days2 / 30);
        const eosDifference = eosYears - service;
        if (eosDifference > 0) {
          if (parseInt(eosYears) <= frm_ser_range3) {
            total = sumOfEarning * eosDifference;
            const ent_amt = total * (eligible_days3 / 30);
            entitled_amount = ent_amt + entitled_amount;
            benefit_amount = entitled_amount * benifit_day3;
          } else if (parseInt(eosYears) > frm_ser_range3) {
            total = sumOfEarning * eosDifference;
            entitled_amount = entitled_amount + total * (eligible_days4 / 30);
            benefit_amount = entitled_amount * benifit_day4;
          }
        } else {
          benefit_amount = entitled_amount * benifit_day2;
        }
      }
    } else if (employee_status === "T") {
      let firstPeriod,
        secondPeriod = 0;
      if (eosYears > frm_ser_range2) {
        firstPeriod = frm_ser_range2;
        secondPeriod = eosYears - frm_ser_range2;
      } else {
        firstPeriod = eosYears;
      }
      entitled_amount =
        (firstPeriod + secondPeriod) * sumOfEarning * (eligible_days2 / 30);
      benefit_amount =
        firstPeriod * sumOfEarning * (eligible_days2 / 30) +
        secondPeriod * sumOfEarning;
    }

    req.records = {
      componentList: earnings,
      computed_amount: benefit_amount,
      paybale_amout: benefit_amount,
      entitled_amount,
      ...employee,
      totalEarningComponents: sumOfEarning,
      eligible_day: eosYears,
    };
    next();
  });
}
