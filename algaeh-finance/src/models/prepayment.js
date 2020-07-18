import algaehMysql from "algaeh-mysql";
import moment from "moment";

export const getPrepaymentTypes = (req, res, next) => {
  const _mysql = new algaehMysql();
  _mysql
    .executeQuery({
      query: `select * from finance_d_prepayment_type where record_status='A'`,
    })
    .then((res) => {
      _mysql.releaseConnection();
      req.records = res;
      next();
    })
    .catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
};

export const createPrepaymentTypes = (req, res, next) => {
  const input = req.body;
  const {
    prepayment_desc,
    prepayment_duration,
    prepayment_gl,
    expense_gl,
  } = input;

  let prepayment_head_id,
    prepayment_child_id,
    prepayment_ids,
    expense_head_id,
    expense_child_id,
    expense_ids;
  if (prepayment_gl) {
    prepayment_ids = prepayment_gl.split("-");
    prepayment_head_id = prepayment_ids[0];
    prepayment_child_id = prepayment_ids[1];
  }
  if (expense_gl) {
    expense_ids = expense_gl.split("-");
    expense_head_id = expense_ids[0];
    expense_child_id = expense_ids[1];
  }

  expense_ids = expense_gl.split("-");
  const _mysql = new algaehMysql();
  _mysql
    .executeQuery({
      query: `insert into finance_d_prepayment_type (
        prepayment_desc,
        prepayment_duration,
        prepayment_head_id,
        prepayment_child_id,
        expense_head_id ,
        expense_child_id
        ) value(?,?,?,?,?,?)`,
      printQuery: false,
      values: [
        prepayment_desc,
        prepayment_duration,
        prepayment_head_id || null,
        prepayment_child_id || null,
        expense_head_id || null,
        expense_child_id || null,
      ],
    })
    .then((res) => {
      _mysql.releaseConnection();
      req.records = res;
      next();
    })
    .catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
};

export const updatePrepaymentTypes = (req, res, next) => {
  const _mysql = new algaehMysql();
  const input = req.body;
  const {
    prepayment_desc,
    prepayment_duration,
    prepayment_gl,
    expense_gl,
    finance_d_prepayment_type_id,
  } = input;

  let prepayment_head_id,
    prepayment_child_id,
    prepayment_ids,
    expense_head_id,
    expense_child_id,
    expense_ids;
  if (prepayment_gl) {
    prepayment_ids = prepayment_gl.split("-");
    prepayment_head_id = prepayment_ids[0];
    prepayment_child_id = prepayment_ids[1];
  }
  if (expense_gl) {
    expense_ids = expense_gl.split("-");
    expense_head_id = expense_ids[0];
    expense_child_id = expense_ids[1];
  }

  _mysql
    .executeQuery({
      query: `update finance_d_prepayment_type set 
      prepayment_desc=?,prepayment_duration=?, prepayment_head_id=?,  prepayment_child_id=?, expense_head_id=?, expense_child_id=? where finance_d_prepayment_type_id=? and record_status='A'`,
      printQuery: false,
      values: [
        prepayment_desc,
        prepayment_duration,
        prepayment_head_id || null,
        prepayment_child_id || null,
        expense_head_id || null,
        expense_child_id || null,
        finance_d_prepayment_type_id,
      ],
    })
    .then((res) => {
      _mysql.releaseConnection();
      req.records = res;
      next();
    })
    .catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
};

export const deletePrepaymentTypes = (req, res, next) => {
  const input = req.body;
  const { finance_d_prepayment_type_id } = input;
  const _mysql = new algaehMysql();
  _mysql
    .executeQuery({
      query: `update finance_d_prepayment_type set record_status='I' where finance_d_prepayment_type_id=? and record_status='A'`,
      values: [finance_d_prepayment_type_id],
    })
    .then((res) => {
      _mysql.releaseConnection();
      req.records = res;
      next();
    })
    .catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
};

