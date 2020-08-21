import React, { useState } from "react";
import { useQuery } from "react-query";
import "./InsuranceStatement.scss";
import {
  AlgaehDataGrid,
  Spin,
  AlgaehLabel,
  Tooltip,
} from "algaeh-react-components";
import { UpdateStatement } from "./UpdateStatment";
import { newAlgaehApi, useQueryParams } from "../../../hooks";

const getStatements = async (key, { hims_f_insurance_statement_id }) => {
  const res = await newAlgaehApi({
    uri: "/insurance/getInsuranceStatement",
    module: "insurance",
    data: { hims_f_insurance_statement_id },
    method: "GET",
  });
  return res?.data?.records;
};

export function StatementTable() {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(null);
  const params = useQueryParams();
  const hims_f_insurance_statement_id = params.get(
    "hims_f_insurance_statement_id"
  );

  const { data, isLoading, isFetching, refetch } = useQuery(
    ["insurance", { hims_f_insurance_statement_id }],
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

  const RemittanceButton = (row) => {
    return (
      <Tooltip title="Pay">
        <span onClick={() => onClickRow(row)}>
          <i className="fas fa-pen"></i>
        </span>
      </Tooltip>
    );
  };

  return (
    <Spin spinning={isLoading || isFetching}>
      <UpdateStatement data={current} show={show} onClose={onClose} />
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
                label: "Action",
                displayTemplate: RemittanceButton,
              },
              {
                fieldName: "patient_code",
                label: <AlgaehLabel label={{ forceLabel: "Patient Code" }} />,
              },
              {
                fieldName: "pat_name",
                label: <AlgaehLabel label={{ forceLabel: "Patient Name" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "doc_name",
                label: <AlgaehLabel label={{ forceLabel: "Doctor Name" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "invoice_number",
                label: <AlgaehLabel label={{ forceLabel: "Invoice No." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "invoice_date",
                label: <AlgaehLabel label={{ forceLabel: "Invoice date." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "gross_amount",
                label: <AlgaehLabel label={{ forceLabel: "Invoice Amt." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "company_resp",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Co. Respo. Amt." }} />
                ),
              },
              {
                fieldName: "company_tax",
                label: <AlgaehLabel label={{ forceLabel: "Co. Respo. Tax" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "company_payable",
                label: <AlgaehLabel label={{ forceLabel: "Claim Amount" }} />,
              },
              {
                fieldName: "remittance_ammount",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Remittance Amt. 1" }} />
                ),
              },
              {
                fieldName: "denial_ammount",
                label: <AlgaehLabel label={{ forceLabel: "Denial Amt. 1" }} />,
              },
              {
                fieldName: "remittance_2",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Remittance Amt. 2" }} />
                ),
              },
              {
                fieldName: "denial_amount_2",
                label: <AlgaehLabel label={{ forceLabel: "Denial Amt. 2" }} />,
              },
              {
                fieldName: "remittance_ammount",
                label: (
                  <AlgaehLabel
                    label={{ forceLabel: "Total Remittance Amount" }}
                  />
                ),
              },
              {
                fieldName: "denial_ammount",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Total Denial Amount" }} />
                ),
              },
            ]}
            data={data?.claims ?? []}
            // filter={true}
            paging={{ page: 0, rowsPerPage: 20 }}
          />
        </div>{" "}
      </div>{" "}
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-body">
          <div className="row">
            <div className="col-5"></div>
            <div className="col-7">
              <div className="row">
                <div className="col">
                  <label className="style_Label ">Total Claim Amount</label>
                  <h6>{data?.total_company_payable || "0.00"}</h6>
                </div>
                <div className="col">
                  <label className="style_Label ">Total Denial Amount</label>
                  <h6>{data?.total_denial_amount || "0.00"}</h6>
                </div>{" "}
                <div className="col">
                  <label className="style_Label ">
                    Total Remittance Amount
                  </label>
                  <h6>{data?.total_remittance_amount || "0.00"}</h6>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
