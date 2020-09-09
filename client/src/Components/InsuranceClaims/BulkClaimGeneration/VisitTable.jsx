import React, { useState } from "react";
import "./BulkClaimGeneration.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  Spin,
  Tooltip,
} from "algaeh-react-components";
import { InvoiceModal } from "./InvoiceModal";

export function VisitTable({ loading = false, data = [] }) {
  const [current, setCurrent] = useState(null);
  // const params = useQueryParams();

  // const onClickRow = (row) => {
  //   setShow(true);
  //   setCurrent(row);
  // };

  // const onClose = (shouldRefetch) => {
  //   setShow(false);
  //   setCurrent(null);
  // };

  // const RemittanceButton = (row) => {
  //   return (
  //     <Tooltip title="Pay">
  //       <span onClick={() => onClickRow(row)}>
  //         <i className="fas fa-pen"></i>
  //       </span>
  //     </Tooltip>
  //   );
  // };

  return (
    <Spin spinning={loading}>
      <InvoiceModal
        visible={!!current}
        onClose={() => setCurrent(null)}
        visit_id={current?.hims_f_patient_visit_id}
        extra={current}
      />
      {/* <UpdateStatement data={current} show={show} onClose={onClose} /> */}
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Patient Visit List</h3>
          </div>
        </div>
        <div className="portlet-body" id="PreRequestGrid">
          <AlgaehDataGrid
            className="BulkClaimGenerationtGrid"
            id="BulkClaimGenerationGrid"
            columns={[
              {
                fieldName: "",
                label: "Action",
                // displayTemplate: RemittanceButton,
              },
              {
                fieldName: "hims_f_patient_visit_id",
                label: "View Invoice",
                displayTemplate: (row) => (
                  <Tooltip title="Pay">
                    <span onClick={() => setCurrent(row)}>
                      <i className="fas fa-eye"></i>
                    </span>
                  </Tooltip>
                ),
              },
              {
                fieldName: "visit_code",
                label: <AlgaehLabel label={{ forceLabel: "Visit Code" }} />,
              },
              {
                fieldName: "visit_date",
                label: <AlgaehLabel label={{ forceLabel: "Visit Date" }} />,
              },
              {
                fieldName: "patient_code",
                label: <AlgaehLabel label={{ forceLabel: "Patient Code" }} />,
              },
              {
                fieldName: "full_name",
                label: <AlgaehLabel label={{ forceLabel: "Patient Name" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "doctor_name",
                label: <AlgaehLabel label={{ forceLabel: "Doctor Name" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "insurance_provider_name",
                label: <AlgaehLabel label={{ forceLabel: "Company Name" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "insurance_sub_name",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Sub Company Name" }} />
                ),
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "patient_res",
                label: <AlgaehLabel label={{ forceLabel: "PATIENT RESP." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "patient_tax",
                label: <AlgaehLabel label={{ forceLabel: "PATIENT TAX" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "patient_payable",
                label: (
                  <AlgaehLabel label={{ forceLabel: "PATIENT PAYABLE" }} />
                ),
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "company_res",
                label: <AlgaehLabel label={{ forceLabel: "COMPANY RESP." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "company_tax",
                label: <AlgaehLabel label={{ forceLabel: "COMPANY TAX" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "company_payable",
                label: (
                  <AlgaehLabel label={{ forceLabel: "COMPANY PAYABLE" }} />
                ),
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
            ]}
            data={data}
            // filter={true}
            paging={{ page: 0, rowsPerPage: 20 }}
          />
        </div>{" "}
      </div>{" "}
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-body">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col">
                  <label className="style_Label ">Total Visit Selected</label>
                  <h6>0.00</h6>
                </div>
                <div className="col">
                  <label className="style_Label ">Total PATIENT PAYABLE</label>
                  <h6>0.00</h6>
                </div>{" "}
                <div className="col">
                  <label className="style_Label ">Total COMPANY PAYABLE</label>
                  <h6>0.00</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
}
