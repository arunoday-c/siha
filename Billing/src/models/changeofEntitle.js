import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import axios from "axios";
import { generateAccountingEntryChangeEntitle } from "./opBilling";

export async function addChangeOfEntitlement(req, res, next) {
  // const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql();
  try {
    let inputParam = { ...req.body };
    let updateQuery = "SELECT 1=1;";
    let _billing_header_id = [];
    let strQuery = "SELECT 1=1;";
    let strExistQuery = "SELECT 1=1;";
    //   insured   hims_f_patient_visit

    // console.log("inputParam", inputParam);

    if (inputParam.primary_sub_id > 0) {
      strQuery = `SELECT creidt_limit_req, creidt_limit, creidt_amount_till FROM hims_d_insurance_sub 
          WHERE hims_d_insurance_sub_id=${inputParam.primary_sub_id};`;
    }
    if (inputParam.sub_insurance_provider_id > 0) {
      strExistQuery = `SELECT creidt_limit_req, creidt_limit, creidt_amount_till FROM hims_d_insurance_sub 
          WHERE hims_d_insurance_sub_id=${inputParam.sub_insurance_provider_id};`;
    }

    // console.log("strExistQuery", inputParam.visit_bills);
    inputParam.visit_bills.map((o) => {
      _billing_header_id.push(o.hims_f_billing_header_id);
    });
    const headerResult = await _mysql
      .executeQuery({
        query:
          "SELECT hims_f_ordered_services_id,services_id FROM hims_f_ordered_services WHERE visit_id=?; \
            SELECT hims_f_ordered_inventory_id,services_id FROM hims_f_ordered_inventory WHERE visit_id=?; \
            SELECT hims_f_package_header_id, services_id FROM hims_f_package_header WHERE visit_id=?;\
            SELECT hims_f_patient_insurance_mapping_id FROM hims_m_patient_insurance_mapping WHERE patient_visit_id=?;\
            SELECT * FROM hims_f_billing_details where cancel_yes_no='N' and hims_f_billing_header_id in (?);\
            SELECT hims_f_billing_header_id, receipt_header_id, incharge_or_provider, bill_date, advance_amount, \
            advance_adjust, pack_advance_adjust, pack_advance_amount, coalesce(credit_amount, 0) as credit_amount FROM \
            hims_f_billing_header where hims_f_billing_header_id in (?);" +
          strQuery +
          strExistQuery,
        values: [
          inputParam.visit_id,
          inputParam.visit_id,
          inputParam.visit_id,
          inputParam.visit_id,
          _billing_header_id,
          _billing_header_id,
        ],
        printQuery: true,
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });

    const order_services = headerResult[0];
    const order_consumables = headerResult[1];
    const order_packages = headerResult[2];
    const visit_insurance = headerResult[3];
    const visit_bills = headerResult[4];
    const visit_bills_header = headerResult[5];
    const sub_insurance = headerResult[6][0];
    const dat_sub_insurance = headerResult[7][0];

    // consol.log("inputParam", inputParam);
    let inpObj = {
      insured: inputParam.insured,
      vat_applicable: inputParam.vat_applicable,
      primary_insurance_provider_id: inputParam.primary_insurance_provider_id,
      primary_network_office_id: inputParam.primary_network_office_id,
      primary_network_id: inputParam.primary_network_id,
    };
    let inputData = [];

    order_services.map((item) => {
      inputData.push({
        ...inpObj,
        hims_d_services_id: item.services_id,
      });
    });
    order_consumables.map((item) => {
      inputData.push({
        ...inpObj,
        hims_d_services_id: item.services_id,
      });
    });
    order_packages.map((item) => {
      inputData.push({
        ...inpObj,
        hims_d_services_id: item.services_id,
      });
    });

    if (visit_insurance.length > 0 && inputParam.insured === "Y") {
      updateQuery += _mysql.mysqlQueryFormat(
        "UPDATE hims_m_patient_insurance_mapping SET primary_insurance_provider_id=?, primary_sub_id=?, \
        primary_network_id=?, primary_policy_num=?, primary_effective_start_date=?, primary_effective_end_date=?, \
        primary_card_number=? where hims_f_patient_insurance_mapping_id=?;\
        UPDATE hims_f_patient_visit set insured='Y' where hims_f_patient_visit_id=?;",
        [
          inputParam.primary_insurance_provider_id,
          inputParam.primary_sub_id,
          inputParam.primary_network_id,
          inputParam.primary_policy_num,
          inputParam.primary_effective_start_date,
          inputParam.primary_effective_end_date,
          inputParam.primary_card_number,
          visit_insurance[0].hims_f_patient_insurance_mapping_id,
          inputParam.visit_id,
        ]
      );
    } else if (visit_insurance.length > 0 && inputParam.insured === "N") {
      updateQuery += _mysql.mysqlQueryFormat(
        "DELETE FROM hims_m_patient_insurance_mapping WHERE hims_f_patient_insurance_mapping_id=?;\
        UPDATE hims_f_patient_visit set insured='N' where hims_f_patient_visit_id=?;",
        [
          visit_insurance[0].hims_f_patient_insurance_mapping_id,
          inputParam.visit_id,
        ]
      );
    } else if (inputParam.insured === "Y") {
      updateQuery += _mysql.mysqlQueryFormat(
        "INSERT INTO hims_m_patient_insurance_mapping (patient_id, patient_visit_id, primary_insurance_provider_id,primary_sub_id,primary_network_id,\
            primary_policy_num, primary_effective_start_date,primary_effective_end_date,primary_card_number) \
            VALUES (?,?,?,?,?,?,?,?,?);\
            UPDATE hims_f_patient_visit set insured='Y' where hims_f_patient_visit_id=?;",
        [
          inputParam.patient_id,
          inputParam.visit_id,
          inputParam.primary_insurance_provider_id,
          inputParam.primary_sub_id,
          inputParam.primary_network_id,
          inputParam.primary_policy_num,
          inputParam.primary_effective_start_date,
          inputParam.primary_effective_end_date,
          inputParam.primary_card_number,
          inputParam.visit_id,
        ]
      );
    }

    // req.body = inputData;
    // console.log("inputData", inputData);
    const { headers } = req;
    let recalculate_services = null;
    if (inputData.length > 0) {
      recalculate_services = await axios({
        method: "POST",
        url: "http://localhost:3014/api/v1//billing/getBillDetails",
        data: inputData,
        headers: { ...headers },
      }).catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
    }

    inputData = [];
    // console.log("inputData bill", inputData);
    visit_bills.map((item) => {
      inputData.push({
        ...inpObj,
        hims_d_services_id: item.services_id,
        hims_f_billing_details_id: item.hims_f_billing_details_id,
        hims_f_billing_header_id: item.hims_f_billing_header_id,
      });
    });
    let recalculate_bills = null;

    if (inputData.length > 0) {
      recalculate_bills = await axios({
        method: "POST",
        url: "http://localhost:3014/api/v1//billing/getBillDetails",
        data: inputData,
        headers: { ...headers },
      }).catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
    }

    const visit_services =
      recalculate_services === null
        ? []
        : recalculate_services.data.records.billdetails;
    const visit_bills_data =
      recalculate_bills === null
        ? []
        : recalculate_bills.data.records.billdetails;

    const cal_order_serv = visit_services.filter(
      (f) => f.service_type_id === 5 || f.service_type_id === 11
    );
    const cal_order_cons = visit_services.filter(
      (f) => f.service_type_id === 4
    );
    const cal_order_pack = visit_services.filter(
      (f) => f.service_type_id === 14
    );

    const header_bills = _.chain(visit_bills_data)
      .groupBy((g) => g.hims_f_billing_header_id)
      .map(function (detail, key) {
        return {
          from_bill_id: detail[0].hims_f_billing_header_id,

          sub_total_amount: _.sumBy(detail, (s) => parseFloat(s.gross_amount)),

          net_total: _.sumBy(detail, (s) => parseFloat(s.net_amout)),
          discount_amount: _.sumBy(detail, (s) => parseFloat(s.discount_amout)),
          gross_total: _.sumBy(detail, (s) => parseFloat(s.patient_payable)),

          // Primary Insurance
          copay_amount: _.sumBy(detail, (s) => parseFloat(s.copay_amount)),
          deductable_amount: _.sumBy(detail, (s) =>
            parseFloat(s.deductable_amount)
          ),
          // Responsibilities
          patient_res: _.sumBy(detail, (s) => parseFloat(s.patient_resp)),
          company_res: _.sumBy(detail, (s) => parseFloat(s.comapany_resp)),

          // Tax Calculation
          total_tax: _.sumBy(detail, (s) => parseFloat(s.total_tax)),
          patient_tax: _.sumBy(detail, (s) => parseFloat(s.patient_tax)),
          s_patient_tax: _.sumBy(detail, (s) => parseFloat(s.s_patient_tax)),

          company_tax: _.sumBy(detail, (s) => parseFloat(s.company_tax)),

          // Payables
          patient_payable: _.sumBy(detail, (s) =>
            parseFloat(s.patient_payable)
          ),

          company_payble: _.sumBy(detail, (s) => parseFloat(s.company_payble)),
          company_payable: _.sumBy(detail, (s) => parseFloat(s.company_payble)),
          net_tax:
            _.sumBy(detail, (s) => parseFloat(s.patient_tax)) +
            _.sumBy(detail, (s) => parseFloat(s.company_tax)),
          billdetails: detail,
        };
      })
      .value();

    // console.log("header_bills", header_bills);

    // console.log("inputParam.insured", inputParam.insured);
    // console.log("dat_sub_insurance", dat_sub_insurance);
    // console.log(
    //   "sub_insurance_provider_id",
    //   inputParam.sub_insurance_provider_id
    // );

    let flow_continue = true;
    if (
      inputParam.insured === "Y" &&
      (sub_insurance.creidt_limit_req === "Y" ||
        dat_sub_insurance.creidt_limit_req === "Y")
    ) {
      const total_bills_amount = _.sumBy(header_bills, (s) =>
        parseFloat(s.company_payable)
      );
      const creidt_amount_till =
        parseFloat(sub_insurance.creidt_amount_till) +
        parseFloat(total_bills_amount);

      if (
        parseFloat(creidt_amount_till) > parseFloat(sub_insurance.creidt_limit)
      ) {
        _mysql.releaseConnection();
        flow_continue = false;
        req.records = {
          invalid_input: true,
          message:
            "You have reached your credit limit. Please collect payment and proceed.",
        };

        next();
      } else {
        if (
          dat_sub_insurance.creidt_limit_req === "Y" &&
          inputParam.sub_insurance_provider_id > 0
        ) {
          updateQuery += `UPDATE hims_d_insurance_sub SET creidt_amount_till = creidt_amount_till-${total_bills_amount} where hims_d_insurance_sub_id = ${inputParam.sub_insurance_provider_id};`;
        }
        if (
          sub_insurance.creidt_limit_req === "Y" &&
          inputParam.primary_sub_id > 0
        ) {
          updateQuery += `UPDATE hims_d_insurance_sub SET creidt_amount_till = creidt_amount_till+${total_bills_amount} where hims_d_insurance_sub_id = ${inputParam.primary_sub_id};`;
        }
        // updateQuery += `UPDATE hims_d_insurance_sub SET creidt_amount_till = creidt_amount_till+${total_bills_amount} where hims_d_insurance_sub_id = ${inputParam.primary_sub_id};`;
      }
    } else if (
      inputParam.insured === "Y" &&
      sub_insurance.creidt_limit_req === "Y"
    ) {
      const total_bills_amount = _.sumBy(header_bills, (s) =>
        parseFloat(s.company_payable)
      );
      const creidt_amount_till =
        parseFloat(sub_insurance.creidt_amount_till) +
        parseFloat(total_bills_amount);

      if (
        parseFloat(creidt_amount_till) > parseFloat(sub_insurance.creidt_limit)
      ) {
        _mysql.releaseConnection();
        flow_continue = false;
        req.records = {
          invalid_input: true,
          message:
            "You have reached your credit limit. Please collect payment and proceed.",
        };

        next();
      } else {
        if (
          dat_sub_insurance.creidt_limit_req === "Y" &&
          inputParam.sub_insurance_provider_id > 0
        ) {
          const bills_amount = _.sumBy(inputParam.visit_bills, (s) =>
            parseFloat(s.company_payable)
          );
          updateQuery += `UPDATE hims_d_insurance_sub SET creidt_amount_till = creidt_amount_till-${bills_amount} where hims_d_insurance_sub_id = ${inputParam.sub_insurance_provider_id};`;
        }
        if (
          sub_insurance.creidt_limit_req === "Y" &&
          inputParam.primary_sub_id > 0
        ) {
          updateQuery += `UPDATE hims_d_insurance_sub SET creidt_amount_till = creidt_amount_till+${total_bills_amount} where hims_d_insurance_sub_id = ${inputParam.primary_sub_id};`;
        }
        // updateQuery += `UPDATE hims_d_insurance_sub SET creidt_amount_till = creidt_amount_till+${total_bills_amount} where hims_d_insurance_sub_id = ${inputParam.primary_sub_id};`;
      }
    } else if (
      inputParam.insured === "N" &&
      dat_sub_insurance.creidt_limit_req === "Y" &&
      inputParam.sub_insurance_provider_id > 0
    ) {
      const total_bills_amount = _.sumBy(inputParam.visit_bills, (s) =>
        parseFloat(s.company_payable)
      );
      updateQuery += `UPDATE hims_d_insurance_sub SET creidt_amount_till = creidt_amount_till-${total_bills_amount} where hims_d_insurance_sub_id = ${inputParam.sub_insurance_provider_id};`;
    }

    if (flow_continue) {
      if (cal_order_serv.length > 0) {
        cal_order_serv.map((item) => {
          const map_data = order_services.find(
            (f) => f.services_id === item.services_id
          );
          updateQuery += _mysql.mysqlQueryFormat(
            "UPDATE `hims_f_ordered_services` SET insurance_yesno=?, pre_approval=?, quantity=?, \
      unit_cost=?, gross_amount=?, discount_amout=?, discount_percentage=?, net_amout=?, \
      copay_percentage=?, copay_amount=?, deductable_amount=?, deductable_percentage=?,tax_inclusive=?, \
      patient_tax=?, company_tax=?, total_tax=?, patient_resp=?, patient_payable=?, comapany_resp=?, \
      company_payble=?, updated_date=?,updated_by=? \
      where hims_f_ordered_services_id=?;",
            [
              item.insurance_yesno,
              item.pre_approval,
              item.quantity,
              item.unit_cost,
              item.gross_amount,
              item.discount_amout,
              item.discount_percentage,
              item.net_amout,
              item.copay_percentage,
              item.copay_amount,
              item.deductable_amount,
              item.deductable_percentage,
              item.tax_inclusive,
              item.patient_tax,
              item.company_tax,
              item.total_tax,
              item.patient_resp,
              item.patient_payable,
              item.comapany_resp,
              item.company_payble,
              moment().format("YYYY-MM-DD HH:mm"),
              req.userIdentity.algaeh_d_app_user_id,
              map_data.hims_f_ordered_services_id,
            ]
          );
        });
      }

      if (cal_order_cons.length > 0) {
        cal_order_cons.map((item) => {
          const map_data = order_consumables.find(
            (f) => f.services_id === item.services_id
          );
          updateQuery += _mysql.mysqlQueryFormat(
            "UPDATE `hims_f_ordered_inventory` SET insurance_yesno=?, pre_approval=?, quantity=?, \
        unit_cost=?, gross_amount=?, discount_amout=?, discount_percentage=?, net_amout=?, \
        copay_percentage=?, copay_amount=?, deductable_amount=?, deductable_percentage=?,tax_inclusive=?, \
        patient_tax=?, company_tax=?, total_tax=?, patient_resp=?, patient_payable=?, comapany_resp=?, \
        company_payble=?, updated_date=?,updated_by=? \
        where hims_f_ordered_inventory_id=?;",
            [
              item.insurance_yesno,
              item.pre_approval,
              item.quantity,
              item.unit_cost,
              item.gross_amount,
              item.discount_amout,
              item.discount_percentage,
              item.net_amout,
              item.copay_percentage,
              item.copay_amount,
              item.deductable_amount,
              item.deductable_percentage,
              item.tax_inclusive,
              item.patient_tax,
              item.company_tax,
              item.total_tax,
              item.patient_resp,
              item.patient_payable,
              item.comapany_resp,
              item.company_payble,
              moment().format("YYYY-MM-DD HH:mm"),
              req.userIdentity.algaeh_d_app_user_id,
              map_data.hims_f_ordered_inventory_id,
            ]
          );
        });
      }

      if (cal_order_pack.length > 0) {
        cal_order_pack.map((item) => {
          const map_data = order_packages.find(
            (f) => f.services_id === item.services_id
          );
          updateQuery += _mysql.mysqlQueryFormat(
            "UPDATE `hims_f_package_header` SET insurance_yesno=?, pre_approval=?, quantity=?, \
        unit_cost=?, gross_amount=?, discount_amout=?, discount_percentage=?, net_amout=?, \
        copay_percentage=?, copay_amount=?, deductable_amount=?, deductable_percentage=?,tax_inclusive=?, \
        patient_tax=?, company_tax=?, total_tax=?, patient_resp=?, patient_payable=?, comapany_resp=?, \
        company_payble=?, updated_date=?,updated_by=? \
        where hims_f_package_header_id=?;",
            [
              item.insurance_yesno,
              item.pre_approval,
              item.quantity,
              item.unit_cost,
              item.gross_amount,
              item.discount_amout,
              item.discount_percentage,
              item.net_amout,
              item.copay_percentage,
              item.copay_amount,
              item.deductable_amount,
              item.deductable_percentage,
              item.tax_inclusive,
              item.patient_tax,
              item.company_tax,
              item.total_tax,
              item.patient_resp,
              item.patient_payable,
              item.comapany_resp,
              item.company_payble,
              moment().format("YYYY-MM-DD HH:mm"),
              req.userIdentity.algaeh_d_app_user_id,
              map_data.hims_f_package_header_id,
            ]
          );
        });
      }

      // if (visit_bills_data.length > 0) {
      //   visit_bills_data.map((item) => {
      //     updateQuery += _mysql.mysqlQueryFormat(
      //       "UPDATE `hims_f_billing_details` SET insurance_yesno=?, \
      //     unit_cost=?, gross_amount=?, discount_amout=?, discount_percentage=?, net_amout=?, \
      //     copay_percentage=?, copay_amount=?, deductable_amount=?, deductable_percentage=?, \
      //     patient_tax=?, company_tax=?, total_tax=?, patient_resp=?, patient_payable=?, comapany_resp=?, \
      //     company_payble=?, updated_date=?,updated_by=? \
      //     where hims_f_billing_details_id=?;",
      //       [
      //         item.insurance_yesno,
      //         item.unit_cost,
      //         item.gross_amount,
      //         item.discount_amout,
      //         item.discount_percentage,
      //         item.net_amout,
      //         item.copay_percentage,
      //         item.copay_amount,
      //         item.deductable_amount,
      //         item.deductable_percentage,
      //         item.patient_tax,
      //         item.company_tax,
      //         item.total_tax,
      //         item.patient_resp,
      //         item.patient_payable,
      //         item.comapany_resp,
      //         item.company_payble,
      //         moment().format("YYYY-MM-DD HH:mm"),
      //         req.userIdentity.algaeh_d_app_user_id,
      //         item.hims_f_billing_details_id,
      //       ]
      //     );
      //   });
      // }

      // let collection_data = [];

      if (header_bills.length > 0) {
        for (let i = 0; i < header_bills.length; i++) {
          // const promise_execution = new Promise(async (resolve, reject) => {
          try {
            debugger;
            const header_data = visit_bills_header.find(
              (f) => f.hims_f_billing_header_id === header_bills[i].from_bill_id
            );

            const receiveable_amount =
              parseFloat(header_bills[i].patient_payable) -
              parseFloat(header_data.credit_amount);

            const number_gen = await _mysql
              .generateRunningNumber({
                user_id: req.userIdentity.algaeh_d_app_user_id,
                numgen_codes: ["PAT_BILL", "RECEIPT"],
                table_name: "hims_f_app_numgen",
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });

            // console.log("number_gen", number_gen);
            const headerRcptResult = await _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_f_receipt_header (receipt_number, receipt_date, total_amount,\
              created_by, created_date, updated_by, updated_date, shift_id,hospital_id ) \
              VALUES (?,?,?,?,?,?,?,?,?)",
                values: [
                  number_gen.RECEIPT,
                  new Date(),
                  receiveable_amount,
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  header_data.shift_id,
                  req.userIdentity.hospital_id,
                ],
                printQuery: true,
              })
              .catch((error) => {
                // console.log("error ******");
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });

            // console.log("Im here ");
            const RcptDetailsRecords = await _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_f_receipt_details (hims_f_receipt_header_id, pay_type, amount,\
              created_by, created_date, updated_by, updated_date ) \
              VALUES (?,?,?,?,?,?,?)",
                values: [
                  headerRcptResult.insertId,
                  "CA",
                  receiveable_amount,
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                ],
                printQuery: true,
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });

            // console.log("number_gen", number_gen);

            const insert_bill_header = await _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_f_billing_header ( patient_id, visit_id, bill_number,receipt_header_id,\
                incharge_or_provider, bill_date, advance_amount,advance_adjust, pack_advance_adjust, \
                pack_advance_amount, discount_amount, sub_total_amount, total_tax, \
                sheet_discount_amount, sheet_discount_percentage, net_amount, net_total,gross_total, \
                company_res, patient_res, patient_payable, company_payable, \
                patient_tax, s_patient_tax, company_tax, net_tax, credit_amount, receiveable_amount,\
                balance_credit, from_bill_id, shift_id, created_by, created_date, updated_by, updated_date, copay_amount,\
                deductable_amount,hospital_id)\
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); \
                 update hims_f_billing_header set adjusted='Y',adjusted_by=?, adjusted_date=? where hims_f_billing_header_id=?",
                values: [
                  inputParam.patient_id,
                  inputParam.visit_id,
                  number_gen.PAT_BILL,
                  headerRcptResult.insertId,
                  header_data.incharge_or_provider,
                  new Date(),
                  header_data.advance_amount,
                  header_data.advance_adjust,
                  header_data.pack_advance_adjust,
                  header_data.pack_advance_amount,
                  header_bills[i].discount_amount,
                  header_bills[i].sub_total_amount,
                  header_bills[i].total_tax,
                  header_data.sheet_discount_amount,
                  header_data.sheet_discount_percentage,
                  header_bills[i].patient_payable,
                  header_bills[i].net_total,
                  header_bills[i].gross_total,
                  header_bills[i].company_res,
                  header_bills[i].patient_res,
                  header_bills[i].patient_payable,
                  header_bills[i].company_payable,
                  header_bills[i].patient_tax,
                  header_bills[i].s_patient_tax,
                  header_bills[i].company_tax,
                  header_bills[i].net_tax,
                  header_data.credit_amount,
                  receiveable_amount,
                  header_data.balance_credit,
                  header_bills[i].from_bill_id,
                  header_data.shift_id,
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  header_bills[i].copay_amount,
                  header_bills[i].deductable_amount,
                  req.userIdentity.hospital_id,
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  header_bills[i].from_bill_id,
                ],
                printQuery: true,
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
            let IncludeValues = [
              "service_type_id",
              "services_id",
              "quantity",
              "unit_cost",
              "insurance_yesno",
              "gross_amount",
              "discount_amout",
              "discount_percentage",
              "net_amout",
              "copay_percentage",
              "copay_amount",
              "deductable_amount",
              "deductable_percentage",
              "tax_inclusive",
              "patient_tax",
              "s_patient_tax",
              "company_tax",
              "total_tax",
              "patient_resp",
              "patient_payable",
              "comapany_resp",
              "company_payble",
              "teeth_number",
              "ordered_services_id",
              "ordered_inventory_id",
              "ordered_package_id",
            ];

            // console.log("insert_bill_header", insert_bill_header);
            const insert_bill_detail = await _mysql
              .executeQuery({
                query: "INSERT INTO hims_f_billing_details(??) VALUES ? ;",
                values: header_bills[i].billdetails,
                includeValues: IncludeValues,
                extraValues: {
                  hims_f_billing_header_id: insert_bill_header[0].insertId,
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  created_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date(),
                },
                bulkInsertOrUpdate: true,
                printQuery: true,
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });

            header_bills[i].hims_f_billing_header_id =
              insert_bill_header[0].insertId;
            header_bills[i].insured = inputParam.insured;
            header_bills[i].receipt_header_id = headerRcptResult.insertId;
            req.connection = {
              connection: _mysql.connection,
              isTransactionConnection: _mysql.isTransactionConnection,
              pool: _mysql.pool,
            };
            req.body = header_bills[i];
            req.body.sub_department_id = inputParam.sub_department_id;
            req.body.ScreenCode = "BL0001";

            //Accounting Entry

            const accounting_entry = await generateAccountingEntryChangeEntitle(
              req,
              res,
              next
            );

            // const product_type = await _mysql
            //   .executeQuery({
            //     query:
            //       "select product_type from  hims_d_organization where hims_d_organization_id=1\
            //           and (product_type='HIMS_ERP' or product_type='FINANCE_ERP') limit 1; ",
            //     printQuery: true,
            //   })
            //   .catch((error) => {
            //     _mysql.rollBackTransaction(() => {
            //       next(error);
            //     });
            //   });
            // if (product_type.length == 1) {
            //   const bill_Result = await _mysql
            //     .executeQuery({
            //       query:
            //         "select *, company_payable as company_payble from hims_f_billing_header where hims_f_billing_header_id = ?;\
            //       select BD.* from hims_f_billing_header BH \
            //       inner join hims_f_billing_details BD ON BD.hims_f_billing_header_id = BH.hims_f_billing_header_id \
            //       where BH.hims_f_billing_header_id = ?;\
            //       select RD.* from hims_f_billing_header BH \
            //       inner join hims_f_receipt_details RD on RD.hims_f_receipt_header_id = BH.receipt_header_id \
            //       where BH.hims_f_billing_header_id=?;\
            //       select *, company_payable as company_payble from hims_f_billing_header where hims_f_billing_header_id = ?;\
            //       select BD.* from hims_f_billing_header BH \
            //       inner join hims_f_billing_details BD ON BD.hims_f_billing_header_id = BH.hims_f_billing_header_id \
            //       where BH.hims_f_billing_header_id = ?;\
            //       select RD.* from hims_f_billing_header BH \
            //       inner join hims_f_receipt_details RD on RD.hims_f_receipt_header_id = BH.receipt_header_id \
            //       where BH.hims_f_billing_header_id=?;",
            //       values: [
            //         header_bills[i].from_bill_id,
            //         header_bills[i].from_bill_id,
            //         header_bills[i].from_bill_id,
            //         insert_bill_header[0].insertId,
            //         insert_bill_header[0].insertId,
            //         insert_bill_header[0].insertId,
            //       ],
            //       printQuery: true,
            //     })
            //     .catch((error) => {
            //       _mysql.rollBackTransaction(() => {
            //         next(error);
            //       });
            //     });
            //   const bill_header = bill_Result[0][0];
            //   const bill_detail = bill_Result[1];
            //   const receipt_details = bill_Result[2];

            //   const new_bill_header = bill_Result[3][0];
            //   const new_bill_detail = bill_Result[4];
            //   const new_receipt_details = bill_Result[5];

            //   const servicesIds = ["0"];
            //   if (new_bill_detail && new_bill_detail.length > 0) {
            //     new_bill_detail.forEach((item) => {
            //       servicesIds.push(item.services_id);
            //     });
            //   }

            //   const Result = await _mysql
            //     .executeQuery({
            //       query:
            //         "select finance_accounts_maping_id,account,head_id,child_id from finance_accounts_maping  where \
            //           account in ('OP_DEP','CIH_OP','OUTPUT_TAX','OP_REC','CARD_SETTL', 'OP_CTRL');\
            //           SELECT hims_d_services_id,service_name,head_id,child_id FROM hims_d_services where hims_d_services_id in(?);\
            //           select cost_center_type, cost_center_required from finance_options limit 1;",
            //       values: [servicesIds],
            //       printQuery: true,
            //     })
            //     .catch((error) => {
            //       _mysql.rollBackTransaction(() => {
            //         next(error);
            //       });
            //     });
            // const controls = Result[0];
            // const serviceData = Result[1];
            // // const insurance_data = Result[3];

            // const OP_DEP = controls.find((f) => {
            //   return f.account == "OP_DEP";
            // });

            // const CIH_OP = controls.find((f) => {
            //   return f.account == "CIH_OP";
            // });
            // const OUTPUT_TAX = controls.find((f) => {
            //   return f.account == "OUTPUT_TAX";
            // });
            // const OP_REC = controls.find((f) => {
            //   return f.account == "OP_REC";
            // });
            // const CARD_SETTL = controls.find((f) => {
            //   return f.account == "CARD_SETTL";
            // });
            // const OP_CTRL = controls.find((f) => {
            //   return f.account == "OP_CTRL";
            // });

            // let voucher_type = "";
            // let narration = "";
            // let amount = 0;

            // const EntriesArray = [];

            // voucher_type = "sales";

            // amount = new_bill_header.receiveable_amount;
            // narration = "Bill Adjustment Done From :" + bill_header.bill_number;

            // //BOOKING INCOME AND TAX
            // // New Bill Booking
            // //Starts Here
            // serviceData.forEach((curService) => {
            //   const bill = new_bill_detail.filter((f) => {
            //     if (f.services_id == curService.hims_d_services_id) return f;
            //   });

            //   const credit_amount = _.sumBy(bill, (s) =>
            //     parseFloat(s.net_amout)
            //   );

            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: curService.head_id,
            //     child_id: curService.child_id,
            //     debit_amount: 0,
            //     payment_type: "CR",
            //     credit_amount: credit_amount,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // });

            // //ADJUSTING AMOUNT FROM PRVIOUS ADVANCE
            // if (new_bill_header.advance_adjust > 0) {
            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: OP_DEP.head_id,
            //     child_id: OP_DEP.child_id,
            //     debit_amount: new_bill_header.advance_adjust,
            //     payment_type: "DR",
            //     credit_amount: 0,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // }
            // //PROVIDING OP SERVICE ON CREDIT
            // if (new_bill_header.credit_amount > 0) {
            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: OP_REC.head_id,
            //     child_id: OP_REC.child_id,
            //     debit_amount: new_bill_header.credit_amount,
            //     payment_type: "DR",
            //     credit_amount: 0,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // }

            // //INCREASING CASH IN CAND AND BANK
            // new_receipt_details.forEach((m) => {
            //   if (m.pay_type == "CD") {
            //     EntriesArray.push({
            //       payment_date: new Date(),
            //       head_id: CARD_SETTL.head_id,
            //       child_id: CARD_SETTL.child_id,
            //       debit_amount: m.amount,
            //       payment_type: "DR",
            //       credit_amount: 0,
            //       hospital_id: req.userIdentity.hospital_id,
            //     });
            //   } else {
            //     EntriesArray.push({
            //       payment_date: new Date(),
            //       head_id: CIH_OP.head_id,
            //       child_id: CIH_OP.child_id,
            //       debit_amount: m.amount,
            //       payment_type: "DR",
            //       credit_amount: 0,
            //       hospital_id: req.userIdentity.hospital_id,
            //     });
            //   }
            // });

            // //insurance company payable

            // if (
            //   inputParam.insured == "Y" &&
            //   parseFloat(new_bill_header.company_payble) > 0
            // ) {
            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: OP_CTRL.head_id,
            //     child_id: OP_CTRL.child_id,
            //     debit_amount: new_bill_header.company_payble,
            //     payment_type: "DR",
            //     credit_amount: 0,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // }

            // //TAX part

            // if (parseFloat(new_bill_header.total_tax) > 0) {
            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: OUTPUT_TAX.head_id,
            //     child_id: OUTPUT_TAX.child_id,
            //     debit_amount: 0,
            //     payment_type: "CR",
            //     credit_amount: new_bill_header.total_tax,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // }
            // //Ends Here

            // //REVERT BOOKING INCOME AND TAX
            // //Old Bill revert
            // //Starts Here
            // serviceData.forEach((curService) => {
            //   const bill = bill_detail.filter((f) => {
            //     if (f.services_id == curService.hims_d_services_id) return f;
            //   });

            //   const debeit_amount = _.sumBy(bill, (s) =>
            //     parseFloat(s.net_amout)
            //   );

            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: curService.head_id,
            //     child_id: curService.child_id,
            //     debit_amount: debeit_amount,
            //     payment_type: "DR",
            //     credit_amount: 0,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // });

            // //ADJUSTING AMOUNT FROM PRVIOUS ADVANCE
            // if (bill_header.advance_adjust > 0) {
            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: OP_DEP.head_id,
            //     child_id: OP_DEP.child_id,
            //     debit_amount: 0,
            //     payment_type: "CR",
            //     credit_amount: bill_header.advance_adjust,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // }
            // //PROVIDING OP SERVICE ON CREDIT
            // if (bill_header.credit_amount > 0) {
            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: OP_REC.head_id,
            //     child_id: OP_REC.child_id,
            //     debit_amount: 0,
            //     payment_type: "CR",
            //     credit_amount: bill_header.credit_amount,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // }

            // //INCREASING CASH IN CAND AND BANK
            // receipt_details.forEach((m) => {
            //   if (m.pay_type == "CD") {
            //     EntriesArray.push({
            //       payment_date: new Date(),
            //       head_id: CARD_SETTL.head_id,
            //       child_id: CARD_SETTL.child_id,
            //       debit_amount: 0,
            //       payment_type: "CR",
            //       credit_amount: m.amount,
            //       hospital_id: req.userIdentity.hospital_id,
            //     });
            //   } else {
            //     EntriesArray.push({
            //       payment_date: new Date(),
            //       head_id: CIH_OP.head_id,
            //       child_id: CIH_OP.child_id,
            //       debit_amount: 0,
            //       payment_type: "CR",
            //       credit_amount: m.amount,
            //       hospital_id: req.userIdentity.hospital_id,
            //     });
            //   }
            // });

            // //insurance company payable
            // if (
            //   inputParam.insured == "Y" &&
            //   parseFloat(bill_header.company_payble) > 0
            // ) {
            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: OP_CTRL.head_id,
            //     child_id: OP_CTRL.child_id,
            //     debit_amount: 0,
            //     payment_type: "CR",
            //     credit_amount: bill_header.company_payble,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // }

            // //TAX part

            // if (parseFloat(bill_header.total_tax) > 0) {
            //   EntriesArray.push({
            //     payment_date: new Date(),
            //     head_id: OUTPUT_TAX.head_id,
            //     child_id: OUTPUT_TAX.child_id,
            //     debit_amount: bill_header.total_tax,
            //     payment_type: "DR",
            //     credit_amount: 0,
            //     hospital_id: req.userIdentity.hospital_id,
            //   });
            // }
            // //Ends Here

            // let strQuery = "";

            // if (
            //   Result[2][0].cost_center_required === "Y" &&
            //   Result[2][0].cost_center_type === "P"
            // ) {
            //   strQuery = `select  hims_m_division_project_id, project_id from hims_m_division_project D \
            //       inner join hims_d_project P on D.project_id=P.hims_d_project_id \
            //       inner join hims_d_hospital H on D.division_id=H.hims_d_hospital_id where \
            //       division_id= ${req.userIdentity.hospital_id} limit 1;`;
            // }
            // const header_result = await _mysql
            //   .executeQueryWithTransaction({
            //     query:
            //       "INSERT INTO finance_day_end_header (transaction_date,amount,voucher_type,document_id,\
            //     document_number,from_screen,narration,entered_by,entered_date) \
            //     VALUES (?,?,?,?,?,?,?,?,?);" +
            //       strQuery,
            //     values: [
            //       new Date(),
            //       amount,
            //       voucher_type,
            //       new_bill_header.hims_f_billing_header_id,
            //       new_bill_header.bill_number,
            //       inputParam.ScreenCode,
            //       narration,
            //       req.userIdentity.algaeh_d_app_user_id,
            //       new Date(),
            //     ],
            //     printQuery: true,
            //   })
            //   .catch((error) => {
            //     _mysql.rollBackTransaction(() => {
            //       next(error);
            //     });
            //   });
            // let project_id = null;

            // let headerDayEnd = [];
            // if (header_result.length > 1) {
            //   headerDayEnd = header_result[0];
            //   project_id = header_result[1][0].project_id;
            // } else {
            //   headerDayEnd = header_result;
            // }

            // const month = moment().format("M");
            // const year = moment().format("YYYY");
            // const IncludeValuess = [
            //   "payment_date",
            //   "head_id",
            //   "child_id",
            //   "debit_amount",
            //   "payment_type",
            //   "credit_amount",
            //   "hospital_id",
            // ];

            // const subResult = await _mysql
            //   .executeQueryWithTransaction({
            //     query: "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
            //     values: EntriesArray,
            //     includeValues: IncludeValuess,
            //     bulkInsertOrUpdate: true,
            //     extraValues: {
            //       year: year,
            //       month: month,
            //       day_end_header_id: headerDayEnd.insertId,
            //       project_id: project_id,
            //       sub_department_id: req.body.sub_department_id,
            //     },
            //     printQuery: true,
            //   })
            //   .catch((error) => {
            //     reject(error);
            //   });
            // }
            // resolve();
          } catch (error) {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          }
          // });
          // collection_data.push(promise_execution);
          _mysql.commitTransaction();
        }
      } else {
        _mysql.releaseConnection();
        req.records = { invalid_input: false };
        next();
      }
      // else {
      //   collection_data.push(new Promise.resolve());
      // }

      // Promise.all(collection_data)
      //   .then(() => {
      _mysql
        .executeQuery({
          query: updateQuery,
          printQuery: true,
        })
        .then((subdetail) => {
          // console.log("1lllll");
          _mysql.releaseConnection();
          req.records = { invalid_input: false };
          next();
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    }
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}
