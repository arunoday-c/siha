import React, { useContext, useState, useEffect } from "react";
import "./InvoiceGeneration.scss";
import { useMutation } from "react-query";
import {
  AlgaehLabel,
  AlgaehModal,
  Spin,
  // AlgaehFormGroup,
  MainContext,

  // AlgaehAutoComplete,
  // AlgaehDateHandler,
} from "algaeh-react-components";
// import { useForm } from "react-hook-form";
import { newAlgaehApi } from "../../../hooks";
import AlgaehSearch from "../../Wrapper/globalSearch";
import InsuranceFields from "../../../Search/Insurance.json";
import { swalMessage } from "../../../utils/algaehApiCall";

const changeInvoiceDetails = async (input) => {
  debugger;
  const res = await newAlgaehApi({
    uri: "/insurance/ChangeOfInsuranceInvoice",
    module: "insurance",
    data: input,
    method: "PUT",
  });
  return res.data;
};

export function ChangeInvoiceDetails({
  show = false,
  data = data,
  onClose = () => {},
  component = false,
  // selected_visit = null,
}) {
  debugger;
  // const [isInsurance, setIsInsurance] = useState(false);
  // const [insuranceList, setInsuranceList] = useState([]);
  const [insuranceData, setInsuranceData] = useState({});

  // const { setValue, reset } = useForm({
  //   defaultValues: {
  //     insurance_provider_id: "",
  //     sub_insurance_id: "",
  //     network_id: "",
  //     network_office_id: "",
  //     policy_number: "",
  //   },
  // });
  const { userLanguage, userToken } = useContext(MainContext);
  const { default_nationality, local_vat_applicable } = userToken;

  const [change, { isLoading: mutLoading }] = useMutation(
    changeInvoiceDetails,
    {
      onSuccess: () => {
        onClose(true);
      },
    }
  );

  useEffect(() => {
    debugger;
    if (data) {
      const ins = data;
      // setIsInsurance(true);
      setInsuranceData({
        insurance_provider_name: ins?.insurance_provider_name,
        insurance_sub_name: ins?.sub_insurance_provider_name,
        network_type: ins?.network_type,
        policy_number: ins?.policy_number,
        insurance_provider_id: ins?.insurance_provider_id,
        sub_insurance_id: ins?.sub_insurance_id,
        network_id: ins?.network_id,
        network_office_id: ins?.network_office_id,
        insured: "Y",
      });
    } else {
      // setIsInsurance(false);
      setInsuranceData({});
    }
  }, [data]);

  const onChange = (e) => {
    debugger;
    if (
      insuranceData.insurance_provider_id === data?.insurance_provider_id &&
      insuranceData.sub_insurance_id === data?.sub_insurance_id &&
      insuranceData.network_id === data?.network_id &&
      insuranceData.network_office_id === data?.network_office_id &&
      insuranceData.policy_number === data?.policy_number
    ) {
      swalMessage({
        title: "No Chnages in the insurance data.",
        type: "warning",
      });
      return;
    }
    change({
      hims_f_invoice_header_id: data?.hims_f_invoice_header_id,
      insured: "Y",
      insurance_provider_id: insuranceData.insurance_provider_id,
      sub_insurance_id: insuranceData.sub_insurance_id,
      network_id: insuranceData.network_id,
      network_office_id: insuranceData.network_office_id,
      policy_number: insuranceData.policy_number,
      vat_applicable:
        default_nationality === data.nationality_id
          ? local_vat_applicable
          : "Y",
    });
  };

  // useEffect(() => {
  //   if (selected_visit === null) {
  //     // setInsuranceList([]);
  //     reset({
  //       insurance_provider_id: "",
  //       sub_insurance_id: "",
  //       network_id: "",
  //       network_office_id: "",
  //       policy_number: "",
  //     });
  //   }
  // }, [selected_visit]);
  // const disabled = !isInsurance;
  // const dropDownData = insuranceList?.length ? insuranceList : [];

  const AddInsurance = () => {
    AlgaehSearch({
      searchGrid: {
        columns: InsuranceFields,
      },
      searchName: "new_insurance",
      uri: "/gloabelSearch/get",
      inputs: `netoff.hospital_id =  ${userToken?.hims_d_hospital_id}`,
      onContainsChange: (text, serchBy, callback) => {
        callback(text);
      },
      onRowSelect: (row) => {
        // setInsuranceList([row]);
        debugger;
        // setValue("insurance_provider_id", row?.insurance_provider_id);
        // setValue("sub_insurance_id", row?.sub_insurance_provider_id);
        // setValue("network_id", row?.network_id);
        // setValue("network_office_id", row?.hims_d_insurance_network_office_id);
        // setValue("policy_number", row?.policy_number);

        row.sub_insurance_id = row?.sub_insurance_provider_id;
        row.network_office_id = row?.hims_d_insurance_network_office_id;
        setInsuranceData(row);
      },
    });
  };

  //   const InsuranceChage = (e) => {
  //     setIsInsurance(e.target.value === "true" ? true : false);

  //     reset({
  //       insurance_provider_id: "",
  //       sub_insurance_id: "",
  //       network_id: "",
  //       network_office_id: "",
  //       policy_number: "",
  //       primary_effective_start_date: "",
  //       primary_effective_end_date: "",
  //       primary_card_number: "",
  //     });
  //   };

  const MainChildren = (
    <>
      {/* spinning={queryLoading || mutLoading || denialLoading} */}
      <Spin spinning={mutLoading}>
        <div className="col-12 popupInner margin-top-15">
          {!component && (
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Invoice Number",
                  }}
                />
                <h6>{data?.invoice_number}</h6>
              </div>
              <div className="col-4">
                <AlgaehLabel
                  label={{
                    forceLabel: "Patient Name",
                  }}
                />
                <h6>{data?.full_name}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Patient Code",
                  }}
                />
                <h6>{data?.patient_code}</h6>
              </div>

              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Invoice Date",
                  }}
                />
                <h6>{data?.invoice_date}</h6>
              </div>

              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Net Company Payable",
                  }}
                />
                <h6>{data?.company_payable}</h6>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-12">
              <div className="portlet-body" id="PreRequestGrid">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-12 insurance-sec">
                      <h6 style={{ marginTop: 10 }}>Insurance Details</h6>
                      <div className="row">
                        {/* <div className="col-lg-2 insuranceRadio">
                          <AlgaehLabel
                            label={{
                              fieldName: "lbl_insurance",
                            }}
                          />
                          <br />

                          <div className="customRadio">
                            <label className="radio inline">
                              <input
                                type="radio"
                                value="false"
                                checked={!isInsurance}
                                onChange={InsuranceChage}
                              />
                              <span>Cash</span>
                            </label>
                            <label className="radio inline">
                              <input
                                type="radio"
                                value="true"
                                checked={isInsurance}
                                onChange={InsuranceChage}
                              />
                              <span>Insurance</span>
                            </label>
                          </div>
                        </div> */}

                        <div
                          className="col-1"
                          style={{ paddingRight: 0, marginTop: 20 }}
                        >
                          <button
                            type="button"
                            className="btn btn-primary btn-rounded"
                            onClick={AddInsurance}
                            // disabled={!isInsurance}
                          >
                            <i className="fas fa-plus" />
                          </button>
                        </div>
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "insurance company",
                            }}
                          />
                          <h6>
                            {insuranceData?.insurance_provider_name ?? "---"}
                          </h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "sub insurance company",
                            }}
                          />
                          <h6>{insuranceData?.insurance_sub_name ?? "---"}</h6>
                        </div>
                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "plan desc",
                            }}
                          />
                          <h6>{insuranceData?.network_type ?? "---"}</h6>
                        </div>

                        <div className="col-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "policy no.",
                            }}
                          />
                          <h6>{insuranceData?.policy_number ?? "---"}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );

  if (component) {
    return <>{MainChildren}</>;
  } else {
    return (
      <AlgaehModal
        title="Change Invoice Insurance Details"
        visible={show}
        maskClosable={false}
        width={1200}
        closable={true}
        footer={[
          <button className="btn btn-primary" onClick={() => onChange(true)}>
            Change
          </button>,
          <button className="btn btn-default" onClick={() => onClose(true)}>
            Close
          </button>,
        ]}
        // onOk={handleSubmit(onSubmit)}
        className={`${userLanguage}_comp row algaehNewModal UpdateStatementModal`}
      >
        {MainChildren}
      </AlgaehModal>
    );
  }
}
