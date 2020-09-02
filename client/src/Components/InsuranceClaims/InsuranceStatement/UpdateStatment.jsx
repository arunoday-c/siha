import React, { useContext } from "react";
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
  AlgaehAutoComplete,
} from "algaeh-react-components";
import { newAlgaehApi } from "../../../hooks";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { getDenialReasons } from "../DenialReasonMaster/DenialReasonMaster";

const updateStatement = async (input) => {
  debugger;
  const res = await newAlgaehApi({
    uri: "/insurance/updateInsuranceStatement",
    module: "insurance",
    data: input,
    method: "PUT",
  });
  return res.data;
};

// const addICD = async (data) => {
//   const res = await newAlgaehApi({
//     uri: "/invoiceGeneration/addInvoiceIcd",
//     data: {
//       invoice_header_id: data?.hims_f_invoice_header_id,
//       patient_id: data?.patient_id,
//       episode_id: data?.episode_id,
//       daignosis_id: data?.hims_d_icd_id,
//       diagnosis_type: "P",
//       final_daignosis: "Y",
//     },
//     method: "POST",
//     module: "insurance",
//   });
//   return res.data?.records;
// };

// // const deleteICD = async (data) => {
// //   const res = await newAlgaehApi({
// //     uri: "/invoiceGeneration/deleteInvoiceIcd",
// //     data: {
// //       hims_f_invoice_icd_id: data?.hims_f_invoice_icd_id,
// //     },
// //     module: "insurance",
// //     method: "DELETE",
// //   });
// //   return res.data?.records;
// // };

const getStatementServices = async (key, { invoice_header_id }) => {
  const res = await newAlgaehApi({
    uri: "/insurance/getInvoiceDetails",
    module: "insurance",
    data: { invoice_header_id },
    method: "GET",
  });
  return res.data?.records;
};

// const getICDcodes = async (key, { invoice_header_id }) => {
//   const res = await newAlgaehApi({
//     uri: "/invoiceGeneration/getPatientIcdForInvoice",
//     module: "insurance",
//     data: { invoice_header_id },
//     method: "GET",
//   });
//   return res.data?.records;
// };

export function UpdateStatement({
  show = false,
  data = {},
  onClose = () => {},
}) {
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
      refetch();
    },
  });

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
        row.cpt_code = data.cpt_code;
        update(row);
      },
    });
  }

  let columns = [
    {
      fieldName: "service_name",
      label: <AlgaehLabel label={{ forceLabel: "Service Name" }} />,
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

  const inputColumns = (step) => [
    {
      fieldName: `r${step}_amt`,
      label: <AlgaehLabel label={{ forceLabel: "Remittance Amount" }} />,
      editorTemplate: (field, row, update) => (
        <input
          value={row?.remittance_amount}
          defaultValue={row[`r${step}_amt`]}
          onChange={(e) => {
            let { value } = e.target;
            if (value) {
              if (parseFloat(value) <= parseFloat(row?.company_payable)) {
                row.remittance_amount = value;
                row.denial_amount =
                  parseFloat(row.company_payable) - parseFloat(value);
                update(row);
              } else {
                AlgaehMessagePop({
                  type: "Warning",
                  display:
                    "Amount should be less than or equal to claim amount",
                });
              }
            } else {
              row.remittance_amount = "";
              row.denial_amount = "";
            }
          }}
        />
      ),
    },
    {
      fieldName: `d${step}_amt`,
      label: <AlgaehLabel label={{ forceLabel: "Denial Amount" }} />,
      editorTemplate: (row) => row.denial_amount || row[`d${step}_amt`],
    },
    {
      fieldName: `d${step}_reason_id`,
      label: <AlgaehLabel label={{ forceLabel: "Denial Reason" }} />,
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
      editorTemplate: (field, row, update) => (
        <AlgaehAutoComplete
          div={{ className: " mandatory" }}
          selector={{
            name: "title_id",
            className: "select-fld",
            placeholder: "Select Reason",
            dataSource: {
              textField: "denial_desc",
              valueField: "hims_d_denial_id",
              data: denialData ?? [],
            },
            defaultValue: row[`d${step}_reason_id`],
            value: row.denial_reason_id || row[`d${step}_reason_id`],
            onChange: (_, selected) => {
              row.denial_reason_id = selected;
              row[`${step}_reason_id`] = selected;
              row.denial_reason = _?.denial_desc;
              update(row);
            },
          }}
        />
      ),
    },
  ];

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
    columns.push(...inputColumns(1));
  }

  if (step == 2) {
    columns.push(...displayColumns(1));
    columns.push(...inputColumns(2));
  }

  if (step == 3) {
    columns.push(...displayColumns(1));
    columns.push(...displayColumns(2));
    columns.push(...inputColumns(3));
  }

  return (
    <AlgaehModal
      title="Update Statment"
      visible={show}
      maskClosable={false}
      width={1200}
      closable={true}
      footer={null}
      onCancel={() => onClose(true)}
      // onOk={handleSubmit(onSubmit)}
      className={`${userLanguage}_comp row algaehNewModal UpdateStatementModal`}
    >
      <Spin spinning={queryLoading || mutLoading || denialLoading}>
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
            <div className="col-12">
              <div className="portlet-body" id="PreRequestGrid">
                <AlgaehDataGrid
                  className="InsuranceStatementGrid"
                  id="InsuranceStatementGrid"
                  columns={columns}
                  data={invoiceDetails ?? []}
                  // filter={true}
                  isEditable="editOnly"
                  paging={{ page: 0, rowsPerPage: 20 }}
                  events={{
                    onSave: (row) => {
                      update({
                        insurance_statement_id: data?.insurance_statement_id,
                        invoice_header_id: data?.hims_f_invoice_header_id,
                        invoice_detail_id: row?.hims_f_invoice_details_id,
                        remittance_amount: row.remittance_amount,
                        denial_amount: row.denial_amount,
                        denial_reason_id: row.denial_reason_id,
                        cpt_code: row.cpt_code,
                        claim_status: data?.claim_status?.replace("S", "R"),
                      });
                    },
                  }}
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
