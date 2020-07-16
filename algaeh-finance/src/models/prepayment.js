import algaehMysql from "algaeh-mysql";

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
      printQuery: true,
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
      printQuery: true,
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
