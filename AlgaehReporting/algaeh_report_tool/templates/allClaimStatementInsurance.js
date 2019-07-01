const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _mysql = options.mysql;
  const inputParams = options.inputs;
  const _ = options.loadash;
  const moment = options.moment;

  const utilities = new algaehUtilities();
  return new Promise(function(resolve, reject) {
    try {
      _mysql
        .executeQuery({
          query:
            " select O.tax_number,H.hospital_name,C.decimal_places from hims_d_hospital as  H,hims_d_organization as O,hims_d_currency as C where H.organization_id =  O.hims_d_organization_id and C.hims_d_currency_id =H.default_currency \
					and H.hims_d_hospital_id=?; \
					select \
					IH.network_id,\
					  INN.network_type as policy_name,\
					  INO.employer as provider_name,\
					  coalesce(ID.gross_amount,0) as gross_amount,\
					  coalesce(ID.discount_amount,0)as discount_amount,\
					  coalesce(0,0) as deductible,\
					  coalesce(ID.net_amount,0) as net_amount,\
					  (coalesce(ID.company_tax,0) + coalesce(ID.patient_tax,0)) as vat, \
					  (coalesce(ID.net_amount,0) + coalesce(ID.company_tax,0) + coalesce(ID.patient_tax,0)) as net_vat, \
					  IP.insurance_provider_name as company_name,\
					  INO.policy_number as provider_code,\
					  IP.insurance_provider_code as policy_holder,\
					  P.patient_code,P.full_name,IH.invoice_number,\
					  IH.invoice_date,IH.card_number as membership_no,\
					  ID.service_type_id,ID.patient_resp as co_pay,\
					  ID.patient_tax,ID.company_tax,IH.patient_id,ID.unit_cost, \
					IH.visit_id,SI.procedure_type from \
					  hims_f_invoice_header as IH \
					left outer join hims_d_insurance_network INN on \
					  IH.network_id = INN.hims_d_insurance_network_id \
					left outer join hims_d_insurance_provider IP on \
					  IH.insurance_provider_id = IP.hims_d_insurance_provider_id \
					inner join hims_d_insurance_network_office INO on \
					  IH.network_office_id = INO.hims_d_insurance_network_office_id inner join  hims_f_invoice_details ID  \
					  on IH.hims_f_invoice_header_id = ID.invoice_header_id inner join hims_f_patient P on P.hims_d_patient_id = IH.patient_id  inner  join hims_d_services as SI \
					  on SI.hims_d_services_id = ID.service_id\
				  where IH.insurance_provider_id=? \
				  and date(IH.invoice_date) between date(?) and date(?) and IH.claim_validated ='V'",
          values: [
            inputParams.hospital_id,
            inputParams.insurance_provider_id,
            inputParams.invoice_from_date,
            inputParams.invoice_to_date
          ],
          printQuery: true
        })
        .then(function(tables) {
          _mysql.releaseConnection();
          const generalHeader = {
            vat_no: tables[0][0]["tax_number"],
            claim_month: moment(inputParams.invoice_from_date).format(
              "MMM-YYYY"
            ),
            from_date: moment(inputParams.invoice_from_date).format(
              "DD-MM-YYYY"
            ),
            to_date: moment(inputParams.invoice_to_date).format("DD-MM-YYYY")
          };

          //Object are created by sheet names in excel like ( GSS)
          let dataObject = {
            GSS: {
              ...generalHeader
            },
            "Policy Holder": { ...generalHeader }
          };
          const decimals = tables[0][0]["decimal_places"];
          dataObject["GSS"]["POLICY"] = [];
          let _copySheets = [];
          if (tables[1].length > 0) {
            dataObject["GSS"]["company_name"] = tables[1][0]["company_name"];
            dataObject["GSS"]["provider_code"] = tables[1][0]["provider_code"];
            dataObject["GSS"]["policy_holder"] = tables[1][0]["policy_holder"];
            dataObject["GSS"]["provider_name"] = tables[1][0]["provider_name"];
            const groupBy = _.chain(tables[1])
              .groupBy(g => g.network_id)
              .map(function(details, key) {
                return {
                  network_id: key,
                  details: details
                };
              })
              .value();
            let GSS_POLICY = [];
            let sheets_copy = [];
            for (let i = 0; i < groupBy.length; i++) {
              const objectCreate = {};
              if (i > 0) {
                sheets_copy.push({
                  copySheetName: "Policy Holder",
                  newSheetName: "Policy Holder " + i
                });
              }
              objectCreate["seq"] = i + 1;
              objectCreate["policy_name"] =
                groupBy[i]["details"][0]["policy_name"];

              objectCreate["gross_amount"] = _.sumBy(groupBy[i]["details"], s =>
                parseFloat(s.gross_amount)
              ).toFixed(decimals);
              objectCreate["discount_amount"] = _.sumBy(
                groupBy[i]["details"],
                s => parseFloat(s.discount_amount)
              ).toFixed(decimals);
              objectCreate["deductible"] = _.sumBy(groupBy[i]["details"], s =>
                parseFloat(s.deductible)
              ).toFixed(decimals);
              objectCreate["net_amount"] = _.sumBy(groupBy[i]["details"], s =>
                parseFloat(s.net_amount)
              ).toFixed(decimals);
              objectCreate["vat"] = _.sumBy(groupBy[i]["details"], s =>
                parseFloat(s.vat)
              ).toFixed(decimals);
              objectCreate["net_vat"] = _.sumBy(groupBy[i]["details"], s =>
                parseFloat(s.net_vat)
              ).toFixed(decimals);
              GSS_POLICY.push(objectCreate);
              let pat = 0;

              const policySheet = _.chain(groupBy[i]["details"])
                .groupBy(g => g.visit_id)
                .map(function(details, key) {
                  const _dtl = details[0];
                  pat = pat + 1;

                  return {
                    ..._dtl,
                    invoice_date: moment(_dtl["invoice_date"]).format(
                      "DD-MM-YYYY"
                    ),
                    seq: pat,
                    consultation: _.chain(details)
                      .filter(f => f.service_type_id == 1)
                      .sumBy(s => parseFloat(s.unit_cost))
                      .value(),
                    lab: _.chain(details)
                      .filter(f => f.service_type_id == 5)
                      .sumBy(s => parseFloat(s.unit_cost))
                      .value(),
                    rad: _.chain(details)
                      .filter(f => f.service_type_id == 11)
                      .sumBy(s => parseFloat(s.unit_cost))
                      .value(),
                    dental: _.chain(details)
                      .filter(f => f.procedure_type == "DN")
                      .sumBy(s => parseFloat(s.unit_cost))
                      .value(),
                    medical_procedure: _.chain(details)
                      .filter(f => f.service_type_id == 2)
                      .sumBy(s => parseFloat(s.unit_cost))
                      .value(),
                    medicines: _.chain(details)
                      .filter(f => f.service_type_id == 12)
                      .sumBy(s => parseFloat(s.unit_cost))
                      .value(),
                    gross_amount: _.sumBy(details, s =>
                      parseFloat(s.gross_amount)
                    ),
                    discount_amount: _.sumBy(details, s =>
                      parseFloat(s.discount_amount)
                    ),
                    co_pay: _.sumBy(details, s => parseFloat(s.co_pay)),
                    patient_tax: _.sumBy(details, s =>
                      parseFloat(s.patient_tax)
                    ),
                    net_amount: _.sumBy(details, s => parseFloat(s.net_amount)),
                    payer_vat: _.sumBy(details, s => parseFloat(s.company_tax))
                  };
                })
                .value();
              objectCreate["claims_no"] = policySheet.length;
              let number = "";
              if (i > 0) {
                number = i;
              }
              dataObject["Policy Holder" + number]["POLICY"] = policySheet;
              dataObject["Policy Holder" + number]["company_name"] =
                groupBy[i]["details"][0]["company_name"];
              dataObject["Policy Holder" + number]["provider_code"] =
                groupBy[i]["details"][0]["provider_code"];
              dataObject["Policy Holder" + number]["policy_holder"] =
                groupBy[i]["details"][0]["policy_holder"];
              dataObject["Policy Holder" + number]["provider_name"] =
                groupBy[i]["details"][0]["provider_name"];

              dataObject["Policy Holder" + number][
                "grand_consultation"
              ] = _.sumBy(policySheet, s => s.consultation);
              dataObject["Policy Holder" + number]["grand_lab"] = _.sumBy(
                policySheet,
                s => s.lab
              );
              dataObject["Policy Holder" + number]["grand_rad"] = _.sumBy(
                policySheet,
                s => s.rad
              );
              dataObject["Policy Holder" + number]["grand_dental"] = _.sumBy(
                policySheet,
                s => s.dental
              );
              dataObject["Policy Holder" + number][
                "grand_medical_procedure"
              ] = _.sumBy(policySheet, s => s.medical_procedure);

              dataObject["Policy Holder" + number]["grand_medicines"] = _.sumBy(
                policySheet,
                s => s.medicines
              );

              dataObject["Policy Holder" + number][
                "grand_gross_amount"
              ] = _.sumBy(policySheet, s => s.gross_amount);
              dataObject["Policy Holder" + number][
                "grand_discount_amount"
              ] = _.sumBy(policySheet, s => s.discount_amount);
              dataObject["Policy Holder" + number]["grand_co_pay"] = _.sumBy(
                policySheet,
                s => s.co_pay
              );
              dataObject["Policy Holder" + number][
                "grand_patient_tax"
              ] = _.sumBy(policySheet, s => s.patient_tax);
              dataObject["Policy Holder" + number][
                "grand_net_amount"
              ] = _.sumBy(policySheet, s => s.net_amount);
              dataObject["Policy Holder" + number]["grand_payer_vat"] = _.sumBy(
                policySheet,
                s => s.payer_vat
              );
              dataObject["Policy Holder" + number][
                "grand_net_amount_grand_payer_vat"
              ] =
                dataObject["Policy Holder" + number]["grand_net_amount"] +
                dataObject["Policy Holder" + number]["grand_payer_vat"];
            }
            dataObject["GSS"]["company_name"] = tables[1][0]["company_name"];
            dataObject["GSS"]["provider_code"] = tables[1][0]["provider_code"];
            dataObject["GSS"]["policy_holder"] = tables[1][0]["policy_holder"];
            dataObject["GSS"]["provider_name"] = tables[1][0]["provider_name"];

            dataObject["GSS"]["POLICY"] = GSS_POLICY;
            dataObject["GSS"]["grand_claims_no"] = _.sumBy(
              GSS_POLICY,
              s => s.claims_no
            );
            dataObject["GSS"]["grand_gross_amount"] = _.sumBy(
              GSS_POLICY,
              s => s.gross_amount
            );
            dataObject["GSS"]["grand_discount"] = _.sumBy(
              GSS_POLICY,
              s => s.discount_amount
            );
            dataObject["GSS"]["grand_deductable"] = _.sumBy(
              GSS_POLICY,
              s => s.deductible
            );
            dataObject["GSS"]["grand_net_amount"] = _.sumBy(
              GSS_POLICY,
              s => s.net_amount
            );
            dataObject["GSS"]["grand_vat"] = _.sumBy(GSS_POLICY, s => s.vat);
            dataObject["GSS"]["grand_net_vat"] = _.sumBy(
              GSS_POLICY,
              s => s.net_vat
            );
            _copySheets = groupBy.length <= 1 ? [] : sheets_copy;
          }

          utilities
            .logger()
            .log("result: ", { data: dataObject, copySheets: _copySheets });

          resolve({ data: dataObject, copySheets: _copySheets });
        })
        .catch(function(error) {
          _mysql.releaseConnection();
          reject(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      reject(e);
    }
  });
};
module.exports = { executePDF };
