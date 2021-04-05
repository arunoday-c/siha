import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import axios from "axios";

export async function addChangeOfEntitlement(req, res, next) {
  const _options = req.connection == null ? {} : req.connection;
  const _mysql = new algaehMysql(_options);
  try {
    let inputParam = { ...req.body };
    let updateQuery = "";
    let _billing_header_id = [];
    //   insured   hims_f_patient_visit

    // console.log("inputParam", inputParam);

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
            SELECT hims_f_billing_details_id, hims_f_billing_header_id, services_id FROM \
            hims_f_billing_details where hims_f_billing_header_id=?;",
        values: [
          inputParam.visit_id,
          inputParam.visit_id,
          inputParam.visit_id,
          inputParam.visit_id,
          _billing_header_id,
        ],
        printQuery: true,
      })
      .catch((error) => {
        throw error;
      });

    const order_services = headerResult[0];
    const order_consumables = headerResult[1];
    const order_packages = headerResult[2];
    const visit_insurance = headerResult[3];
    const visit_bills = headerResult[4];

    // console.log("visit_bills", visit_bills);
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
        UPDATE hims_f_patient_visit set insured='N' where hims_f_patient_visit_id=?;",
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
        throw error;
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
        throw error;
      });
    }

    console.log("recalculate_services", recalculate_services);

    const visit_services =
      recalculate_services === null
        ? []
        : recalculate_services.data.records.billdetail;
    const visit_bills_data =
      recalculate_bills === null
        ? []
        : recalculate_bills.data.records.billdetails;

    console.log("visit_services", visit_services);

    const cal_order_serv = visit_services.filter(
      (f) => f.service_type_id === 5 || f.service_type_id === 11
    );
    const cal_order_cons = visit_services.filter(
      (f) => f.service_type_id === 4
    );
    const cal_order_pack = visit_services.filter(
      (f) => f.service_type_id === 14
    );

    // const header_bills = _.chain(visit_bills_data)
    //   .groupBy((g) => g.hims_f_billing_header_id)
    //   .value();

    const header_bills = _.chain(visit_bills_data)
      .groupBy((g) => g.hims_f_billing_header_id)
      .map(function (detail, key) {
        console.log("detail", detail);
        return {
          hims_f_billing_header_id: detail[0].hims_f_billing_header_id,

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
        };
      })
      .value();

    console.log("header_bills", header_bills);
    // const ord_services = await getBillDetails()
    // .catch((error) => {
    //   throw error;
    // });
    console.log("cal_order_serv:", cal_order_serv);
    console.log("cal_order_cons:", cal_order_cons);
    console.log("cal_order_pack:", cal_order_pack);

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

    if (visit_bills_data.length > 0) {
      visit_bills_data.map((item) => {
        updateQuery += _mysql.mysqlQueryFormat(
          "UPDATE `hims_f_billing_details` SET insurance_yesno=?, \
        unit_cost=?, gross_amount=?, discount_amout=?, discount_percentage=?, net_amout=?, \
        copay_percentage=?, copay_amount=?, deductable_amount=?, deductable_percentage=?, \
        patient_tax=?, company_tax=?, total_tax=?, patient_resp=?, patient_payable=?, comapany_resp=?, \
        company_payble=?, updated_date=?,updated_by=? \
        where hims_f_billing_details_id=?;",
          [
            item.insurance_yesno,
            item.unit_cost,
            item.gross_amount,
            item.discount_amout,
            item.discount_percentage,
            item.net_amout,
            item.copay_percentage,
            item.copay_amount,
            item.deductable_amount,
            item.deductable_percentage,
            item.patient_tax,
            item.company_tax,
            item.total_tax,
            item.patient_resp,
            item.patient_payable,
            item.comapany_resp,
            item.company_payble,
            moment().format("YYYY-MM-DD HH:mm"),
            req.userIdentity.algaeh_d_app_user_id,
            item.hims_f_billing_details_id,
          ]
        );
      });
    }

    if (header_bills.length > 0) {
      header_bills.map((item) => {
        updateQuery += _mysql.mysqlQueryFormat(
          "UPDATE `hims_f_billing_header` SET sub_total_amount=?, \
          net_total=?, discount_amount=?, gross_total=?, copay_amount=?, deductable_amount=?, \
          patient_res=?, company_res=?, total_tax=?, patient_tax=?, \
          s_patient_tax=?, company_tax=?, patient_payable=?, company_payable=?, updated_date=?,updated_by=? \
            where hims_f_billing_header_id=?;",
          [
            item.sub_total_amount,
            item.net_total,
            item.discount_amount,
            item.gross_total,

            item.copay_amount,
            item.deductable_amount,
            item.patient_res,
            item.company_res,
            item.total_tax,
            item.patient_tax,
            item.s_patient_tax,
            item.company_tax,
            item.patient_payable,
            item.company_payable,
            moment().format("YYYY-MM-DD HH:mm"),
            req.userIdentity.algaeh_d_app_user_id,
            item.hims_f_billing_header_id,
          ]
        );
      });
    }

    // console.log("updateQuery", updateQuery);

    const update_data = await _mysql
      .executeQuery({
        query: updateQuery,
        printQuery: true,
      })
      .catch((error) => {
        throw error;
      });
    _mysql.releaseConnection();
    next();
  } catch (e) {
    _mysql.rollBackTransaction(() => {
      next(e);
    });
  }
}
