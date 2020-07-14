import algaehMysql from "algaeh-mysql";

export function getContractManagement(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    let strQuery = "";
    if (req.query.HRMNGMT_Active === "true") {
      strQuery =
        "SELECT CM.* , E.full_name as employee_name from hims_f_contract_management CM \
            inner join  hims_d_employee E on  CM.incharge_employee_id = E.hims_d_employee_id \
            where CM.contract_number =? ";
    } else {
      strQuery =
        "SELECT * from hims_f_contract_management CM where contract_number =? ";
    }

    _mysql
      .executeQuery({
        query: strQuery,
        values: [req.query.contract_number],
        printQuery: true,
      })
      .then((headerResult) => {
        if (headerResult.length != 0) {
          _mysql
            .executeQuery({
              query:
                "select QS.*, S.service_name from hims_f_contract_management_services QS \
                            inner join hims_d_services S on S.hims_d_services_id = QS.services_id \
                            where contract_management_id=? and QS.record_status='A';",
              values: [headerResult[0].hims_f_contract_management_id],
              printQuery: true,
            })
            .then((contract_services) => {
              _mysql.releaseConnection();
              req.records = {
                ...headerResult[0],
                ...{ contract_services },
              };
              next();
            })
            .catch((error) => {
              _mysql.releaseConnection();
              next(error);
            });
        } else {
          _mysql.releaseConnection();
          req.records = headerResult;
          next();
        }
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}

export function addContractManagement(req, res, next) {
  const _mysql = new algaehMysql();

  try {
    let input = req.body;
    let contract_number = "";

    _mysql
      .generateRunningNumber({
        user_id: req.userIdentity.algaeh_d_app_user_id,
        numgen_codes: ["CONTRACT_MANAGEMENT"],
        table_name: "hims_f_sales_numgen",
      })
      .then((generatedNumbers) => {
        contract_number = generatedNumbers.CONTRACT_MANAGEMENT;

        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_f_contract_management (contract_number, contract_date, customer_id, \
                                start_date, end_date, contract_code, quotation_ref_numb, terms_conditions, \
                                incharge_employee_id, notification_days1, notification_days2, project_id,\
                                created_date, created_by, updated_date, updated_by, hospital_id)\
                          values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              contract_number,
              new Date(),
              input.customer_id,
              input.start_date,
              input.end_date,
              input.contract_code,
              input.quotation_ref_numb,
              input.terms_conditions,
              input.incharge_employee_id,
              input.notification_days1,
              input.notification_days2,
              input.project_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hospital_id,
            ],
            printQuery: true,
          })
          .then((headerResult) => {
            // console.log("headerResult", headerResult);
            let IncludeValues = [];
            IncludeValues = [
              "services_id",
              "service_frequency",
              "service_price",
              "comments",
            ];

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_f_contract_management_services(??) VALUES ?",
                values: input.contract_services,
                includeValues: IncludeValues,
                extraValues: {
                  contract_management_id: headerResult.insertId,
                },
                bulkInsertOrUpdate: true,
                printQuery: true,
              })
              .then((detailResult) => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    contract_number: contract_number,
                    hims_f_contract_management_id: headerResult.insertId,
                  };
                  return next();
                });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}

export function getContractManagementList(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    console.log("getContractManagement: ");
    let strQuery = "";

    if (req.query.HRMNGMT_Active === "true") {
      strQuery =
        "SELECT CM.* , E.full_name as employee_name, C.customer_name from hims_f_contract_management CM \
            inner join  hims_d_employee E on  CM.incharge_employee_id = E.hims_d_employee_id \
            inner join  hims_d_customer C on  C.hims_d_customer_id = CM.customer_id";
    } else {
      strQuery =
        "SELECT CM.*, C.customer_name from hims_f_contract_management CM \
            inner join  hims_d_customer C on  C.hims_d_customer_id = CM.customer_id";
    }
    _mysql
      .executeQuery({
        query: strQuery,
        printQuery: true,
      })
      .then((headerResult) => {
        _mysql.releaseConnection();
        req.records = headerResult;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}

export function getOrderListGenContract(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    console.log("getSalesOrder: ", req.query.HRMNGMT_Active);

    let strQuery = "";
    let strQry =
      req.query.customer_id != null
        ? " and customer_id= " + req.query.customer_id
        : "";
    if (req.query.HRMNGMT_Active === "true") {
      console.log("getSalesOrder: HR");
      strQuery =
        "SELECT SO.*, E.full_name as employee_name from hims_f_sales_order SO \
                        inner join  hims_d_employee E on  SO.sales_person_id = E.hims_d_employee_id \
                        where contract_id=? " +
        strQry;
    } else {
      console.log("getSalesOrder: No HR");
      strQuery =
        "SELECT SO.* from hims_f_sales_order SO where contract_id=? " + strQry;
    }
    _mysql
      .executeQuery({
        query: strQuery,
        values: [req.query.contract_id],
        printQuery: true,
      })
      .then((headerResult) => {
        _mysql.releaseConnection();
        req.records = headerResult;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
export function updateContractManagement(req, res, next) {
  const _mysql = new algaehMysql();
  const {
    hims_f_contract_management_id,
    contract_date,
    customer_id,
    start_date,
    end_date,
    contract_code,
    quotation_ref_numb,
    terms_conditions,
    incharge_employee_id,
    notification_days1,
    notification_days2,
    project_id,
    hospital_id,
    contract_services,
  } = req.body;
  const { algaeh_d_app_user_id } = req.userIdentity;
  const insert_services = contract_services.filter(
    (item) => !item.hims_f_contract_management_services_id
  );
  const update_services = contract_services.filter(
    (item) => !!item.hims_f_contract_management_services_id
  );
  try {
    _mysql
      .executeQueryWithTransaction({
        query: `update hims_f_contract_management set contract_date=?,
      start_date=?,end_date=?,contract_code=?,quotation_ref_numb=?,terms_conditions=?,
      incharge_employee_id=?,notification_days1=?,notification_days2=?,project_id=?,hospital_id=?,
      updated_date=?,updated_by=? where hims_f_contract_management_id=?`,
        values: [
          contract_date,
          start_date,
          end_date,
          contract_code,
          quotation_ref_numb,
          terms_conditions,
          incharge_employee_id,
          notification_days1,
          notification_days2,
          project_id,
          hospital_id,
          new Date(),
          algaeh_d_app_user_id,
          hims_f_contract_management_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        const execArray = [];
        if (insert_services.length) {
          execArray.push(
            _mysql.executeQuery({
              query:
                "INSERT INTO hims_f_contract_management_services(??) VALUES ?",
              values: insert_services,
              includeValues: [
                "services_id",
                "service_frequency",
                "service_price",
                "comments",
              ],
              extraValues: {
                contract_management_id: hims_f_contract_management_id,
              },
              bulkInsertOrUpdate: true,
              printQuery: true,
            })
          );
        }

        execArray.push(
          _mysql.executeQuery({
            query: `update hims_f_contract_management_services set ? where hims_f_contract_management_services_id=?`,
            values: update_services,
            where: ["hims_f_contract_management_services_id"],
            excludeValues: [
              "contract_management_id",
              "service_name",
              "created_by",
              "created_date",
            ],
            extraValues: {
              updated_by: algaeh_d_app_user_id,
              updated_date: new Date(),
            },
            bulkInsertOrUpdate: true,
            printQuery: true,
          })
        );

        Promise.all(execArray)
          .then((details) => {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              next();
            });
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}
