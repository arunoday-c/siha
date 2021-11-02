import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import axios from "axios";
import { getAccountHeadsFunc } from "./finance";
import voucher from "./voucher";
const { addVoucher } = voucher;
export async function getYearEndingDetails(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const result = await _mysql
      .executeQuery({
        query: `select YE.year_end_id,retained_earning_head,retained_earning_child,closing_amount,updated_amount,
       year_start_date,year_end_date,current_year,is_active,account_name as account_head_name,group_code as group_code_head,
       AC.child_name as account_child_name ,AC.ledger_code as group_code_child from finance_year_end as YE 
       left join finance_account_head as AH on AH.finance_account_head_id = YE.retained_earning_head
       left join finance_account_child as AC on AC.finance_account_child_id = YE.retained_earning_child;
       `,
      })
      .catch((error) => {
        throw error;
      });
    const active = result.find((f) => f.is_active === 1);
    const allAccounts = result.filter((f) => f.is_active === 0);
    const { hospital_id, decimal_places } = req.userIdentity;
    _mysql.releaseConnection();
    const resResult = await axios
      .get(
        "http://localhost:3007/api/v1/profit_and_loss_report/getProfitAndLoss",
        {
          params: {
            from_date: active.year_start_date,
            to_date: active.year_end_date,
            display_column_by: "T",
            levels: 999,
            nonZero: "Y",
          },
          headers: {
            "x-api-key": req.headers["x-api-key"],
            "x-client-ip": req.headers["x-client-ip"],
          },
        }
      )
      .catch((error) => {
        throw error;
      }); //?from_date=2020-01-01&to_date=2020-12-31&display_column_by=T&levels=999&nonZero=Y")

    const { data } = resResult;
    const { net_profit } = data.records;
    // console.log("net_profit===>", net_profit);
    // const yearEndingTotals = await _mysql
    //   .executeQuery({
    //     query: `SELECT ROUND (coalesce(SUM(A.credit_sum),0) - coalesce(SUM(A.debit_sum),0),${decimal_places}) as credit_minus_debit
    //     FROM (
    //     SELECT if(payment_type='CR',SUM(credit_amount),0) as credit_sum,
    //     if(payment_type='DR',SUM(debit_amount),0) as debit_sum
    //     FROM finance_voucher_details  where head_id=3  and child_id=1
    //     and
    //      payment_date between Date(?) and Date(?) and
    //     hospital_id=? and is_deleted ='N' and auth_status='A'
    //      GROUP BY payment_type,credit_amount,debit_amount) as A;`,
    //     values: [active.year_start_date, active.year_end_date, hospital_id],
    //     printQuery: true,
    //   })
    //   .catch((error) => {
    //     throw error;
    //   });
    // _mysql.releaseConnection();
    // console.log("_.head(yearEndingTotals)====>", _.head(yearEndingTotals));
    req.records = {
      active: { ...active, credit_minus_debit: net_profit?.total },
      allAccounts,
    };
    next();
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
export async function getAccountsForYearEnd(req, res, next) {
  try {
    const decimal_places = req.userIdentity.decimal_places;
    let collection = [];

    const liability = await getAccountHeadsFunc(decimal_places, 2).catch(
      (error) => {
        throw e;
      }
    );
    collection.push(liability);
    const capital = await getAccountHeadsFunc(decimal_places, 3).catch(
      (error) => {
        throw e;
      }
    );
    const { children, ...others } = capital;
    const removePandL = capital?.children.filter(
      (f) => f.ledger_code !== "3-1"
    );
    // console.log("capital", capital);
    collection.push({
      ...others,
      children: removePandL.length === 0 ? [{}] : removePandL,
    });
    req.records = collection;
    next();
  } catch (e) {
    next(e);
  }
}
export async function getSelectedAccountDetails(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { head_id, child_id } = req.query;
    const { hospital_id, decimal_places } = req.userIdentity;
    const result = await _mysql
      .executeQuery({
        query: `SELECT ROUND (coalesce(SUM(A.credit_sum),0) - coalesce(SUM(A.debit_sum),0),${decimal_places}) as credit_minus_debit
      FROM (
      SELECT if(payment_type='CR',SUM(credit_amount),0) as credit_sum,
      if(payment_type='DR',SUM(debit_amount),0) as debit_sum 
      FROM finance_voucher_details  where head_id=?  and child_id=? and 
      hospital_id=? and is_deleted ='N' and auth_status='A'
       GROUP BY payment_type,credit_amount,debit_amount) as A;`,
        values: [head_id, child_id, hospital_id],
      })
      .catch((error) => {
        throw error;
      });
    _mysql.releaseConnection();
    req.records = {
      ..._.head(result),
    };
    next();
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
export async function getYearEndData(req, res, next) {
  const _mysql = new algaehMysql();
  const { from_date, to_date, year, to_head_id, to_child_id } = req.body;
  try {
    const resultSum = await _mysql
      .executeQueryWithTransaction({
        query: `select `,
      })
      .catch((error) => {
        _mysql.rollBackTransaction();
        throw error;
      });
    _mysql.commitTransaction();
    console.log("resultSum", resultSum);
    req.records = {
      success: true,
      result: resultSum,
    };
    next();
  } catch (e) {
    _mysql.rollBackTransaction();
    next(e);
  }
}
export async function validateYearEndProcess(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { year_end_id } = req.body;
    const result = await _mysql.executeQuery({
      query: `select year_end_id,next_year from finance_year_end where year_end_id=? and is_active =1`,
      values: [year_end_id],
    });
    const hasResult = _.head(result);
    if (hasResult) {
      req.nextYear = hasResult.next_year;
      next();
    } else {
      next(new Error("Selected Year end already processed"));
    }
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
}
export async function processYearEnd(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { details, year_end_id, updated_amount } = req.body;
    const getDebitRecords = details.find((f) => f.payment_type === "CR");
    const { finance_voucher_header_id } = req.records;
    const { algaeh_d_app_user_id } = req.userIdentity;
    const result = await _mysql
      .executeQuery({
        query: `update finance_voucher_details set auth1='Y',auth1_by=?,auth1_date=?,
      auth2='Y',auth2_by=?,auth2_date=?,auth_status='A' where voucher_header_id=?;
      update finance_year_end set retained_earning_head=?,retained_earning_child=?,
      closing_amount=?,updated_amount=?,update_by=?,update_date=?,is_active=0 where year_end_id=?;
      `,
        values: [
          algaeh_d_app_user_id,
          new Date(),
          algaeh_d_app_user_id,
          new Date(),
          finance_voucher_header_id,
          getDebitRecords.head_id,
          getDebitRecords.child_id,
          getDebitRecords.amount,
          updated_amount,
          algaeh_d_app_user_id,
          new Date(),
          year_end_id,
        ],
      })
      .catch((error) => {
        throw error;
      });
    const nextYear = moment(`${req.nextYear}-01-01`, "YYYY-MM-DD")
      .add("year", 1)
      .format("YYYY");
    const options = await _mysql
      .executeQuery({
        query: `SELECT start_month,start_date,end_date,end_month from finance_options;`,
      })
      .catch((error) => {
        throw error;
      });
    const { start_month, start_date, end_date, end_month } = _.head(options);
    const startDate = `${req.nextYear}-${
      String(start_month).length === 1 ? "0" + start_month : start_month
    }-${
      String(start_date).length === 1 ? "0" + start_date : start_date
    }`.trim();
    const endDate = `${req.nextYear}-${
      String(end_month).length === 1 ? "0" + end_month : end_month
    }-${String(end_date).length === 1 ? "0" + end_date : end_date}`.trim();
    await _mysql
      .executeQuery({
        query: `INSERT INTO finance_year_end 
             (current_year,next_year,is_active,created_by,created_date,
              year_start_date,year_end_date,update_by,update_date) VALUES(?,?,1,?,?,?,?,?,?);`,
        values: [
          req.nextYear,
          nextYear,
          algaeh_d_app_user_id,
          new Date(),
          startDate,
          endDate,
          algaeh_d_app_user_id,
          new Date(),
        ],
      })
      .catch((error) => {
        throw error;
      });
    _mysql.releaseConnection();
    req.records = { success: true, message: "Successfully Posted" };
    next();
  } catch (error) {
    _mysql.releaseConnection();
    const body = req.body;
    let details = body.details;
    for (let i = 0; i < details.length; i++) {
      details[i]["payment_type"] =
        details[i]["payment_type"] === "CR" ? "DR" : "CR";
    }
    req.body = { ...body, voucher_type: "year_end_rev", details };
    addVoucher(req, res, next);
    next(error);
  }
}
