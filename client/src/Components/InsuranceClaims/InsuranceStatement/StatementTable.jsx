import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import "./InsuranceStatement.scss";
import {
  AlgaehDataGrid,
  Spin,
  AlgaehLabel,
  Tooltip,
  MainContext,
  AlgaehMessagePop,
  Modal,
} from "algaeh-react-components";
import { UpdateStatement } from "./UpdateStatment";
import { newAlgaehApi, useQueryParams } from "../../../hooks";
import { FinalRemittance } from "./FinalRemittance";

const getStatements = async (
  key,
  { hims_f_insurance_statement_id, submission_step }
) => {
  const res = await newAlgaehApi({
    uri: "/insurance/getInsuranceStatement",
    module: "insurance",
    data: { hims_f_insurance_statement_id, submission_step },
    method: "GET",
  });
  return res?.data?.records;
};

export function StatementTable(status) {
  const { userToken } = useContext(MainContext);
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(null);
  const params = useQueryParams();
  const hims_f_insurance_statement_id = params.get(
    "hims_f_insurance_statement_id"
  );
  const submission_step = params.get("submission_step");

  const { data, isLoading, refetch } = useQuery(
    ["insurance", { hims_f_insurance_statement_id, submission_step }],
    getStatements,
    {
      enabled: !!hims_f_insurance_statement_id,
    }
  );

  const onClickRow = (row) => {
    setShow(true);
    setCurrent(row);
  };

  const onClose = (shouldRefetch) => {
    setShow(false);
    setCurrent(null);
    if (shouldRefetch) {
      refetch();
    }
  };

  function onDeleteHandler(e, row) {
    e.target.style.pointerEvents = "none";
    Modal.confirm({
      title: "Do you want to delete this invoice?",
      content: "Deleted invoice completely revered",
      onOk: async () => {
        try {
          await newAlgaehApi({
            uri: "/insurance/deleteStatement",
            module: "insurance",
            data: {
              insurance_statement_id: row.insurance_statement_id,
              hims_f_invoice_header_id: row.hims_f_invoice_header_id,
            },
            method: "DELETE",
          });
          AlgaehMessagePop({
            type: "success",
            display: "Successfully deleted",
          });
          refetch();
        } catch (e) {
          AlgaehMessagePop({ type: "error", display: e.message });
        }
      },
    });
  }
  const RemittanceButton = (row) => {
    debugger;
    if (status.insurance_status === "C") {
      return null;
    } else {
      return (
        <>
          <Tooltip title="Edit">
            <span>
              <i
                style={{
                  pointerEvents: data?.posted === "N" ? "" : "none",
                  opacity: data?.posted === "N" ? "" : "0.1",
                }}
                className="fas fa-pen"
                onClick={() => onClickRow(row)}
              ></i>
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span>
              <i
                style={{
                  pointerEvents: data?.posted === "N" ? "" : "none",
                  opacity: data?.posted === "N" ? "" : "0.1",
                }}
                onClick={(e) => onDeleteHandler(e, row)}
                className="fas fa-trash-alt"
              ></i>
            </span>
          </Tooltip>
        </>
      );
    }
  };

  return (
    <Spin spinning={isLoading}>
      <UpdateStatement data={current} show={show} onClose={onClose} />
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-body">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-2 form-group">
                  <label className="style_Label ">Statement No.</label>
                  <h6>{data?.insurance_statement_number || "---"}</h6>
                </div>
                <div className="col-3">
                  <label className="style_Label ">Company Name</label>
                  <h6>{data?.insurance_provider_name || "---"}</h6>
                </div>
                <div className="col-3">
                  <label className="style_Label ">Sub Company Name</label>
                  <h6>{data?.insurance_sub_name || "---"}</h6>
                </div>
                <div className="col-2">
                  <label className="style_Label ">From Date</label>
                  <h6>{data?.from_date || "---"}</h6>
                </div>
                <div className="col-2">
                  <label className="style_Label ">To Date</label>
                  <h6>{data?.to_date || "---"}</h6>
                </div>
                <div className="col-2">
                  <label className="style_Label ">Total Claim Amt.</label>
                  <h6>{data?.total_company_payable || "0.00"}</h6>
                </div>
                <i className="fas fa-minus calcSybmbol"></i>
                <div className="col-2">
                  <label className="style_Label ">Total Denial Amt.</label>
                  <h6>
                    {(data?.calc_denial_amount ?? data?.total_denial_amount) ||
                      "0.00"}
                  </h6>
                </div>{" "}
                <i className="fas fa-equals calcSybmbol"></i>
                <div className="col-2">
                  <label className="style_Label ">Total Remittance Amt.</label>
                  <h6>
                    {(data?.calc_remittance_amount ??
                      data?.total_remittance_amount) ||
                      "0.00"}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Insurance Statement List</h3>
          </div>
        </div>
        <div className="portlet-body" id="PreRequestGrid">
          <AlgaehDataGrid
            className="InsuranceStatementGrid"
            id="InsuranceStatementGrid"
            columns={[
              {
                fieldName: "hims_f_insurance_statement_id",
                //  filterable: false, label: "Action",
                filterable: false,
                label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                displayTemplate: RemittanceButton,
              },
              {
                fieldName: "patient_code",
                filterable: true,
                label: <AlgaehLabel label={{ forceLabel: "Patient Code" }} />,
                others: {
                  minWidth: 130,
                  style: { textAlign: "center" },
                },
              },
              {
                fieldName: "pat_name",
                filterable: true,
                label: <AlgaehLabel label={{ forceLabel: "Patient Name" }} />,
                disabled: true,
                others: {
                  minWidth: 250,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "doc_name",
                filterable: true,
                label: <AlgaehLabel label={{ forceLabel: "Doctor Name" }} />,
                disabled: true,
                others: {
                  minWidth: 250,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "invoice_number",
                filterable: true,
                label: <AlgaehLabel label={{ forceLabel: "Invoice No." }} />,
                disabled: true,
                others: {
                  minWidth: 120,
                  style: { textAlign: "center" },
                },
              },
              {
                fieldName: "invoice_date",
                filterable: true,
                filterType: "date",
                label: <AlgaehLabel label={{ forceLabel: "Invoice date." }} />,
                disabled: true,
                others: {
                  minWidth: 180,
                  style: { textAlign: "center" },
                },
              },
              {
                fieldName: "gross_amount",
                filterable: false,
                label: <AlgaehLabel label={{ forceLabel: "Invoice Amt." }} />,
                disabled: true,
                others: {
                  minWidth: 110,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "company_resp",
                filterable: false,
                label: (
                  <AlgaehLabel label={{ forceLabel: "Co. Respo. Amt." }} />
                ),
                others: {
                  minWidth: 130,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "company_tax",
                filterable: false,
                label: <AlgaehLabel label={{ forceLabel: "Co. Respo. Tax" }} />,
                disabled: true,
                others: {
                  minWidth: 120,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "company_payable",
                filterable: false,
                label: <AlgaehLabel label={{ forceLabel: "Claim Amt." }} />,
                others: {
                  minWidth: 80,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "remittance_amount",
                filterable: false,
                label: (
                  <AlgaehLabel label={{ forceLabel: "Remittance Amt. 1" }} />
                ),
                others: {
                  minWidth: 150,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "denial_amount",
                filterable: false,
                label: <AlgaehLabel label={{ forceLabel: "Denial Amt. 1" }} />,
                others: {
                  minWidth: 120,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "remittance_amount2",
                filterable: false,
                label: (
                  <AlgaehLabel label={{ forceLabel: "Remittance Amt. 2" }} />
                ),
                others: {
                  minWidth: 150,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "denial_amount2",
                filterable: false,
                label: <AlgaehLabel label={{ forceLabel: "Denial Amt. 2" }} />,
                others: {
                  minWidth: 120,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "remittance_amount3",
                filterable: false,
                label: (
                  <AlgaehLabel label={{ forceLabel: "Remittance Amt. 3" }} />
                ),
                others: {
                  minWidth: 150,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "denial_amount3",
                filterable: false,
                label: <AlgaehLabel label={{ forceLabel: "Denial Amt. 3" }} />,
                others: {
                  minWidth: 120,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "remittance_amount",
                filterable: false,
                label: (
                  <AlgaehLabel
                    label={{ forceLabel: "Total Remittance Amt." }}
                  />
                ),
                displayTemplate: (row) => {
                  const sum =
                    parseFloat(row?.remittance_amount ?? 0) +
                    parseFloat(row?.remittance_amount2 ?? 0) +
                    parseFloat(row?.remittance_amount3 ?? 0);
                  return sum?.toFixed(userToken?.decimal_places);
                },
                others: {
                  minWidth: 190,
                  style: { textAlign: "right" },
                },
              },
              {
                fieldName: "denial_amount",
                filterable: false,
                label: (
                  <AlgaehLabel label={{ forceLabel: "Total Denial Amt." }} />
                ),
                displayTemplate: (row) => {
                  const denail_amunt =
                    row.claim_status === "R1"
                      ? parseFloat(row.denial_amount)
                      : row.claim_status === "R2"
                      ? parseFloat(row.denial_amount2)
                      : row.claim_status === "R3"
                      ? parseFloat(row.denial_amount3)
                      : 0;
                  return denail_amunt?.toFixed(userToken?.decimal_places);
                },
                others: {
                  minWidth: 150,
                  style: { textAlign: "right" },
                },
              },
            ]}
            data={data?.claims ?? []}
            // filter={true}
            pagination={true}
            // editable
            // actionsStyle={{width:100}}
            pageOptions={{ rows: 20, page: 1 }}
            isFilterable={true}
          />
        </div>{" "}
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col">
            <FinalRemittance data={data} refetch={refetch} />
          </div>
        </div>
      </div>
    </Spin>
  );
}
