import algaehMysql from "algaeh-mysql";
import moment from "moment";

export const getPrepaymentTypes = (req, res, next) => {
  const _mysql = new algaehMysql();
  _mysql
    .executeQuery({
      query: `select PT.*, case when PT.pre_type = 'P' then 'Prepayment' else 'Expense' end as pre_type_name from finance_d_prepayment_type PT where record_status='A'`,
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
    pre_type,
    prepayment_desc,
    prepayment_duration,
    prepayment_gl,
    expense_gl,
    employees_req,
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
        pre_type,
        prepayment_desc,
        prepayment_duration,
        prepayment_head_id,
        prepayment_child_id,
        expense_head_id ,
        expense_child_id,
        employees_req
        ) value(?,?,?,?,?,?,?,?)`,
      printQuery: false,
      values: [
        pre_type,
        prepayment_desc,
        prepayment_duration,
        prepayment_head_id || null,
        prepayment_child_id || null,
        expense_head_id || null,
        expense_child_id || null,
        employees_req,
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
    employees_req,
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
      prepayment_desc=?,prepayment_duration=?, prepayment_head_id=?,  prepayment_child_id=?, expense_head_id=?, \
      expense_child_id=?, employees_req=? where finance_d_prepayment_type_id=? and record_status='A'`,
      printQuery: false,
      values: [
        prepayment_desc,
        prepayment_duration,
        prepayment_head_id || null,
        prepayment_child_id || null,
        expense_head_id || null,
        expense_child_id || null,
        employees_req,
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
                "insert into finance_f_prepayment_request (expense_child_id,expense_head_id,prepayment_child_id,prepayment_head_id,prepayment_type_id,request_code,employee_id,prepayment_amount,start_date,\
          end_date,hospital_id,project_id,sub_department_id,prepayment_remarks,created_by,created_date)  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);  ",
              values: [
                input.expense_child_id,
                input.expense_head_id,
                input.prepayment_child_id,
                input.prepayment_head_id,
                input.prepayment_type_id,
                numgen[voucher_type],
                input.employee_id,
                input.prepayment_amount,
                input.start_date,
                input.end_date,
                input.hospital_id,
                project_id,
                sub_department_id,
                input.prepayment_remarks,
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
              ],
              printQuery: true,
            })
            .then((result) => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = { ...result, request_code: numgen[voucher_type] };
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

//created by:Nowshad
//To update Prepayment request
export const updatePrepaymentRequest = (req, res, next) => {
  const _mysql = new algaehMysql();

  const input = req.body;
  _mysql
    .executeQuery({
      query:
        "UPDATE finance_f_prepayment_request set prepayment_remarks=?, prepayment_amount=?,start_date=?, end_date=? \
        where finance_f_prepayment_request_id=?",
      values: [
        input.prepayment_remarks,
        input.prepayment_amount,
        input.start_date,
        input.end_date,
        input.finance_f_prepayment_request_id,
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
};
export const addUniqueIdToDoc = (req, res, next) => {
  const _mysql = new algaehMysql();
  try {
    let input = { ...req.body };
    _mysql
      .executeQuery({
        query:
          "UPDATE `finance_f_prepayment_request` SET `prepayment_doc_unique_id` = ?, \
          `update_date`=?, `updated_by`=? \
              WHERE `finance_f_prepayment_request_id`=? ;",
        values: [
          input.prepayment_doc_unique_id,

          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.finance_f_prepayment_request_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
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
};
//created by:Nowshad
//To update Prepayment Amortize amount to respective cost center
export const updatePrepaymentDetail = (req, res, next) => {
  const _mysql = new algaehMysql();

  const input = req.body;
  _mysql
    .executeQuery({
      query:
        "UPDATE finance_f_prepayment_detail set hospital_id=?, project_id=? where finance_f_prepayment_detail_id=?",
      values: [
        input.hospital_id,
        input.project_id,
        input.finance_f_prepayment_detail_id,
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
          query: `select finance_f_prepayment_request_id, prepayment_type_id,prepayment_remarks,prepayment_desc,prepayment_duration,request_code,request_status,\
    employee_id,employee_code ,E.full_name as employee_name ,E.identity_no , ROUND(prepayment_amount,${decimal_places}) as prepayment_amount, PR.start_date, PR.end_date,PR.revert_reason,\
    hims_d_hospital_id,hospital_name ${selectStr}
    from finance_f_prepayment_request PR  inner join finance_d_prepayment_type PT \
    on PR.prepayment_type_id=PT.finance_d_prepayment_type_id\
    left join hims_d_employee E on PR.employee_id=E.hims_d_employee_id
    left join hims_d_hospital H on PR.hospital_id=H.hims_d_hospital_id ${joinStr}
        ${whereStr} order by PR.created_date desc;`,
          printQuery: false,
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
    case "PD":
      whereStr += " request_status='PD' ";
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
          query: `select finance_f_prepayment_request_id,PR.expense_head_id,PR.expense_child_id,PR.prepayment_head_id,PR.prepayment_child_id, prepayment_type_id,prepayment_desc,request_code,request_status,\
        employee_id,employee_code ,E.full_name as employee_name ,E.identity_no,ROUND(prepayment_amount,${decimal_places}) as prepayment_amount, PR.start_date, PR.end_date,\
        hims_d_hospital_id,hospital_name ${selectStr}
        from finance_f_prepayment_request PR  inner join finance_d_prepayment_type PT \
        on PR.prepayment_type_id=PT.finance_d_prepayment_type_id\
        left join hims_d_employee E on PR.employee_id=E.hims_d_employee_id
        left join hims_d_hospital H on PR.hospital_id=H.hims_d_hospital_id${joinStr}
         where  ${whereStr};`,
          printQuery: false,
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
        query: `update finance_f_prepayment_request set request_status='A',approved_by=?,approved_date=? where finance_f_prepayment_request_id=? and request_status='P';`,
        values: [
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          finance_f_prepayment_request_id,
        ],
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
export const payPrepaymentRequest = (req, res, next) => {
  const _mysql = new algaehMysql();

  let {
    auth_status,
    finance_f_prepayment_request_id,
    reverted_amt,
    revert_reason,
    prepayment_head_id,
    prepayment_child_id,
  } = req.body;

  if (auth_status == "PD") {
    _mysql
      .executeQueryWithTransaction({
        query: `select finance_f_prepayment_request_id, prepayment_type_id,P.prepayment_head_id,P.prepayment_child_id,
          P.prepayment_duration , prepayment_amount, start_date, end_date,
          coalesce(prepayment_amount/P.prepayment_duration,0) as amount,request_code,
          project_id,sub_department_id,hospital_id
          from finance_f_prepayment_request PR  inner join finance_d_prepayment_type P 
          on PR.prepayment_type_id=P.finance_d_prepayment_type_id where 
          PR.finance_f_prepayment_request_id=? and PR.request_status='A' for update;
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
              hospital_id: data.hospital_id,
              project_id: data.project_id,
              sub_department_id: data.sub_department_id,
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
            head_id: prepayment_head_id,
            child_id: prepayment_child_id,
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
                    "project_id",
                    "sub_department_id",
                    "hospital_id",
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
                            "update finance_f_prepayment_request set request_status='PD', prepayment_head_id=?,prepayment_child_id=? where finance_f_prepayment_request_id=?;",
                          values: [
                            prepayment_head_id,
                            prepayment_child_id,
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
          "update finance_f_prepayment_request set request_status='R', revert_reason=?, reverted_amt=?, reverted_by=?, reverted_date=? where finance_f_prepayment_request_id=?;",
        values: [
          revert_reason,
          reverted_amt,
          req.userIdentity.user_id,
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
          selectStr += ` ,D.project_id as cost_center_id, P.project_desc as cost_center`;
          joinStr += ` left join hims_d_project P on D.project_id=P.hims_d_project_id `;

          if (input.cost_center_id > 0) {
            whereStr += ` and D.project_id=${input.cost_center_id}`;
          }
        } else if (options[0]["cost_center_type"] == "SD") {
          selectStr += ` ,D.sub_department_id   as cost_center_id, SD.sub_department_name as cost_center`;
          joinStr += ` left join hims_d_sub_department SD on D.sub_department_id=SD.hims_d_sub_department_id `;
          if (input.cost_center_id > 0) {
            whereStr += ` and D.sub_department_id=${input.cost_center_id}`;
          }
        } else {
          selectStr += `,hims_d_hospital_id as cost_center_id ,hospital_name as cost_center`;
        }
        _mysql
          .executeQuery({
            query: `select finance_f_prepayment_request_id,finance_f_prepayment_detail_id,prepayment_type_id,prepayment_desc,PR.expense_child_id,PR.expense_head_id,request_code,
      employee_id,employee_code ,E.full_name as employee_name ,E.identity_no, ROUND( amount,${decimal_places}) as  amount,
      ROUND(prepayment_amount,${decimal_places}) as prepayment_amount, hims_d_hospital_id,hospital_name,
      left(date_format(concat (D.year,'-',D.month,'-01'),'%Y-%M') ,8)as pay_month,PR.start_date, PR.end_date, D.processed ${selectStr}
      from finance_f_prepayment_request PR  inner join finance_d_prepayment_type PT 
      on PR.prepayment_type_id=PT.finance_d_prepayment_type_id inner join finance_f_prepayment_detail D 
      on PR.finance_f_prepayment_request_id=D.prepayment_request_id
      left join hims_d_employee E on PR.employee_id=E.hims_d_employee_id 
      left join hims_d_hospital H on PR.hospital_id=H.hims_d_hospital_id${joinStr}
      where PR.prepayment_type_id=? and D.year=? and D.month=?  ;`,
            values: [finance_d_prepayment_type_id, year, parseInt(month)],
            printQuery: false,
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

//created by:irfan
export const processPrepayments = (req, res, next) => {
  const _mysql = new algaehMysql();

  const { detail_ids } = req.body;
  console.log("req.body", req.body);
  console.log("detail_ids", detail_ids);
  let detail_id_array = detail_ids.map(
    (item) => item.finance_f_prepayment_detail_id
  );

  if (detail_ids.length > 0) {
    _mysql
      .executeQuery({
        query: "SELECT cost_center_type  FROM finance_options limit 1; ",
      })
      .then((options) => {
        let CR_groupByStr = "";
        let DR_groupByStr = "";

        if (options[0]["cost_center_type"] == "P") {
          CR_groupByStr = " ,PR.project_id";
          DR_groupByStr = " ,D.project_id";
        } else if (options[0]["cost_center_type"] == "SD") {
          CR_groupByStr = " ,PR.sub_department_id";
          DR_groupByStr = " ,D.sub_department_id";
        } else {
          CR_groupByStr = " ,PR.hospital_id";
          DR_groupByStr = " ,D.hospital_id";
        }
        _mysql
          .executeQueryWithTransaction({
            query: `  select  PR.finance_f_prepayment_request_id,sum(D.amount) as amount, PR.prepayment_head_id,PR.prepayment_child_id ,
            PR.project_id,PR.sub_department_id,PR.hospital_id
            from  finance_f_prepayment_detail D   inner join finance_f_prepayment_request PR on 
            D.prepayment_request_id=PR.finance_f_prepayment_request_id
            inner join finance_d_prepayment_type PT  on PR.prepayment_type_id = PT.finance_d_prepayment_type_id
            where  D.finance_f_prepayment_detail_id in (?) and D.processed='N' and PR.request_status='PD' 
            group by PT.finance_d_prepayment_type_id ${CR_groupByStr}; 
            select  D.finance_f_prepayment_detail_id,sum(D.amount) as amount, PR.expense_head_id,PR.expense_child_id ,
            D.project_id,D.sub_department_id,D.hospital_id
            from  finance_f_prepayment_detail D   inner join finance_f_prepayment_request PR on 
            D.prepayment_request_id=PR.finance_f_prepayment_request_id
            inner join finance_d_prepayment_type PT  on PR.prepayment_type_id = PT.finance_d_prepayment_type_id
            where D.finance_f_prepayment_detail_id in (?) and D.processed='N' and PR.request_status='PD' 
            group by PT.finance_d_prepayment_type_id ${DR_groupByStr} for update;         
            select  D.finance_f_prepayment_detail_id,sum(D.amount) as amount 
            from  finance_f_prepayment_detail D   inner join finance_f_prepayment_request PR on  
            D.prepayment_request_id=PR.finance_f_prepayment_request_id
            where D.finance_f_prepayment_detail_id in (?) and D.processed='N' and PR.request_status='PD' ; `,
            values: [detail_id_array, detail_id_array, detail_id_array],
            printQuery: true,
          })
          .then((result) => {
            const credit_side = result[0];
            const debit_side = result[1];
            const transction_amount = result[2][0]["amount"];

            if (transction_amount > 0) {
              const voucher_type = "JOURNAL";
              _mysql
                .generateRunningNumber({
                  user_id: req.userIdentity.algaeh_d_app_user_id,
                  numgen_codes: [voucher_type],
                  table_name: "finance_numgen",
                })
                .then((numgen) => {
                  const document_number = numgen[voucher_type];

                  const EntriesArray = [];

                  for (let i = 0, len = credit_side.length; i < len; i++) {
                    EntriesArray.push({
                      payment_date: new Date(),
                      head_id: credit_side[i].prepayment_head_id,
                      child_id: credit_side[i].prepayment_child_id,
                      debit_amount: 0,
                      payment_type: "CR",
                      credit_amount: credit_side[i].amount,
                      hospital_id: credit_side[i].hospital_id,
                      project_id: credit_side[i].project_id,
                      sub_department_id: credit_side[i].sub_department_id,
                    });
                  }

                  for (let i = 0, len = debit_side.length; i < len; i++) {
                    for (let j = 0, leng = detail_ids.length; j < leng; j++) {
                      EntriesArray.push({
                        payment_date: new Date(),
                        head_id: detail_ids[j].expense_head_id,
                        child_id: detail_ids[j].expense_child_id,
                        debit_amount: debit_side[i].amount,
                        payment_type: "DR",
                        credit_amount: 0,
                        hospital_id: debit_side[i].hospital_id,
                        project_id: debit_side[i].project_id,
                        sub_department_id: debit_side[i].sub_department_id,
                      });
                    }
                  }

                  let narration = ` Adjustment for PrePaid Expenses of amount :${transction_amount} `;

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO finance_day_end_header (transaction_date,amount,voucher_type,\
                        document_number,from_screen,narration,entered_by,entered_date) \
                        VALUES (?,?,?,?,?,?,?,?);",
                      values: [
                        new Date(),
                        transction_amount,
                        "journal",
                        document_number,
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
                          _mysql
                            .executeQueryWithTransaction({
                              query: `update finance_f_prepayment_detail D inner join
                                    finance_f_prepayment_request PR on D.prepayment_request_id=PR.finance_f_prepayment_request_id
                                    set D.processed='Y' ,updated_by=?,updated_date=? where D.finance_f_prepayment_detail_id in (?)
                                    and D.processed='N' and PR.request_status='PD' ; `,
                              values: [
                                req.userIdentity.algaeh_d_app_user_id,
                                new Date(),
                                detail_id_array,
                              ],

                              printQuery: true,
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
                .catch((e) => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            } else {
              _mysql.releaseConnection();
              next(new Error("No records found to process"));
            }
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

//created by:irfan
export const getPrepaymentDetails = (req, res, next) => {
  const _mysql = new algaehMysql();

  const decimal_places = req.userIdentity.decimal_places;

  _mysql
    .executeQuery({
      query: "  SELECT cost_center_type  FROM finance_options limit 1; ",
    })
    .then((options) => {
      let selectStr = "";
      let joinStr = "";

      if (options[0]["cost_center_type"] == "P") {
        selectStr += ` ,D.project_id as cost_center_id, P.project_desc as cost_center`;
        joinStr += ` left join hims_d_project P on D.project_id=P.hims_d_project_id `;
      } else if (options[0]["cost_center_type"] == "SD") {
        selectStr += ` ,D.sub_department_id   as cost_center_id, SD.sub_department_name as cost_center`;
        joinStr += ` left join hims_d_sub_department SD on D.sub_department_id=SD.hims_d_sub_department_id `;
      }
      _mysql
        .executeQuery({
          query: ` select finance_f_prepayment_detail_id, ROUND(amount,${decimal_places}) as amount,
        left(date_format(concat (D.year,'-',D.month,'-01'),'%Y-%M') ,8)as pay_month,
        processed, DATE(D.updated_date) as processed_date, U.username as processed_by, D.hospital_id,D.project_id,D.prepayment_request_id ${selectStr}
        from finance_f_prepayment_detail D left join algaeh_d_app_user U
        on D.updated_by=U.algaeh_d_app_user_id ${joinStr} where prepayment_request_id=? ; `,
          values: [req.query.finance_f_prepayment_request_id],
          printQuery: false,
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
export const updatePrepaymentCostCenter = (req, res, next) => {
  const _mysql = new algaehMysql();

  const decimal_places = req.userIdentity.decimal_places;

  const { finance_f_prepayment_detail_id, cost_center_id } = req.body;
  _mysql
    .executeQuery({
      query: "  SELECT cost_center_type  FROM finance_options limit 1; ",
    })
    .then((options) => {
      let updateStr = "";

      if (options[0]["cost_center_type"] == "P") {
        updateStr += ` project_id=${cost_center_id} `;
      } else if (options[0]["cost_center_type"] == "SD") {
        updateStr += `sub_department_id=${cost_center_id}  `;
      } else {
        updateStr += `hospital_id=${cost_center_id}  `;
      }
      _mysql
        .executeQuery({
          query: ` update finance_f_prepayment_detail set ${updateStr} where finance_f_prepayment_detail_id=? and processed='N' ; `,
          values: [finance_f_prepayment_detail_id],
          printQuery: false,
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
