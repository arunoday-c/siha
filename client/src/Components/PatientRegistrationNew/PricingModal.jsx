import React, { useContext, useEffect, useState } from "react";
import "./PatientRegistrationStyle.scss";
import {
  AlgaehModal,
  MainContext,
  //   AlgaehLabel,
  AlgaehDataGrid,
  // Modal,
  // Upload,
  Spin,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../hooks";
import InsuranceFields from "../../Search/Insurance.json";
// import { useForm, Controller } from "react-hook-form";
// import { swalMessage } from "../../utils/algaehApiCall";
import AlgaehSearch from "../Wrapper/globalSearch";
// const { confirm } = Modal;

export function PricingModals({ visible, onClose }) {
  const { userLanguage, userToken } = useContext(MainContext);
  const [fileList, setFileList] = useState([]);
  const [isInsurance, setIsInsurance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [insuranceCompany, setInsuranceCompany] = useState([]);
  // const { control } = useForm();
  useEffect(() => {
    getServices();
  }, [visible]);

  const getServices = () => {
    setLoading(true);

    newAlgaehApi({
      uri: "/serviceType/getService",
      module: "masterSettings",
      method: "GET",
    })
      .then((result) => {
        setLoading(false);
        setFileList(result.data.records);
      })
      .catch((e) => console.log(e));
  };

  const getInsurancePriceList = (row) => {
    setLoading(true);

    newAlgaehApi({
      uri: "/insurance/getPriceList",
      module: "insurance",
      method: "GET",
      data: { insurance_id: row[0].insurance_provider_id },
    })
      .then((result) => {
        setLoading(false);
        setInsuranceCompany(result.data.records);
      })
      .catch((e) => console.log(e));
  };

  const selectInsurance = () => {
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
        setCompanyName(row.insurance_provider_name);
        getInsurancePriceList([row]);
      },
    });
  };

  return (
    <div className="hptl-phase1-op-display-billing-form">
      <AlgaehModal
        title={"Pricing Modal"}
        visible={visible}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        // onOk={onClose}
        footer={[<button onClick={onClose}>Cancel</button>]}
        className={`${userLanguage}_comp row algaehNewModal`}
      >
        <Spin spinning={loading}>
          <div className="customCheckbox">
            <label className="checkbox block">
              <input
                type="checkbox"
                name="is_insurance"
                checked={isInsurance}
                onChange={(e) => {
                  e.target.checked
                    ? setIsInsurance(true)
                    : setIsInsurance(false);
                }}
              />
              <span>Insurance Company</span>
            </label>
          </div>
          {isInsurance ? (
            <>
              <div className="col-1">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={selectInsurance}
                  // disabled={!isInsurance}
                >
                  Select Insurance Company
                </button>
              </div>
              <div className="row">
                <span>
                  Selected Company Name: <b>{companyName}</b>
                </span>
              </div>
            </>
          ) : null}

          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Pricing List</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              {isInsurance === false ? (
                <AlgaehDataGrid
                  className="PricingList"
                  columns={[
                    {
                      fieldName: "service_code",
                      label: "Service Code",
                      filterable: true,
                      sortable: true,
                    },
                    {
                      fieldName: "service_name",
                      label: "Service Name",
                      sortable: true,
                      filterable: true,
                    },

                    {
                      fieldName: "standard_fee",
                      label: "Service Fee",
                      sortable: true,
                      filterable: true,
                    },
                  ]}
                  loading={false}
                  // isEditable="onlyDelete"
                  pagination={true}
                  isFilterable={true}
                  height="34vh"
                  data={fileList ? fileList : []}
                  rowUnique="prePayDesc"
                  events={{}}
                  others={{}}
                />
              ) : (
                <AlgaehDataGrid
                  className="PricingListInsurance"
                  columns={[
                    {
                      fieldName: "service_code",
                      label: "Service Code",
                      sortable: true,
                      filterable: true,
                    },
                    {
                      fieldName: "service_name",
                      label: "Service Name",
                      sortable: true,
                      filterable: true,
                    },
                    {
                      fieldName: "insurance_service_name",
                      label: "service Description",
                      sortable: true,
                      filterable: true,
                    },
                    {
                      fieldName: "pre_approval",
                      label: "Pre Approval",
                      sortable: true,
                      filterable: true,
                      displayTemplate: (row) => {
                        return row.pre_approval === "Y" ? "Yes" : "No";
                      },
                    },
                    {
                      fieldName: "covered",
                      label: "Insurance Covered",
                      sortable: true,
                      filterable: true,
                      displayTemplate: (row) => {
                        return row.covered === "Y" ? "Yes" : "No";
                      },
                    },

                    {
                      fieldName: "net_amount",
                      label: "Net Amount",
                      sortable: true,
                      filterable: true,
                    },
                  ]}
                  loading={false}
                  // isEditable="onlyDelete"
                  height="34vh"
                  pagination={true}
                  isFilterable={true}
                  data={insuranceCompany ? insuranceCompany : []}
                  rowUnique="prePayDesc"
                  events={{}}
                  others={{}}
                />
              )}
            </div>
          </div>
        </Spin>
        {/* </div> */}
      </AlgaehModal>
    </div>
  );
}
