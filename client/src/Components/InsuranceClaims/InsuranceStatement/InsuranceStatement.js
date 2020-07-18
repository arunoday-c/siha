import React from "react";
import "./InsuranceStatement.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import moment from "moment";
import { AlgaehLabel, AlgaehDateHandler } from "algaeh-react-components";

import { AlgaehDataGrid } from "../../Wrapper/algaehWrapper";

export default function InsuranceStatement() {
  return (
    <div className="InsuranceStatementScreen">
      <div className="" style={{ marginBottom: "50px" }}>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Insurance Statement", align: "ltr" }}
            />
          }
          // breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "form_home",
                    align: "ltr",
                  }}
                />
              ),
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ forceLabel: "Insurance Statement ", align: "ltr" }}
                />
              ),
            },
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Statement No.", returnText: true }}
              />
            ),
            value: "",
            selectValue: "",

            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "frontDesk.patients",
            },
            searchName: "patients",
          }}
          // userArea={
          //   <div className="row">
          //     <div className="col">
          //       <AlgaehLabel
          //         label={{
          //           forceLabel: "Registerd Date",
          //         }}
          //       />
          //       <h6>
          //         -----
          //         {/* {this.state.registration_date
          //           ? moment(this.state.registration_date).format(
          //               Options.dateFormat
          //             )
          //           : Options.dateFormat} */}
          //       </h6>
          //     </div>
          //   </div>
          // }
          // printArea={{
          //   menuitems: [
          //     {
          //       label: "ID Card",
          //       events: {
          //         onClick: () => {
          //           generateIdCard(this, this);
          //         },
          //       },
          //     },
          //   ],
          // }}
          // selectedLang={this.state.selectedLang}
        />
      </div>
      <div className="row inner-top-search" style={{ marginTop: 77 }}>
        <AlgaehDateHandler
          div={{ className: "col-2" }}
          label={{ forceLabel: "Start Date", isImp: true }}
          textBox={{ className: "txt-fld" }}
          maxDate={new Date()}
          // events={}
        />
        <AlgaehDateHandler
          div={{ className: "col-2" }}
          label={{ forceLabel: "End Date", isImp: true }}
          textBox={{ className: "txt-fld" }}
          maxDate={new Date()}
          // events={}
        />
        <div className="col form-group">
          <button style={{ marginTop: 19 }} className="btn btn-primary">
            Load
          </button>
        </div>
      </div>
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Insurance Statement List</h3>
          </div>
        </div>
        <div className="portlet-body" id="samplecollectionGrid_cntr">
          <AlgaehDataGrid
            id="samplecollection_grid"
            columns={[
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Patient Code" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
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
                label: <AlgaehLabel label={{ forceLabel: "Invoice No." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Invoice date." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Invoice Amt." }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Co. Respo. Amt." }} />
                ),
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Co. Respo. Tax" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Co. Net Payble" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Denial Amt. 1" }} />,
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: <AlgaehLabel label={{ forceLabel: "Denial Amt. 2" }} />,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Remittance Amt. 1" }} />
                ),
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
              {
                fieldName: "",
                label: (
                  <AlgaehLabel label={{ forceLabel: "Remittance Amt. 2" }} />
                ),
                disabled: true,
                others: {
                  resizable: false,
                  style: { textAlign: "left" },
                },
              },
            ]}
            keyId=""
            dataSource={{}}
            filter={true}
            noDataText="No data available for selected period"
            paging={{ page: 0, rowsPerPage: 20 }}
          />
        </div>{" "}
      </div>{" "}
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-12">
            <button className="btn bttn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
