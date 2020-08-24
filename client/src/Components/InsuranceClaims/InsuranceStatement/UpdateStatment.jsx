import React, { useContext } from "react";
import "./InsuranceStatement.scss";
// import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import {
  AlgaehLabel,
  AlgaehModal,
  AlgaehDataGrid,
  Spin,
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
  // const { control, handleSubmit, reset, errors, setError } = useForm();
  const { userLanguage } = useContext(MainContext);

  const { data: invoiceDetails, isLoading: queryLoading } = useQuery(
    ["invoice-details", { invoice_header_id: data?.hims_f_invoice_header_id }],
    getStatementServices,
    {
      enabled: show,
      initialData: [],
      initialStale: true,
    }
  );
  const { data: icdCodes, isLoading: icdLoading } = useQuery(
    ["icd-codes", { invoice_header_id: data?.hims_f_invoice_header_id }],
    getICDcodes,
    {
      enabled: show,
      initialData: [],
      initialStale: true,
    }
  );

  // const [update, { isLoading }] = useMutation(updateStatement, {
  //   onSuccess: (data) => {
  //     if (data?.success) {
  //       onClose(true);
  //     }
  //   },
  // });

  // useEffect(() => {
  //   if (!show) {
  //     reset({
  //       remittance_ammount: "",
  //       denial_ammount: "",
  //     });
  //   }

  //   if (show && !!data) {
  //     reset({
  //       remittance_ammount: data?.remittance_ammount,
  //       denial_ammount: data?.denial_ammount,
  //     });
  //   }
  //   // eslint-disable-next-line
  // }, [show, data]);

  function cptSearch(row, e) {
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
        // this.setState({
        //   cpt_code: row.hims_d_cpt_code_id,
        //   cpt_code_data: row.cpt_code
        // });

        row["cpt_code"] = data.cpt_code;
        // row.update();
      },
    });
  }

  // const onSubmit = (e) => {
  //   const total =
  //     parseFloat(e.remittance_ammount) + parseFloat(e.denial_ammount);
  //   if (total <= parseFloat(data?.company_payable)) {
  //     update({
  //       ...e,
  //       hims_f_invoice_header_id: data?.hims_f_invoice_header_id,
  //       insurance_statement_id: data?.insurance_statement_id,
  //     });
  //   } else {
  //     setError("remittance_ammount", {
  //       type: "manual",
  //       message: "Entered amounts should be less than net payable",
  //     });
  //     setError("denial_ammount", {
  //       type: "manual",
  //       message: "Entered amounts should be less than net payable",
  //     });
  //     // AlgaehMessagePop({
  //     //   display: "Entered amounts should be less than net payable",
  //     //   type: "success",
  //     // });
  //   }
  // };

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
      <Spin spinning={queryLoading || icdLoading}>
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
          {/* <hr></hr>
          <div className="row">
            <Controller
              control={control}
              name="remittance_ammount"
              rules={{
                required: {
                  message: "Field is Required",
                  value: true,
                },
              }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{
                    className: "col-6 form-group  mandatory",
                  }}
                  error={errors}
                  label={{
                    forceLabel: "Remittance Amount",
                    isImp: true,
                  }}
                  textBox={{
                    name: "remittance_ammount",
                    type: "number",
                    className: "form-control",
                    ...props,
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="denial_ammount"
              rules={{
                required: {
                  message: "Field is Required",
                  value: true,
                },
              }}
              render={(props) => (
                <AlgaehFormGroup
                  div={{
                    className: "col-6 form-group  mandatory",
                  }}
                  label={{
                    forceLabel: "Denial Amount",
                    isImp: true,
                  }}
                  error={errors}
                  textBox={{
                    name: "denial_ammount",
                    type: "number",
                    className: "form-control",
                    ...props,
                  }}
                />
              )}
            />
            <div className="col-1" style={{ paddingRight: 0, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-primary btn-rounded"
                onClick={cptSearch}
                disabled={false}
              >
                <i className="fas fa-plus" />
              </button>
            </div>
            <AlgaehFormGroup
              div={{
                className: "col-5 form-group  mandatory",
              }}
              label={{
                forceLabel: "CPT code",
                isImp: false,
              }}
              textBox={{
                name: "cpt_code",
                className: "form-control",
                value: "",
              }}
            />
          </div> */}
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
                      editorTemplate: (row) => {
                        return (
                          <div className="row">
                            <div className="col globalSearchCntr noLabel">
                              <h6 onClick={() => cptSearch(row)}>
                                {row.cpt_code ? row.cpt_code : "CPT Code"}
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
                      fieldName: "remittance_ammount",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Remittance Amt. 1" }}
                        />
                      ),
                      editorTemplate: (row) => (
                        <input
                          value={row?.remittance_ammount}
                          onChange={(e) => {
                            row.remittance_ammount = e.target.value;
                          }}
                        />
                      ),
                    },
                    {
                      fieldName: "denial_ammount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Denial Amt. 1" }} />
                      ),
                      editorTemplate: (row) => (
                        <input
                          value={row?.denial_ammount}
                          onChange={(e) => {
                            row.denial_ammount = e.target.value;
                          }}
                        />
                      ),
                    },
                    // {
                    //   fieldName: "remittance_2",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Remittance Amt. 2" }} />
                    //   ),
                    // },
                    // {
                    //   fieldName: "denial_amount_2",
                    //   label: <AlgaehLabel label={{ forceLabel: "Denial Amt. 2" }} />,
                    // },
                    // {
                    //   fieldName: "remittance_ammount",
                    //   label: (
                    //     <AlgaehLabel
                    //       label={{ forceLabel: "Total Remittance Amount" }}
                    //     />
                    //   ),
                    // },
                    // {
                    //   fieldName: "denial_ammount",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Total Denial Amount" }} />
                    //   ),
                    // },
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
                />
              </div>
            </div>
            <div className="col-4">
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

                paging={{ page: 0, rowsPerPage: 20 }}
              />
            </div>
          </div>
        </div>
      </Spin>
    </AlgaehModal>
  );
}
