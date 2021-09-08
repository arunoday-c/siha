import algaehMysql from "algaeh-mysql";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
export async function patientBillGeneration(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    const { hospital_id, algaeh_d_app_user_id } = req.userIdentity;
    const { patientList } = req.body;
    const headers = req.headers;

    const result = await _mysql
      .executeQuery({
        query: `select * from portal_patient_package_header where portal_package_id in (?);
            select H.default_nationality,H.default_country,H.default_patient_type,H.default_doc_quick_reg,
            E.sub_department_id,SD.department_type,SD.department_id,H.vat_applicable from hims_d_hospital as H inner join hims_d_employee as E on
            E.hims_d_employee_id = H.default_doc_quick_reg inner join hims_d_sub_department as SD on 
            SD.hims_d_sub_department_id =E.sub_department_id  where H.hims_d_hospital_id=?;
            select hims_d_identity_document_id,identity_document_name from  hims_d_identity_document where record_status='A';
            select hims_d_visit_type_id from hims_d_visit_type where consultation ='N' and record_status ='A' limit 1;
            select title,his_d_title_id from hims_d_title where record_status='A';
            select shift_id from hims_m_cashier_shift where cashier_id=? and record_status='A'
            and date(from_date) <= date(?) and date(to_date) >= ? limit 1;`,
        values: [
          patientList,
          hospital_id,
          algaeh_d_app_user_id,
          moment().format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ],
      })
      .catch((error) => {
        throw error;
      });
    const portalRecords = result[0];
    const defaultsData = _.head(result[1]);
    const identities = result[2];
    const visitType = _.head(result[3]);
    const titleType = result[4];
    const shift = _.head(result[5]);
    if (!shift) {
      throw new Error("Shift is not there for this user to process");
    }
    for (let i = 0; i < portalRecords.length; i++) {
      try {
        const {
          portal_package_id,
          patient_name,
          mobile_no,
          insurance_user,
          identity_type,
          patient_identity,
          patient_gender,
          patient_dob,
          nationality_id,
          patient_code,
        } = portalRecords[i];
        console.log("portalRecords[i]", portalRecords[i])
        console.log("patient_identity", patient_identity)
        const primary_identity_id = _.find(identities, (f) =>
          f.identity_document_name
            .toLowerCase()
            .includes(identity_type.toLowerCase())
        )?.hims_d_identity_document_id;
        // const primary_id_no = patient_identity;
        const title_id = _.find(titleType, (f) =>
          (f.title.toLowerCase() === patient_gender.toLowerCase()) === "male"
            ? "mr"
            : "ms"
        )?.his_d_title_id;

        const response = await _mysql
          .executeQuery({
            query: `SELECT SI.insurance_provider_id,SI.hims_d_insurance_sub_id,
          INN.hims_d_insurance_network_id,INO.policy_number ,INO.hims_d_insurance_network_office_id,
          INN.effective_start_date,INN.effective_end_date
           FROM hims_d_insurance_sub as SI inner join 
          hims_d_insurance_network as INN on SI.hims_d_insurance_sub_id = INN.insurance_sub_id
          and SI.insurance_provider_id =INN.insurance_provider_id 
          inner join hims_d_insurance_network_office as INO on INO.network_id=INN.hims_d_insurance_network_id
            where upper(SI.user_id)=upper(?);
            select hims_d_patient_id,patient_code from hims_f_patient where primary_id_no=?`,
            values: [insurance_user, patient_identity],
            printQuery: true,
          })
          .catch((error) => {
            throw error;
          });
        const insuranceSub = _.head(response[0]);
        const patientTable = _.head(response[1]);
        const tel_code = "+" + mobile_no.replace("+", "").substring(0, 3);
        const contact_number = mobile_no.substring(3, 12);
        const _patient_code = patientTable?.patient_code ?? patient_code;
        const insertData = {
          title_id,
          full_name: patient_name,
          arabic_name: patient_name,
          gender: patient_gender,
          visit_type: defaultsData?.hims_d_visit_type_id,
          date_of_birth: patient_dob,
          tel_code: tel_code,
          contact_number,
          patient_type: defaultsData?.default_patient_type,
          country_id: defaultsData?.default_country,
          nationality_id: nationality_id,
          primary_identity_id,
          primary_id_no: patient_identity,
          primary_insurance_provider_id: insuranceSub?.insurance_provider_id,
          primary_sub_id: insuranceSub?.hims_d_insurance_sub_id,
          primary_network_id: insuranceSub?.hims_d_insurance_network_id,
          primary_policy_num: insuranceSub?.policy_number,
          primary_card_number: `PORTAL_${patient_identity}`,
          primary_effective_start_date: insuranceSub?.effective_start_date,
          primary_effective_end_date: insuranceSub?.effective_end_date,
          visit_type: visitType?.hims_d_visit_type_id,
          patient_code: _patient_code,
          hims_d_patient_id: patientTable?.hims_d_patient_id,
          hims_f_patient_id: patientTable?.hims_d_patient_id,
          patient_id: patientTable?.hims_d_patient_id,
          insured: "Y",
          portal_exists: "Y",
          from_package: false,
          service_name: "service_name",
          department_id: defaultsData?.department_id,
          sub_department_id: defaultsData?.sub_department_id,
          doctor_id: defaultsData?.default_doc_quick_reg,
          department_type: defaultsData?.department_type,
          consultation: "N",
          maternity_patient: "N",
          is_mlc: "N",
          existing_plan: "N",
          incharge_or_provider: defaultsData?.default_doc_quick_reg,
          ScreenCode: "BL0001",
          insuranceInfo: {
            primary_network_office_id:
              insuranceSub?.hims_d_insurance_network_id,
            user_id: insurance_user,
            creidt_limit_req: "N",
            creidt_limit: "0.000",
            creidt_amount_till: "0.000",
          },
          receiptdetails: [
            {
              amount: 0,
              card_check_number: null,
              card_type: null,
              expiry_date: null,
              hims_f_receipt_header_id: null,
              pay_type: "CA",
              updated_date: null,
            },
          ],
        };
        // console.log("insertData", insertData)
        let registrationResponse = undefined;
        if (!_patient_code || _patient_code === "") {
          registrationResponse = await axios
            .post(
              `http://localhost:3001/api/v1/frontDesk/add`,
              { ...insertData, ScreenCode: "BL0002" },
              {
                headers: {
                  "x-api-key": headers["x-api-key"],
                  "x-branch": headers["x-branch"],
                  "x-client-ip": headers["x-client-ip"],
                },
              }
            )
            .catch((error) => {
              throw error;
            });
        } else {
          registrationResponse = await axios
            .post(`http://localhost:3001/api/v1/frontDesk/update`, insertData, {
              headers: {
                "x-api-key": headers["x-api-key"],
                "x-branch": headers["x-branch"],
                "x-client-ip": headers["x-client-ip"],
              },
            })
            .catch((error) => {
              throw error;
            });
        }
        //For Billing ----
        const _primary_network_office_id =
          insuranceSub?.hims_d_insurance_network_office_id;
        const _primary_network_id = insuranceSub?.hims_d_insurance_network_id;
        const packageDetails = await _mysql
          .executeQuery({
            query: `select SI.services_id as hims_d_services_id,SI.insurance_id as primary_insurance_provider_id,
            IT.send_out_test,IT.hims_d_investigation_test_id as test_id,S.vat_applicable,IT.investigation_type as test_type
            from  portal_patient_package_detail as PPD inner join 
           hims_d_services_insurance as SI on SI.hims_d_services_insurance_id = PPD.package_detail_services_insurance_id
           inner join hims_d_investigation_test as IT on SI.services_id = IT.services_id 
           inner join hims_d_services as S on S.hims_d_services_id = SI.services_id
           where PPD.portal_package_id=?;`,
            values: [portal_package_id],
          })
          .catch((error) => {
            throw error;
          });
        const services = packageDetails.map((item) => {
          return {
            ...item,
            primary_network_office_id: _primary_network_office_id,
            primary_network_id: _primary_network_id,
            insured: "Y",
            vat_applicable:
              defaultsData?.default_nationality === nationality_id
                ? defaultsData?.vat_applicable
                : "Y",
            sec_insured: "N",
          };
        });
        const getBillDetails = await axios
          .post(
            `http://localhost:3014/api/v1/billing/getBillDetails`,
            services,
            {
              headers: {
                "x-api-key": headers["x-api-key"],
                "x-branch": headers["x-branch"],
                "x-client-ip": headers["x-client-ip"],
              },
            }
          )
          .catch((error) => {
            throw error;
          });
        const getBillDetailsData = getBillDetails.data?.records?.billdetails;
        //For Bill calculations

        const billingCalculations = await axios
          .post(
            `http://localhost:3014/api/v1/billing/billingCalculations`,
            { billdetails: getBillDetailsData },
            {
              headers: {
                "x-api-key": headers["x-api-key"],
                "x-branch": headers["x-branch"],
                "x-client-ip": headers["x-client-ip"],
              },
            }
          )
          .catch((error) => {
            throw error;
          });

        const billInput = {
          hims_d_patient_id:
            registrationResponse.data?.records.hims_d_patient_id,
          patient_id: registrationResponse.data?.records.hims_d_patient_id,
          patient_visit_id: registrationResponse.data?.records.patient_visit_id,
          visit_id: registrationResponse.data?.records.patient_visit_id,
          visit_code: registrationResponse.data?.records.visit_code,          
          primary_id_no: patient_identity,
          hospital_id:hospital_id,
          shift_id: shift.shift_id,
          billdetails: getBillDetailsData,
          incharge_or_provider: defaultsData?.default_doc_quick_reg,
          ScreenCode: "BL0001",
          billed: "Y",
          portal_exists:"Y",
          package_exists:[],
          receiptdetails: [
            {
              pay_type: "CA",
              amount: 0,
            },
          ],
        };

        // console.log("billInput", billInput)
        
        const billRepose = await axios
          .post(
            "http://localhost:3014/api/v1/opBilling/addOpBIlling",
            billInput,
            {
              headers: {
                "x-api-key": headers["x-api-key"],
                "x-branch": headers["x-branch"],
                "x-client-ip": headers["x-client-ip"],
              },
            }
          )
          .catch((error) => {
            throw error;
          });
          // consol.log("billInput", billInput)
          // console.log("billInput", billInput)
        //For Lab
        const getLabOrderedServices = await axios
          .get(
            `http://localhost:3013/api/v1/laboratory/getLabOrderedServices`,
            {
              params: {
                patient_id:
                  registrationResponse.data?.records.hims_d_patient_id,
                visit_id: registrationResponse.data?.records.patient_visit_id,
              },
              headers: {
                "x-api-key": headers["x-api-key"],
                "x-branch": headers["x-branch"],
                "x-client-ip": headers["x-client-ip"],
              },
            }
          )
          .catch((error) => {
            throw error;
          });

        const labOrders = getLabOrderedServices.data?.records.map((item) => {
          const {
            hims_f_lab_order_id,
            hims_d_lab_sample_id,
            order_id,
            sample_id,
            status,
            service_code,

            send_out_test,
            send_in_test,
            container_id,
          } = item;
          return {
            ...item,
            hims_f_lab_order_id,
            hims_d_lab_sample_id,
            visit_id: item.visit_id,
            order_id,
            service_id: item.service_id,
            sample_id,
            service_code,
            // status: status === "0" ? "N" : "Y",
            service_status: "SAMPLE COLLECTED",
            portal_exists: "Y",
            send_out_test,
            send_in_test,
            container_id,
            test_id: item.test_id,
            visit_code: item.visit_code,
            primary_id_no: item.primary_id_no,
            collected: "Y",
            status: "N",
            hims_d_hospital_id: hospital_id,
          };
        });

        const updateRecord = await axios
          .put(
            `http://localhost:3013/api/v1/laboratory/bulkSampleCollection`,
            { bulkCollection: labOrders, portal_exists: "Y" },
            {
              headers: {
                "x-api-key": headers["x-api-key"],
                "x-branch": headers["x-branch"],
                "x-client-ip": headers["x-client-ip"],
              },
            }
          )
          .catch((error) => {
            throw error;
          });
        // console.log("updateRecord===>", updateRecord.data);
        await _mysql
          .executeQuery({
            query: `update portal_patient_package_header set is_processed=1,bill_number=? where portal_package_id=?`,
            values: [billRepose.data?.records?.bill_number, portal_package_id],
          })
          .catch((error) => {
            throw error;
          });

        if (portalRecords.length - 1 === i) {
          _mysql.releaseConnection();
        }
      } catch (e) {
        // console.log("catch 2")
        if (portalRecords.length - 1 === i) {
          _mysql.releaseConnection();
          next(e);
        }
        console.error(
          `Error in billing @ ${new Date()} :==>`,
          e,
          JSON.stringify(portalRecords[i])
        );
      }
    }
    // console.log("3456")
    next();
  } catch (e) {
    // console.log("catch")
    _mysql.releaseConnection();
    next(e);
  }
}
