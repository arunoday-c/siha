import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import { LINQ } from "node-linq";

module.exports = {
  insertInvOrderedServices: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = { ...req.body };

      let IncludeValues = [
        "patient_id",
        "visit_id",
        "doctor_id",
        "inventory_item_id",
        "inventory_location_id",
        "inventory_uom_id",
        "service_type_id",
        "item_chargable",
        "batchno",
        "expirydt",
        "grnno",
        "services_id",
        "insurance_yesno",
        "insurance_provider_id",
        "insurance_sub_id",
        "network_id",
        "insurance_network_office_id",
        "policy_number",
        "pre_approval",
        "quantity",
        "unit_cost",
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
        "company_tax",
        "total_tax",
        "patient_resp",
        "patient_payable",
        "comapany_resp",
        "company_payble",
        "sec_company",
        "sec_deductable_percentage",
        "sec_deductable_amount",
        "sec_company_res",
        "sec_company_tax",
        "sec_company_paybale",
        "sec_copay_percntage",
        "sec_copay_amount"
      ];

      _mysql
        .executeQuery({
          query: "INSERT INTO hims_f_ordered_inventory(??) VALUES ?",
          values: input.billdetails,
          includeValues: IncludeValues,
          extraValues: {
            created_by: req.userIdentity.algaeh_d_app_user_id,
            created_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
            updated_date: new Date(),
            hospital_id: req.userIdentity.hospital_id
          },
          bulkInsertOrUpdate: true,
          printQuery: true
        })
        .then(resultOrder => {
          let servicesForPreAproval = [];
          let patient_id;
          let doctor_id;
          let visit_id;

          let services = new LINQ(req.body.billdetails)
            .Select(s => {
              patient_id = s.patient_id;
              doctor_id = s.doctor_id;
              visit_id = s.visit_id;
              return s.services_id;
            })
            .ToArray();

          if (services.length > 0) {
            servicesForPreAproval.push(patient_id);
            servicesForPreAproval.push(doctor_id);
            servicesForPreAproval.push(visit_id);
            servicesForPreAproval.push(services);

            _mysql
              .executeQuery({
                query:
                  "SELECT hims_f_ordered_inventory_id,services_id,created_date, service_type_id from hims_f_ordered_inventory\
                where `patient_id`=? and `doctor_id`=? and `visit_id`=? and `services_id` in (?)",
                values: servicesForPreAproval,
                printQuery: true
              })
              .then(ResultOfFetchOrderIds => {
                let detailsPush = new LINQ(req.body.billdetails)
                  .Where(g => g.pre_approval == "Y")
                  .Select(s => {
                    return {
                      ...s,
                      ...{
                        hims_f_ordered_inventory_id: new LINQ(
                          ResultOfFetchOrderIds
                        )
                          .Where(w => w.services_id == s.services_id)
                          .FirstOrDefault().hims_f_ordered_inventory_id
                      }
                    };
                  })
                  .ToArray();
                if (detailsPush.length > 0) {
                  const insurtCols = [
                    "ordered_services_id",
                    "service_id",
                    "insurance_provider_id",
                    "insurance_network_office_id",
                    "icd_code",
                    "requested_quantity",
                    "insurance_service_name",
                    "doctor_id",
                    "patient_id",
                    "gross_amt",
                    "net_amount"
                  ];

                  _mysql
                    .executeQuery({
                      query: "INSERT INTO hims_f_service_approval(??) VALUES ?",
                      values: detailsPush,
                      includeValues: insurtCols,
                      replcaeKeys: [
                        {
                          service_id: "services_id",
                          gross_amt: "ser_gross_amt",
                          net_amount: "ser_net_amount",
                          hims_f_ordered_inventory:
                            "hims_f_ordered_inventory_id"
                        }
                      ],
                      extraValues: {
                        created_by: req.userIdentity.algaeh_d_app_user_id,
                        created_date: new Date(),
                        updated_by: req.userIdentity.algaeh_d_app_user_id,
                        updated_date: new Date()
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(result => {
                      // _mysql.releaseConnection();
                      req.body.inventory_stock_detail = input.billdetails;
                      req.records = result;
                      next();
                    })
                    .catch(error => {
                      _mysql.releaseConnection();
                      next(error);
                    });
                } else {
                  // _mysql.releaseConnection();
                  req.body.inventory_stock_detail = input.billdetails;
                  req.records = { resultOrder, ResultOfFetchOrderIds };
                  next();
                }

                // _mysql.releaseConnection();
                // req.records = result;
                // next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            // _mysql.releaseConnection();
            req.body.inventory_stock_detail = input.billdetails;
            req.records = { resultOrder, ResultOfFetchOrderIds };
            next();
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  addProcedureItems: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let input = req.body;

      const IncludeValues = [
        "patient_id",
        "episode_id",
        "procedure_id",
        "location_id",
        "location_type",
        "item_id",
        "item_category_id",
        "item_group_id",
        "uom_id",
        "batchno",
        "expirydt",
        "barcode",
        "grn_no",
        "unit_cost",
        "quantity",
        "qtyhand",
        "extended_cost"
      ];

      _mysql
        .executeQuery({
          query: "INSERT INTO hims_f_procedure_items(??) VALUES ?",
          values: input.Procedure_items,
          includeValues: IncludeValues,
          extraValues: {
            created_by: req.userIdentity.algaeh_d_app_user_id,
            created_date: new Date(),
            updated_by: req.userIdentity.algaeh_d_app_user_id,
            updated_date: new Date(),
            hospital_id: req.userIdentity.hospital_id
          },
          bulkInsertOrUpdate: true,
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
