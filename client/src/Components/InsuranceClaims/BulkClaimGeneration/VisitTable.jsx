import React from "react";
import { useQuery } from "react-query";
import "./BulkClaimGeneration.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  Spin,
  // Tooltip,
} from "algaeh-react-components";
// import { UpdateStatement } from "./UpdateStatment";
// import { newAlgaehApi, useQueryParams } from "../../../hooks";

export function VisitTable() {
  // const [show, setShow] = useState(false);
  // const [current, setCurrent] = useState(null);
  // const params = useQueryParams();

  const { isLoading } = useQuery();

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
    <Spin spinning={isLoading}>
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
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Visit Code" }} />,
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Visit Date" }} />,
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Patient Code" }} />,
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Patient Name" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Doctor Name" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Company Name" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
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
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "PATIENT RESP." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "PATIENT TAX" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
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
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "COMPANY RESP." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "COMPANY TAX" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
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
            data={[]}
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
