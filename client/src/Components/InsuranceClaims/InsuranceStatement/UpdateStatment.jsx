import React, { useContext, useState, useEffect } from "react";
import "./InsuranceStatement.scss";
import { useQuery, useMutation } from "react-query";
import {
  AlgaehLabel,
  AlgaehModal,
  AlgaehDataGrid,
  Spin,
  Tooltip,
  // AlgaehMessagePop,
  AlgaehFormGroup,
  MainContext,
  AlgaehAutoComplete,
} from "algaeh-react-components";
import { useForm, Controller } from "react-hook-form";
import { newAlgaehApi } from "../../../hooks";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { getDenialReasons } from "../DenialReasonMaster/DenialReasonMaster";

const updateStatement = async (input) => {
  const res = await newAlgaehApi({
    uri: "/insurance/updateInsuranceStatement",
    module: "insurance",
    data: input,
    method: "PUT",
  });
  return res.data;
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

export function UpdateStatement({
  show = false,
  data = {},
  onClose = () => { },
}) {
  const [currentRow, setCurrentRow] = useState(null);
  const [cpt_code, setCpt] = useState("");
  const { data: denialData, isLoading: denialLoading } = useQuery(
    "denial-reasons",
    getDenialReasons
  );
  const { userLanguage } = useContext(MainContext);
  const { data: invoiceDetails, isLoading: queryLoading, refetch } = useQuery(
    ["invoice-details", { invoice_header_id: data?.hims_f_invoice_header_id }],
    getStatementServices,
    {
      enabled: show,
      initialData: [],
      initialStale: true,
    }
  );

  const [update, { isLoading: mutLoading }] = useMutation(updateStatement, {
    onSuccess: () => {
      setCurrentRow(null);
      refetch();
    },
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    control,
    errors,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      remittance_amount: "",
      denial_amount: "",
      denial_reason_id: "",
    },
  });

  const { denial_amount } = watch();

  useEffect(() => {
    if (currentRow) {
      const step = data?.claim_status?.split("")[1];
      reset({
        remittance_amount: parseFloat(currentRow[`r${step}_amt`]),
        denial_amount: parseFloat(currentRow[`d${step}_amt`]),
        denial_reason_id: currentRow[`d${step}_reason_id`],
      });
      setCpt(currentRow?.cpt_code);
    } else {
      reset({
        remittance_amount: "",
        denial_amount: "",
        denial_reason_id: "",
      });
      setCpt("");
    }
    //eslint-disable-next-line
  }, [currentRow, data]);

  function cptSearch() {
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
        // setValue("cpt_code", data.cpt_code);
        setCpt(data?.cpt_code);
      },
    });
  }

  let columns = [
    {
      fieldName: "hims_f_invoice_details_id",
      label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
      displayTemplate: (row) => (
        <Tooltip title="Edit">
          <span onClick={() => setCurrentRow(row)}>
            <i className="fas fa-pen"></i>
          </span>
        </Tooltip>
      ),
    },
    {
      fieldName: "service_name",
      label: <AlgaehLabel label={{ forceLabel: "Service Name" }} />,
      editorTemplate: (row) => row.service_name,
    },
    {
      fieldName: "cpt_code",
      label: <AlgaehLabel label={{ forceLabel: "CPT code" }} />,
      displayTemplate: (row) => row?.cpt_code || "",
    },

    {
      fieldName: "company_resp",
      label: <AlgaehLabel label={{ forceLabel: "Co. Respo. Amt." }} />,
      editorTemplate: (row) => row.company_resp,
    },
    {
      fieldName: "company_tax",
      label: <AlgaehLabel label={{ forceLabel: "Co. Respo. Tax" }} />,
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
      label: <AlgaehLabel label={{ forceLabel: "Claim Amount" }} />,
    },
  ];

  // const inputColumns = (step) => [
  //   {
  //     fieldName: `r${step}_amt`,
  //     label: <AlgaehLabel label={{ forceLabel: "Remittance Amount" }} />,
  //     editorTemplate: (field, row, update) => (
  //       <input
  //         value={row?.remittance_amount}
  //         defaultValue={row[`r${step}_amt`]}
  //         onChange={(e) => {
  //           let { value } = e.target;
  //           if (value) {
  //             if (parseFloat(value) <= parseFloat(row?.company_payable)) {
  //               row.remittance_amount = value;
  //               row.denial_amount =
  //                 parseFloat(row.company_payable) - parseFloat(value);
  //               update(row);
  //             } else {
  //               AlgaehMessagePop({
  //                 type: "Warning",
  //                 display:
  //                   "Amount should be less than or equal to claim amount",
  //               });
  //             }
  //           } else {
  //             row.remittance_amount = "";
  //             row.denial_amount = "";
  //           }
  //         }}
  //       />
  //     ),
  //   },
  //   {
  //     fieldName: `d${step}_amt`,
  //     label: <AlgaehLabel label={{ forceLabel: "Denial Amount" }} />,
  //     editorTemplate: (row) => row.denial_amount || row[`d${step}_amt`],
  //   },
  //   {
  //     fieldName: `d${step}_reason_id`,
  //     label: <AlgaehLabel label={{ forceLabel: "Denial Reason" }} />,
  //     displayTemplate: (row) => {
  //       if (row[`d${step}_reason_id`]) {
  //         const [res] = denialData?.filter(
  //           (den) => den.hims_d_denial_id == row[`d${step}_reason_id`]
  //         );
  //         return res?.denial_desc;
  //       } else {
  //         return null;
  //       }
  //     },
  //     editorTemplate: (field, row, update) => (
  //
  //     ),
  //   },
  // ];

  const displayColumns = (step) => [
    {
      fieldName: `r${step}_amt`,
      label: <AlgaehLabel label={{ forceLabel: `Remittance ${step}` }} />,
      editorTemplate: (row) => row[`r${step}_amt`],
    },
    {
      fieldName: `d${step}_amt`,
      label: <AlgaehLabel label={{ forceLabel: `Denial ${step}` }} />,
      editorTemplate: (row) => row[`d${step}_amt`],
    },
    {
      fieldName: `d${step}_reason_id`,
      label: <AlgaehLabel label={{ forceLabel: `Reason ${step}` }} />,

      displayTemplate: (row) => {
        if (row[`d${step}_reason_id`]) {
          const [res] = denialData?.filter(
            (den) => den.hims_d_denial_id == row[`d${step}_reason_id`]
          );
          return res?.denial_desc;
        } else {
          return null;
        }
      },
      editorTemplate: (row) => {
        if (row[`d${step}_reason_id`]) {
          const [res] = denialData?.filter(
            (den) => den.hims_d_denial_id == row[`d${step}_reason_id`]
          );
          return res?.denial_desc;
        } else {
          return null;
        }
      },
    },
  ];

  const step = data?.claim_status?.split("")[1];

  if (step == 1) {
    columns.push(...displayColumns(1));
  }

  if (step == 2) {
    columns.push(...displayColumns(1));
    columns.push(...displayColumns(2));
  }

  if (step == 3) {
    columns.push(...displayColumns(1));
    columns.push(...displayColumns(2));
    columns.push(...displayColumns(3));
  }

  const onUpdate = (e) => {
    update({
      insurance_statement_id: data?.insurance_statement_id,
      invoice_header_id: data?.hims_f_invoice_header_id,
      invoice_detail_id: currentRow?.hims_f_invoice_details_id,
      remittance_amount: e.remittance_amount,
      denial_amount: e.denial_amount,
      denial_reason_id: e.denial_reason_id,
      cpt_code: cpt_code || "",
      claim_status: data?.claim_status?.replace("S", "R"),
    });
  };

  return (
    <AlgaehModal
      title="Update Statment"
      visible={show}
      maskClosable={false}
      width={1200}
      closable={true}
      footer={[
        <button className="btn btn-default" onClick={() => onClose(true)}>
          Close
        </button>,
      ]}
      onCancel={() => onClose(true)}
      // onOk={handleSubmit(onSubmit)}
      className={`${userLanguage}_comp row algaehNewModal UpdateStatementModal`}
    >
      <AlgaehModal
        title="Update Service"
        visible={!!currentRow}
        maskClosable={false}
        width={540}
        closable={true}
        okButtonProps={{
          loading: mutLoading,
          className: "btn btn-primary",
        }}
        cancelButtonProps={{
          loading: mutLoading,
          className: "btn btn-default",
        }}
        onOk={handleSubmit(onUpdate)}
        onCancel={() => setCurrentRow(null)}
        // onOk={handleSubmit(onSubmit)}
        className={`${userLanguage}_comp row algaehNewModal UpdateStatementModal`}
      >
        <div className="col-12 popupInner margin-top-15">
          <div className="row">
            <div className="col-6">
              <div className="row">
                <div className="col globalSearchCntr">
                  {" "}
                  <AlgaehLabel label={{ forceLabel: "Enter CPT Code" }} />
                  <h6 onClick={cptSearch}>
                    {cpt_code ?? "CPT Code"}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>
              </div>
            </div>
            <Controller
              control={control}
              name="remittance_amount"
              rules={{ required: true }}
              render={({ value, onChange }) => (
                <AlgaehFormGroup
                  div={{ className: "col-6 mandatory" }}
                  label={{
                    forceLabel: "Remittance Amount",
                    isImp: true,
                  }}
                  error={errors}
                  textBox={{
                    value,
                    onChange: (e) => {
                      let { value } = e.target;

                      if (value) {
                        if (
                          parseFloat(value) <=
                          parseFloat(currentRow?.company_payable)
                        ) {
                          onChange(value);
                          const denial_amount =
                            parseFloat(currentRow?.company_payable) - parseFloat(currentRow?.r1_amt) - parseFloat(currentRow?.r2_amt) -
                            parseFloat(value);
                          setValue("denial_amount", denial_amount, {
                            shouldValidate: true,
                          });
                          clearErrors();
                        } else {
                          setError("remittance_amount", {
                            type: "manual",
                            message:
                              "Remittance Should be less than or equal to claim amount",
                          });
                        }
                      } else {
                        onChange("");
                        setValue("denial_amount", "");
                      }
                    },
                    className: "txt-fld",
                    name: "remittance_amount",
                    placeholder: "0.00",
                    tabIndex: "2",
                  }}
                />
              )}
            />
            <Controller
              control={control}
              rules={{ required: true }}
              name="denial_amount"
              render={({ value }) => (
                <AlgaehFormGroup
                  div={{ className: "col-6 mandatory" }}
                  label={{
                    forceLabel: "Denial Amount",
                    isImp: true,
                  }}
                  error={errors}
                  textBox={{
                    value,
                    disabled: true,
                    className: "txt-fld",
                    name: "remittance_amount",
                    placeholder: "0.00",
                    tabIndex: "2",
                  }}
                />
              )}
            />

            <Controller
              control={control}
              rules={{ required: !!denial_amount }}
              name="denial_reason_id"
              render={({ value, onChange }) => (
                <AlgaehAutoComplete
                  div={{ className: "col-6" }}
                  label={{
                    forceLabel: "Denial Reason",
                    isImp: !!denial_amount,
                  }}
                  selector={{
                    name: "denial_reason_id",
                    className: "select-fld",
                    placeholder: "Select Reason",
                    others: {
                      disabled: !denial_amount,
                    },
                    dataSource: {
                      textField: "denial_desc",
                      valueField: "hims_d_denial_id",
                      data: denialData ?? [],
                    },
                    value,
                    onChange: (_, selected) => {
                      onChange(selected);
                    },
                    onClear: () => onChange(""),
                  }}
                />
              )}
            />
          </div>
        </div>
      </AlgaehModal>
      <Spin spinning={queryLoading || mutLoading || denialLoading}>
        <div className="col-12 popupInner margin-top-15">
          <div className="row">
            <div className="col-4">
              <AlgaehLabel
                label={{
                  forceLabel: "Patient Name",
                }}
              />
              <h6>{data?.pat_name}</h6>
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
                  forceLabel: "Invoice Number",
                }}
              />
              <h6>{data?.invoice_number}</h6>
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

          <div className="row">
            <div className="col-12">
              <div className="portlet-body" id="PreRequestGrid">
                <AlgaehDataGrid
                  className="UpdateInsuranceStatementGrid"
                  id="InsuranceStatementGrid"
                  columns={columns}
                  data={invoiceDetails ?? []}
                  // filter={true}

                  paging={{ page: 0, rowsPerPage: 20 }}
                  // events={{
                  //   onSave: (row) => {
                  //     update({
                  //       insurance_statement_id: data?.insurance_statement_id,
                  //       invoice_header_id: data?.hims_f_invoice_header_id,
                  //       invoice_detail_id: row?.hims_f_invoice_details_id,
                  //       remittance_amount: row.remittance_amount,
                  //       denial_amount: row.denial_amount,
                  //       denial_reason_id: row.denial_reason_id,
                  //       cpt_code: row.cpt_code,
                  //       claim_status: data?.claim_status?.replace("S", "R"),
                  //     });
                  //   },
                  // }}
                  rowUniqueId={"hims_f_invoice_details_id"}
                />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </AlgaehModal>
  );
}
