import React, { useState, useContext } from "react";
import "./InsuranceStatement.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import moment from "moment";
import {
  AlgaehLabel,
  AlgaehDateHandler,
  MainContext,
} from "algaeh-react-components";
import {
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../Wrapper/algaehWrapper";
import { swalMessage } from "../../../utils/algaehApiCall";

export default function InsuranceStatement(props) {
  const { userToken } = useContext(MainContext);

  const [hospitals, setHospitals] = useState([]);
  const [hospitalID, setHospitalID] = useState(userToken.hims_d_hospital_id);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [startDt, setStartDt] = useState(0);
  const [endDt, setEndDt] = useState(0);
  const [month, setMonth] = useState(moment().format("MM"));
  const [fromMin, setFromMin] = useState(new Date());
  const [fromMax, setFromMax] = useState(new Date());
  const [toMin, setToMin] = useState(new Date());
  const [toMax, setToMax] = useState(new Date());
  const [selYear, setSelYear] = useState("");
  const [loadYear, setLoadYear] = useState([]);
  return (
    <div className="InsuranceStatementScreen">
      <div className="" style={{ marginBottom: "50px" }}>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{
                forceLabel: "Insurance Statement",
                align: "ltr",
              }}
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
                  label={{
                    forceLabel: "Insurance Statement ",
                    align: "ltr",
                  }}
                />
              ),
            },
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{
                  forceLabel: "Statement No.",
                  returnText: true,
                }}
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
        <AlagehAutoComplete
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Branch",
            isImp: true,
          }}
          selector={{
            name: "hospital_id",
            className: "select-fld",
            value: "", //this.state.hospital_id
            dataSource: {
              textField: "hospital_name",
              valueField: "hims_d_hospital_id",
              data: [], //this.state.hospital_id
            },
            // onChange: this.dropDownHandler.bind(this),
          }}
          showLoading={true}
        />
        <AlagehAutoComplete
          div={{ className: "col-1 form-group mandatory" }}
          label={{
            forceLabel: "Select Year",
            isImp: true,
          }}
          selector={{
            name: "year",
            className: "select-fld",
            value: selYear,
            dataSource: {
              textField: "name",
              valueField: "value",
              data: loadYear,
            },
            onChange: (e) => {
              setMonth("");
              setFromDate(undefined);
              setToDate(undefined);
              setSelYear(e.value);
              // dateCalcl(startDt, endDt, e.value);
            },
            onClear: () => {
              setSelYear("");
            },
          }}
        />
        <AlagehAutoComplete
          div={{ className: "col-2 form-group mandatory" }}
          label={{
            forceLabel: "Select Month",
          }}
          selector={{
            sort: "off",
            name: "select_month",
            className: "select-fld",
            value: month,
            dataSource: {
              textField: "text",
              valueField: "name",
              data: [
                { name: "01", text: "January" },
                { name: "02", text: "February" },
                { name: "03", text: "March" },
                { name: "04", text: "April" },
                { name: "05", text: "May" },
                { name: "06", text: "June" },
                { name: "07", text: "July" },
                { name: "08", text: "August" },
                { name: "09", text: "September" },
                { name: "10", text: "October" },
                { name: "11", text: "November" },
                { name: "12", text: "December" },
              ],
            },
            onChange: (e) => {
              if (selYear === undefined || selYear === "") {
                setFromDate("");
                setToDate("");
                swalMessage({
                  type: "error",
                  title: "Please select year fist",
                });
                return;
              }
              setMonth(e.value);
            },
            onClear: () => {
              setMonth("");
            },
          }}
          showLoading={true}
        />
        {/* <AlgaehDateHandler
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
        /> */}
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
        <div className="portlet-body" id="InsuranceStatementGrid_Cntr">
          <AlgaehDataGrid
            id="InsuranceStatementGrid"
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
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-body">
          <div className="row">
            <div className="col-5"></div>
            <div className="col-7">
              <div className="row">
                <div className="col">
                  <label className="style_Label ">Total Claim Amount</label>
                  <h6>0.00</h6>
                </div>{" "}
                <div className="col">
                  <label className="style_Label ">Total Denial Amount</label>
                  <h6>0.00</h6>
                </div>{" "}
                <div className="col">
                  <label className="style_Label ">
                    Total Remittance Amount
                  </label>
                  <h6>0.00</h6>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
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
