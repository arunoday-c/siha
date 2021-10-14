import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
// import arrayToTree from "array-to-tree";
export async function trailBalanceRpt(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const {
      hospital_id,
      cost_center_id,
      from_date,
      to_date,
      ACCOUNTS,
      drillDownLevel,
      non_zero,
      last_record,
    } = req.query;
    // console.log("last_record", last_record);
    // consol.log("last_record", last_record);
    const decimal_places = req.userIdentity.decimal_places;
    /** for options */
    const optionRecords = await _mysql
      .executeQuery({
        query: `SELECT year_start_date,year_end_date FROM finance_year_end where is_active=1 and record_status='A' limit 1;
      select cr_dr_required from finance_options  limit 1 ;`,
      })
      .catch((error) => {
        throw error;
      });
    const { year_start_date, year_end_date } = _.head(optionRecords[0]);
    const {
      // start_month,
      // start_date,
      // end_month,
      // end_date,
      cr_dr_required,
    } = _.head(optionRecords[1]);
    /** date functions */
    const validate_from_date = parseInt(
      moment(year_start_date).format("YYYYMMDD"),
      10
    );
    const validate_to_date = parseInt(
      moment(year_end_date).format("YYYYMMDD"),
      10
    );
    /** get all ledgers and all transactions */
    const accountLevel = ACCOUNTS === "ALL" ? "" : ` root_id=${ACCOUNTS}`;
    const whereCondition =
      accountLevel === ""
        ? "WHERE VD.child_id <> 1 and VD.head_id <>3"
        : `WHERE ${accountLevel} and VD.child_id <> 1 and VD.head_id <>3`;
    const result = await _mysql
      .executeQuery({
        query: `select finance_account_head_id,account_code, account_name,
          account_parent,account_level, parent_acc_id,root_id,
         finance_account_child_id, child_name,head_id,
         coalesce(H.arabic_account_name,'') as arabic_account_name, coalesce(C.arabic_child_name,'') as arabic_child_name,
         H.group_code as header_ledger_code,C.ledger_code as child_ledger_code
         from finance_account_head H left join finance_account_child C on C.head_id=H.finance_account_head_id and finance_account_child_id <>1 ${
           accountLevel !== "" ? `WHERE ${accountLevel} ` : ""
         };
         -- transaction query
         select C.head_id,finance_account_child_id as child_id
         ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
         ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places}) as credit_amount , 
         ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
         ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred,
         VD.payment_date,VD.is_opening_bal
         from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
         left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' and VD.child_id <> 1
         and date(VD.payment_date) between date(?) and date(?)  and VD.is_opening_bal='N' ${whereCondition}    
          group by C.finance_account_child_id,VD.payment_date,VD.is_opening_bal;
         -- Opening balance query
         select C.head_id,finance_account_child_id as child_id
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places}) as credit_amount , 
          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
          ROUND((coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred,VD.payment_date
          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A'
          and date(VD.payment_date) <= date(?)  ${whereCondition}   group by C.finance_account_child_id,VD.payment_date,VD.is_opening_bal;`,
        values: [from_date, to_date, from_date],
        printQuery: true,
      })
      .catch((error) => {
        throw error;
      });

    let tree = {};
    const transactions = result[1];
    const openingBalance = result[2];
    let final_child = [];
    _.chain(result[0])
      .groupBy((g) => g.root_id)
      .forEach((details, key) => {
        let roots = [],
          children = {};
        const arry = details;
        let metaData = [];
        for (let i = 0, len = arry.length; i < len; ++i) {
          let item = arry[i],
            p = item.parent_acc_id,
            target = !p ? roots : children[p] || (children[p] = []);
          if (
            item.finance_account_child_id > 0 &&
            item.finance_account_head_id === item.head_id
          ) {
            let child =
              children[item.finance_account_head_id] ||
              (children[item.finance_account_head_id] = []);
            const { finance_account_head_id, ...others } = item;
            const openingTransaction = _.chain(openingBalance).filter((f) => {
              /** check year ending for root 4 and 5 if not make zero */
              if (parseInt(key, 10) === 4 || parseInt(key, 10) === 5) {
                if (
                  validate_from_date <=
                    parseInt(moment(f.payment_date).format("YYYYMMDD"), 10) &&
                  validate_to_date >=
                    parseInt(moment(f.payment_date).format("YYYYMMDD"), 10) &&
                  f.head_id === item.finance_account_head_id &&
                  f.child_id === item.finance_account_child_id
                ) {
                  return f;
                }
              } else {
                if (
                  f.head_id === item.finance_account_head_id &&
                  f.child_id === item.finance_account_child_id
                )
                  return f;
              }
            });
            // console.log("openingTransaction===>", openingTransaction.value());
            const SUM_CREDIT_DEBIT = openingTransaction
              .sumBy((s) => parseFloat(s.cred_minus_deb))
              .value();
            const SUM_DEB_CREDIT = openingTransaction
              .sumBy((s) => parseFloat(s.deb_minus_cred))
              .value();
            let op_amount = 0;
            if (parseInt(key, 10) === 1 || parseInt(key, 10) === 5) {
              if (SUM_DEB_CREDIT < SUM_CREDIT_DEBIT) {
                op_amount = -Math.abs(
                  parseFloat(SUM_CREDIT_DEBIT).toFixed(decimal_places)
                );
              } else {
                op_amount = parseFloat(SUM_DEB_CREDIT).toFixed(decimal_places);
              }
            } else {
              if (SUM_CREDIT_DEBIT < SUM_DEB_CREDIT) {
                op_amount = -Math.abs(
                  parseFloat(SUM_DEB_CREDIT).toFixed(decimal_places)
                );
              } else {
                op_amount =
                  parseFloat(SUM_CREDIT_DEBIT).toFixed(decimal_places);
              }
            }
            // console.log("item===>", item);

            const transaction = _.chain(transactions).filter(
              (f) =>
                f.head_id === item.finance_account_head_id &&
                f.child_id === item.finance_account_child_id
            );
            const tr_debit_amount = transaction
              .sumBy((s) => parseFloat(s.debit_amount))
              .value();
            const tr_credit_amount = transaction
              .sumBy((s) => parseFloat(s.credit_amount))
              .value();
            let cb_amount = 0;
            if (parseInt(key, 10) === 1 || parseInt(key, 10) === 5) {
              cb_amount = parseFloat(
                parseFloat(op_amount) +
                  parseFloat(tr_debit_amount) -
                  parseFloat(tr_credit_amount)
              ).toFixed(decimal_places);
            } else {
              cb_amount = parseFloat(
                parseFloat(op_amount) +
                  parseFloat(tr_credit_amount) -
                  parseFloat(tr_debit_amount)
              ).toFixed(decimal_places);
            }
            const includeRecord = () => {
              child.push({
                ...others,
                tr_debit_amount,
                tr_credit_amount,
                title: item.child_name,
                label: item.child_name,
                arabic_name: item.arabic_child_name,
                op_amount,
                cb_amount,
                leafNode: "Y",
                ledger_code: item.child_ledger_code,
              });
              if (last_record === "Y") {
                final_child.push({
                  ...others,
                  tr_debit_amount,
                  tr_credit_amount,
                  title: item.child_name,
                  label: item.child_name,
                  arabic_name: item.arabic_child_name,
                  op_amount,
                  cb_amount,
                  leafNode: "Y",
                  ledger_code: item.child_ledger_code,
                });
              }
            };
            // console.log("child", child);
            //Hide non zero
            if (non_zero === "Y") {
              if (
                parseFloat(tr_debit_amount) !== 0 ||
                parseFloat(tr_credit_amount) !== 0 ||
                parseFloat(op_amount) !== 0
              ) {
                includeRecord();
              }
            } else {
              includeRecord();
            }

            const data = target.find((val) => {
              return (
                val.finance_account_head_id == item.finance_account_head_id
              );
            });
            // console.log("data", data);

            if (!data) {
              // consol.log("data", data);
              target.push({
                ...item,
                op_amount: 0,
                cb_amount: 0,
                tr_debit_amount: 0,
                tr_credit_amount: 0,
                leafNode: "N",
                title: item.account_name,
                label: item.account_name,
                arabic_name: item.arabic_account_name,
                ledger_code: item.account_code,
              });
            }
          } else {
            target.push({
              ...item,
              op_amount: 0,
              cb_amount: 0,
              tr_debit_amount: 0,
              tr_credit_amount: 0,
              leafNode: "N",
              title: item.account_name,
              label: item.account_name,
              arabic_name: item.arabic_account_name,
              ledger_code: item.account_code,
            });
          }
        }

        let findChildren = function (parent) {
          if (children[parent.finance_account_head_id]) {
            let tempChild = children[parent.finance_account_head_id];

            if (tempChild.length > 0 && parent) {
              parent.children = tempChild;

              for (let i = 0, len = parent.children.length; i < len; ++i) {
                if (parent) {
                  findChildren(parent.children[i]);
                  // For  Headers
                  if (parent.leafNode === "N") {
                    parent.tr_debit_amount = _.sumBy(parent.children, (s) =>
                      parseFloat(s.tr_debit_amount)
                    );
                    parent.tr_credit_amount = _.sumBy(parent.children, (s) =>
                      parseFloat(s.tr_credit_amount)
                    );

                    parent.op_amount = _.sumBy(parent.children, (s) =>
                      parseFloat(s.op_amount)
                    ).toFixed(decimal_places);
                    parent.cb_amount = _.sumBy(parent.children, (s) =>
                      parseFloat(s.cb_amount)
                    ).toFixed(decimal_places);
                  }
                }
              }
            }
          }
        };
        for (let i = 0, len = roots.length; i < len; ++i) {
          findChildren(roots[i]);
        }
        tree[
          parseInt(key, 10) === 1
            ? "asset"
            : parseInt(key, 10) === 2
            ? "liability"
            : parseInt(key, 10) === 3
            ? "capital"
            : parseInt(key, 10) === 4
            ? "income"
            : "expense"
        ] = _.head(roots);
      })
      .value();
    // console.log("tree", tree);

    if (last_record === "Y") {
      req.records = {
        final_child: final_child,
        total_debit_amount: 0,
        total_credit_amount: 0,
      };
    } else {
      req.records = {
        ...tree,
        total_debit_amount: 0,
        total_credit_amount: 0,
      };
    }
    next();
    console.log("<<<<<Done pushed>>>>");
    // console.log("result===>", JSON.stringify(tree));
    _mysql.releaseConnection();
  } catch (e) {
    console.error("error====>", e);
    _mysql.releaseConnection();
    next(e);
  }
}