//created by:irfan
export const addPrepaymentRequest = (req, res, next) => {
  const _mysql = new algaehMysql();

  const input = req.body;

  let project_id, sub_department_id;
  _mysql
    .executeQuery({
      query: "  SELECT cost_center_type  FROM finance_options limit 1; ",
    })
    .then((options) => {
      if (options[0]["cost_center_type"] == "P") {
        project_id = input.cost_center_id;
        sub_department_id = null;
      } else if (options[0]["cost_center_type"] == "SD") {
        project_id = null;
        sub_department_id = input.cost_center_id;
      }
      const voucher_type = "PAYMENT";
      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: [voucher_type],
          table_name: "finance_numgen",
        })
        .then((numgen) => {
          _mysql
            .executeQuery({
              query:
                "insert into finance_f_prepayment_request (prepayment_type_id,request_code,employee_id,prepayment_amount,start_date,\
          end_date,hospital_id,project_id,sub_department_id,created_by,created_date)  values(?,?,?,?,?,?,?,?,?,?,?);  ",
              values: [
                input.prepayment_type_id,
                numgen[voucher_type],
                input.employee_id,
                input.prepayment_amount,
                input.start_date,
                input.end_date,
                input.hospital_id,
                project_id,
                sub_department_id,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
              ],
            })
            .then((result) => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    })
    .catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
};

//created by:irfan
export const getPrepaymentRequests = (req, res, next) => {
  const _mysql = new algaehMysql();

  const input = req.query;
  const decimal_places = req.userIdentity.decimal_places;
  let whereStr = "";

  switch (input.request_status) {
    case "A":
      whereStr += " request_status='A' ";
      break;
    case "R":
      whereStr += " request_status='R' ";
      break;
    case "P":
      whereStr += " request_status='P' ";
      break;
  }
  if (input.hospital_id > 0) {
    whereStr += ` and PR.hospital_id=${input.hospital_id}`;
  }

  _mysql
    .executeQuery({
      query: "  SELECT cost_center_type  FROM finance_options limit 1; ",
    })
    .then((options) => {
      let selectStr = "";
      let joinStr = "";

      if (options[0]["cost_center_type"] == "P") {
        selectStr += ` ,PR.project_id as cost_center_id, P.project_desc as cost_center`;
        joinStr += ` left join hims_d_project P on PR.project_id=P.hims_d_project_id `;

        if (input.cost_center_id > 0) {
          whereStr += ` and PR.project_id=${input.cost_center_id}`;
        }
      } else if (options[0]["cost_center_type"] == "SD") {
        selectStr += ` ,PR.sub_department_id   as cost_center_id, SD.sub_department_name as cost_center`;
        joinStr += ` left join hims_d_sub_department SD on PR.sub_department_id=SD.hims_d_sub_department_id `;
        if (input.cost_center_id > 0) {
          whereStr += ` and PR.sub_department_id=${input.cost_center_id}`;
        }
      } else {
        selectStr += `,hims_d_hospital_id as cost_center_id ,hospital_name as cost_center`;
      }

      if (whereStr != "") {
        whereStr = " where " + whereStr;
      }
      _mysql
        .executeQuery({
          query: `select finance_f_prepayment_request_id, prepayment_type_id,prepayment_desc,request_code,request_status,\
    employee_id,employee_code ,E.full_name as employee_name , ROUND(prepayment_amount,${decimal_places}) as prepayment_amount, PR.start_date, PR.end_date,\
    hims_d_hospital_id,hospital_name ${selectStr}
    from finance_f_prepayment_request PR  inner join finance_d_prepayment_type PT \
    on PR.prepayment_type_id=PT.finance_d_prepayment_type_id\
    left join hims_d_employee E on PR.employee_id=E.hims_d_employee_id
    left join hims_d_hospital H on PR.hospital_id=H.hims_d_hospital_id${joinStr}
        ${whereStr};`,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    })
    .catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
};

//created by:irfan
export const getPrepaymentRequestToAuthorize = (req, res, next) => {
  const _mysql = new algaehMysql();

  const input = req.query;
  const decimal_places = req.userIdentity.decimal_places;
  let whereStr = "";

  switch (input.request_status) {
    case "A":
      whereStr += " request_status='A' ";
      break;
    case "R":
      whereStr += " request_status='R' ";
      break;
    default:
      whereStr += " request_status='P' ";
  }
  if (input.hospital_id > 0) {
    whereStr += ` and PR.hospital_id=${input.hospital_id}`;
  }

  if (input.prepayment_type_id > 0) {
    whereStr += ` and PR.prepayment_type_id=${input.prepayment_type_id}`;
  }

  _mysql
    .executeQuery({
      query: "  SELECT cost_center_type  FROM finance_options limit 1; ",
    })
    .then((options) => {
      let selectStr = "";
      let joinStr = "";

      if (options[0]["cost_center_type"] == "P") {
        selectStr += ` ,PR.project_id as cost_center_id, P.project_desc as cost_center`;
        joinStr += ` left join hims_d_project P on PR.project_id=P.hims_d_project_id `;

        if (input.cost_center_id > 0) {
          whereStr += ` and PR.project_id=${input.cost_center_id}`;
        }
      } else if (options[0]["cost_center_type"] == "SD") {
        selectStr += ` ,PR.sub_department_id   as cost_center_id, SD.sub_department_name as cost_center`;
        joinStr += ` left join hims_d_sub_department SD on PR.sub_department_id=SD.hims_d_sub_department_id `;
        if (input.cost_center_id > 0) {
          whereStr += ` and PR.sub_department_id=${input.cost_center_id}`;
        }
      } else {
        selectStr += `,hims_d_hospital_id as cost_center_id ,hospital_name as cost_center`;
      }

      if (input.start_date && input.end_date) {
        whereStr += ` and (
          (PR.start_date between date('${input.start_date}') and  date('${input.end_date}')) or
          (PR.end_date between date('${input.start_date}') and  date('${input.end_date}')) or 
          (  date('${input.start_date}')  between PR.start_date and  PR.end_date  )) `;
      }
      _mysql
        .executeQuery({
          query: `select finance_f_prepayment_request_id, prepayment_type_id,prepayment_desc,request_code,request_status,\
        employee_id,employee_code ,E.full_name as employee_name ,ROUND(prepayment_amount,${decimal_places}) as prepayment_amount, PR.start_date, PR.end_date,\
        hims_d_hospital_id,hospital_name ${selectStr}
        from finance_f_prepayment_request PR  inner join finance_d_prepayment_type PT \
        on PR.prepayment_type_id=PT.finance_d_prepayment_type_id\
        left join hims_d_employee E on PR.employee_id=E.hims_d_employee_id
        left join hims_d_hospital H on PR.hospital_id=H.hims_d_hospital_id${joinStr}
         where  ${whereStr};`,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    })
    .catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
};

//created by:irfan
export const authorizePrepaymentRequest = (req, res, next) => {
  const _mysql = new algaehMysql();

  let { auth_status, finance_f_prepayment_request_id } = req.body;

  if (auth_status == "A") {
    _mysql
      .executeQuery({
        query: `select finance_f_prepayment_request_id, prepayment_type_id,prepayment_head_id,prepayment_child_id,
          P.prepayment_duration , prepayment_amount, start_date, end_date,
          coalesce(prepayment_amount/P.prepayment_duration,0) as amount,request_code,
          project_id,sub_department_id,hospital_id
          from finance_f_prepayment_request PR  inner join finance_d_prepayment_type P 
          on PR.prepayment_type_id=P.finance_d_prepayment_type_id where 
          PR.finance_f_prepayment_request_id=? and PR.request_status='P' for update;
          select finance_accounts_maping_id,account,head_id,child_id from 
          finance_accounts_maping  where account='cash' limit 1;`,
        values: [finance_f_prepayment_request_id],
        printQuery: false,
      })
      .then((result) => {
        if (result[0].length > 0) {
          let data = result[0][0];
          let cash = result[1][0];
          let dateStart = moment(data.start_date);
          let dateEnd = moment(data.end_date);

          const detail_Array = [];
          while (dateEnd >= dateStart) {
            detail_Array.push({
              year: dateStart.format("YYYY"),
              month: dateStart.format("M"),
              amount: data.amount,
              prepayment_request_id: finance_f_prepayment_request_id,
            });
            dateStart.add(1, "month");
          }

          const EntriesArray = [];
          EntriesArray.push({
            payment_date: new Date(),
            head_id: cash.head_id,
            child_id: cash.child_id,
            debit_amount: 0,
            payment_type: "CR",
            credit_amount: data.prepayment_amount,
            hospital_id: data.hospital_id,
            project_id: data.project_id,
            sub_department_id: data.sub_department_id,
          });

          EntriesArray.push({
            payment_date: new Date(),
            head_id: data.prepayment_head_id,
            child_id: data.prepayment_child_id,
            debit_amount: data.prepayment_amount,
            payment_type: "DR",
            credit_amount: 0,
            hospital_id: data.hospital_id,
            project_id: data.project_id,
            sub_department_id: data.sub_department_id,
          });

          let narration = `Pre-payment of amount:${data.prepayment_amount} / ${data.request_code}`;

          _mysql
            .executeQueryWithTransaction({
              query:
                "INSERT INTO finance_day_end_header (transaction_date,amount,voucher_type,document_id,\
                  document_number,from_screen,narration,entered_by,entered_date) \
                  VALUES (?,?,?,?,?,?,?,?,?);",
              values: [
                new Date(),
                data.prepayment_amount,
                "payment",
                finance_f_prepayment_request_id,
                data.request_code,
                "FINPREPAY",
                narration,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
              ],
              printQuery: false,
            })
            .then((header_result) => {
              const month = moment().format("M");
              const year = moment().format("YYYY");
              const IncludeValuess = [
                "payment_date",
                "head_id",
                "child_id",
                "debit_amount",
                "payment_type",
                "credit_amount",
                "hospital_id",
                "project_id",
                "sub_department_id",
              ];

              _mysql
                .executeQueryWithTransaction({
                  query:
                    "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                  values: EntriesArray,
                  includeValues: IncludeValuess,
                  bulkInsertOrUpdate: true,
                  extraValues: {
                    year: year,
                    month: month,
                    day_end_header_id: header_result.insertId,
                  },
                  printQuery: false,
                })
                .then((subResult) => {
                  const Inscolumns = [
                    "prepayment_request_id",
                    "amount",
                    "year",
                    "month",
                  ];

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO finance_f_prepayment_detail (??) VALUES ? ;",
                      values: detail_Array,
                      includeValues: Inscolumns,
                      bulkInsertOrUpdate: true,

                      printQuery: false,
                    })
                    .then((detailResult) => {
                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            "update finance_f_prepayment_request set request_status='A',approved_by=?,approved_date=? where finance_f_prepayment_request_id=? and request_status='P';",
                          values: [
                            req.userIdentity.algaeh_d_app_user_id,
                            new Date(),
                            finance_f_prepayment_request_id,
                          ],

                          printQuery: false,
                        })
                        .then((updte) => {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = updte;
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
        } else {
          next(new Error("No record found"));
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  } else if (auth_status == "R") {
    _mysql
      .executeQuery({
        query:
          "update finance_f_prepayment_request set request_status='R',approved_by=?,approved_date=? where finance_f_prepayment_request_id=? and request_status='P';",
        values: [
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          finance_f_prepayment_request_id,
        ],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  } else {
    next(new Error("Please provide valid input"));
  }
};

//created by:irfan
export const loadPrepaymentsToProcess = (req, res, next) => {
  const _mysql = new algaehMysql();
  const decimal_places = req.userIdentity.decimal_places;
  const input = req.query;
  const { finance_d_prepayment_type_id, year, month } = input;
  if (finance_d_prepayment_type_id > 0 && year > 0 && month > 0) {
    _mysql
      .executeQuery({
        query: "  SELECT cost_center_type  FROM finance_options limit 1; ",
      })
      .then((options) => {
        let selectStr = "";
        let joinStr = "";

        if (options[0]["cost_center_type"] == "P") {
          selectStr += ` ,PR.project_id as cost_center_id, P.project_desc as cost_center`;
          joinStr += ` left join hims_d_project P on PR.project_id=P.hims_d_project_id `;

          if (input.cost_center_id > 0) {
            whereStr += ` and PR.project_id=${input.cost_center_id}`;
          }
        } else if (options[0]["cost_center_type"] == "SD") {
          selectStr += ` ,PR.sub_department_id   as cost_center_id, SD.sub_department_name as cost_center`;
          joinStr += ` left join hims_d_sub_department SD on PR.sub_department_id=SD.hims_d_sub_department_id `;
          if (input.cost_center_id > 0) {
            whereStr += ` and PR.sub_department_id=${input.cost_center_id}`;
          }
        } else {
          selectStr += `,hims_d_hospital_id as cost_center_id ,hospital_name as cost_center`;
        }
        _mysql
          .executeQuery({
            query: `select finance_f_prepayment_request_id, prepayment_type_id,prepayment_desc,request_code,
      employee_id,employee_code ,E.full_name as employee_name , ROUND( amount,${decimal_places}) as  amount,
      date_format(concat (D.year,'-',D.month,'-01'),'%Y-%M') as pay_month ${selectStr}
      from finance_f_prepayment_request PR  inner join finance_d_prepayment_type PT 
      on PR.prepayment_type_id=PT.finance_d_prepayment_type_id inner join finance_f_prepayment_detail D 
      on PR.finance_f_prepayment_request_id=D.prepayment_request_id
      left join hims_d_employee E on PR.employee_id=E.hims_d_employee_id ${joinStr}
      where PR.prepayment_type_id=? and D.year=? and D.month=?  ;`,
            values: [finance_d_prepayment_type_id, year, month],
            printQuery: true,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  } else {
    next(new Error("Please provide valid input"));
  }
};
