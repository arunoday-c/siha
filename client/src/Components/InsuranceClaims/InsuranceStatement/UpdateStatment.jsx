import React, { useContext, useState } from "react";
import "./InsuranceStatement.scss";
import { useQuery, useMutation } from "react-query";
import {
  AlgaehLabel,
  AlgaehModal,
  AlgaehDataGrid,
  Spin,
  AlgaehMessagePop,
  // AlgaehFormGroup,
  MainContext,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";

// const updateStatement = async (input) => {
//   const res = await newAlgaehApi({
//     uri: "/insurance/updateInsuranceStatement",
//     module: "insurance",
//     data: input,
//     method: "PUT",
//   });
//   return res.data;
// };

const addICD = async (data) => {
  const res = await newAlgaehApi({
    uri: "/invoiceGeneration/addInvoiceIcd",
    data: {
      invoice_header_id: data?.hims_f_invoice_header_id,
      patient_id: data?.patient_id,
      episode_id: data?.episode_id,
      daignosis_id: data?.hims_d_icd_id,
      diagnosis_type: "P",
      final_daignosis: "Y",
    },
    method: "POST",
    module: "insurance",
  });
  return res.data?.records;
};

const deleteICD = async (data) => {
  const res = await newAlgaehApi({
    uri: "/invoiceGeneration/deleteInvoiceIcd",
    data: {
      hims_f_invoice_icd_id: data?.hims_f_invoice_icd_id,
    },
    module: "insurance",
    method: "DELETE",
  });
  return res.data?.records;
};

const getStatementServices = async (key, { invoice_header_id }) => {
  const res = await newAlgaehApi({
    uri: "/insurance/getInvoiceDetails",
    module: "insurance",
    data: { invoice_header_id },
    method: "GET",
  });
  return res.data?.records;
};

const getICDcodes = async (key, { invoice_header_id }) => {
  const res = await newAlgaehApi({
    uri: "/invoiceGeneration/getPatientIcdForInvoice",
    module: "insurance",
    data: { invoice_header_id },
    method: "GET",
  });
  return res.data?.records;
};

export function UpdateStatement({
  show = false,
  data = {},
  onClose = () => {},
}) {
  const { userLanguage } = useContext(MainContext);
  const [icd, setIcd] = useState(null);
  const { data: invoiceDetails, isLoading: queryLoading } = useQuery(
    ["invoice-details", { invoice_header_id: data?.hims_f_invoice_header_id }],
    getStatementServices,
    {
      enabled: show,
      initialData: [],
      initialStale: true,
    }
  );
  const { data: icdCodes, isLoading: icdLoading, refetch } = useQuery(
    ["icd-codes", { invoice_header_id: data?.hims_f_invoice_header_id }],
    getICDcodes,
    {
      enabled: show,
      initialData: [],
      initialStale: true,
    }
  );

  const [addICDtoInvoice, { isLoading: mutLoading }] = useMutation(addICD, {
    onSuccess: () => {
      refetch();
      setIcd(null);
    },
  });

  const [deleteICDtoInvoice] = useMutation(deleteICD, {
    onSuccess: () => {
      refetch();
    },
  });

  // const [update, { isLoading }] = useMutation(updateStatement, {
  //   onSuccess: (data) => {
  //     if (data?.success) {
  //       onClose(true);
  //     }
  //   },
  // });

  function cptSearch(row, update) {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Services.CptCodes,
      },
      searchName: "CptCodes",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (data) => {
        row["cpt_code"] = data.cpt_code;
        update(row);
        // row.update();
      },
    });
  }

  function icdSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Diagnosis.IcdCodes,
      },
      searchName: "IcdCodes",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        setIcd({
          icd_code: row.icd_code,
          hims_d_icd_id: row.hims_d_icd_id,
        });
      },
    });
  }

  return (
    <AlgaehModal
      title="Update Statment"
      visible={show}
      okButtonProps={{
        // loading: isLoading,
        className: "btn btn-primary",
      }}
      okText={"Update"}
      maskClosable={false}
      cancelButtonProps={{
        // disabled: isLoading,
        className: "btn btn-default",
      }}
      width={1200}
      closable={false}
      onCancel={() => onClose(false)}
      // onOk={handleSubmit(onSubmit)}
      className={`${userLanguage}_comp row algaehNewModal UpdateStatementModal`}
    >
      <Spin spinning={queryLoading || icdLoading || mutLoading}>
        <div className="col-12 popupInner margin-top-15">
          <div className="row">
            <div className="col-12">
              <AlgaehLabel
                label={{
                  forceLabel: "Patient Name",
                }}
              />
              <h6>{data?.pat_name}</h6>
            </div>
            <div className="col-6">
              <AlgaehLabel
                label={{
                  forceLabel: "Patient Code",
                }}
              />
              <h6>{data?.patient_code}</h6>
            </div>
            <div className="col-6">
              <AlgaehLabel
                label={{
                  forceLabel: "Invoice Number",
                }}
              />
              <h6>{data?.invoice_number}</h6>
            </div>

            <div className="col-6">
              <AlgaehLabel
                label={{
                  forceLabel: "Invoice Date",
                }}
              />
              <h6>{data?.invoice_date}</h6>
            </div>

            <div className="col-6">
              <AlgaehLabel
                label={{
                  forceLabel: "Net Company Payable",
                }}
              />
              <h6>{data?.company_payable}</h6>
            </div>
          </div>

          <div className="row">
            <div className="col-8">
              <div className="portlet-body" id="PreRequestGrid">
                <AlgaehDataGrid
                  className="InsuranceStatementGrid"
                  id="InsuranceStatementGrid"
                  columns={[
                    // {
                    //   fieldName: "hims_f_invoice_details_id",
                    //   label: "Action",
                    //   displayTemplate: () => ,
                    // },
                    {
                      fieldName: "service_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Service Name" }} />
                      ),
                      editorTemplate: (row) => row.service_name,
                    },
                    {
                      fieldName: "cpt_code",
                      label: <AlgaehLabel label={{ forceLabel: "CPT code" }} />,
                      editorTemplate: (field, row, update) => {
                        return (
                          <div className="row">
                            <div className="col globalSearchCntr noLabel">
                              <h6 onClick={() => cptSearch(row, update)}>
                                {field ?? "CPT Code"}
                                <i className="fas fa-search fa-lg"></i>
                              </h6>
                            </div>
                          </div>
                        );
                      },
                    },

                    {
                      fieldName: "company_resp",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Co. Respo. Amt." }}
                        />
                      ),
                      editorTemplate: (row) => row.company_resp,
                    },
                    {
                      fieldName: "company_tax",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Co. Respo. Tax" }} />
                      ),
                      editorTemplate: (row) => row.company_tax,
                      disabled: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "left" },
                      },
                    },
                    {
                      fieldName: "company_payable",
                      editorTemplate: (row) => row.company_payable,
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Claim Amount" }} />
                      ),
                    },
                    {
                      fieldName: "remittance_amount",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Remittance Amount" }}
                        />
                      ),
                      editorTemplate: (field, row, update) => (
                        <input
                          value={row?.remittance_amount}
                          onChange={(e) => {
                            let { value } = e.target;
                            if (
                              parseFloat(value) <=
                              parseFloat(row?.company_payable)
                            ) {
                              row.remittance_amount = value;
                              row.denial_amount =
                                parseFloat(row.company_payable) -
                                parseFloat(value);
                              update(row);
                            } else {
                              AlgaehMessagePop({
                                type: "Warning",
                                display:
                                  "Amount should be less than or equal to claim amount",
                              });
                            }
                          }}
                        />
                      ),
                    },
                    {
                      fieldName: "denial_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Denial Amount" }} />
                      ),
                      editorTemplate: (row) => row.denial_amount,
                    },
                  ]}
                  data={invoiceDetails ?? []}
                  // filter={true}
                  isEditable="editOnly"
                  paging={{ page: 0, rowsPerPage: 20 }}
                  events={{
                    onSave: (data) => {
                      debugger;
                      console.log(data, "data");
                    },
                  }}
                  rowUniqueId={"hims_f_invoice_details_id"}
                />
              </div>
            </div>
            <div className="col-4">
              <div className="row">
                <div className="col globalSearchCntr">
                  <AlgaehLabel label={{ forceLabel: "Search ICD Code" }} />
                  <h6 onClick={icdSearch}>
                    {icd?.icd_code ?? "Search ICD Code"}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>
                <div className="col-3">
                  <button
                    onClick={() => addICDtoInvoice({ ...data, ...icd })}
                    disabled={mutLoading || !icd}
                    className="btn btn-primary margin-top-15"
                    style={{ marginTop: 21 }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <AlgaehDataGrid
                className="InsuranceStatementGrid"
                id="InsuranceStatementGrid"
                columns={[
                  {
                    fieldName: "icd_type",
                    label: <AlgaehLabel label={{ forceLabel: "Type" }} />,
                    others: {
                      maxWidth: "1rem",
                    },
                  },
                  {
                    fieldName: "icd_code",
                    label: <AlgaehLabel label={{ forceLabel: "Code" }} />,
                  },
                  {
                    fieldName: "icd_description",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Description" }} />
                    ),
                  },
                ]}
                data={icdCodes ?? []}
                // filter={true}
                isEditable="deleteOnly"
                paging={{ page: 0, rowsPerPage: 20 }}
                events={{
                  onDelete: (row) => {
                    debugger;
                    console.log(row);
                    deleteICDtoInvoice(row);
                  },
                }}
              />
            </div>
          </div>
        </div>
      </Spin>
    </AlgaehModal>
  );
}
