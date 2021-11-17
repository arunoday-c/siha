import React, { Component } from "react";
import "./mrd_list.scss";
import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import {
  // AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import algaehLoader from "../../Wrapper/fullPageLoader";
import moment from "moment";
import { setGlobal } from "../../../utils/GlobalFunctions";
import { AlgaehDataGrid } from "algaeh-react-components";

class MRDList extends Component {
  constructor(props) {
    super(props);
    let month = moment(new Date()).format("MM");
    let year = moment().year();
    this.state = {
      patientData: [],
      patient_code: "",
      hims_d_patient_id: null,
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    this.getPatientMrdList();
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  loadData() {
    let intFailure = false;
    if (Date.parse(this.state.to_date) < Date.parse(this.state.from_date)) {
      intFailure = true;
      swalMessage({
        title: "From Date cannot be grater than To Date.",
        type: "warning",
      });
    }

    if (intFailure === false) {
      this.getPatientMrdList();
    }
  }
  clearData() {
    this.setState(
      {
        patient_code: "",
        hims_d_patient_id: null,
      },
      () => {
        this.loadData();
      }
    );
  }
  datehandle(ctrl, e) {
    this.setState({
      [e]: moment(ctrl)._d,
    });
  }
  PatientSearch = () => {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.frontDesk.patients,
      },
      searchName: "patients",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        this.setState({
          patient_code: row.patient_code,
          hims_d_patient_id: row.hims_d_patient_id,
        });

        // if (context !== null) {
        //   context.updateState({ patient_code: row.patient_code });
        // }
      },
    });
  };
  getPatientMrdList(e) {
    if (e !== undefined) e.preventDefault();

    // if (this.state.to_date === null) {
    //   swalMessage({
    //     title: "To Date cannot be null.",
    //     type: "warning"
    //   });
    //   return;
    // } else if (this.state.from_date === null) {
    //   swalMessage({
    //     title: "From Date cannot be null.",
    //     type: "warning"
    //   });
    //   return;
    // }
    algaehLoader({ show: true });
    if (this.state.patient_code) {
      algaehApiCall({
        uri: "/mrd/getPatientMrd",
        method: "GET",
        module: "MRD",
        data: { hims_d_patient_id: this.state.hims_d_patient_id },
        onSuccess: (response) => {
          algaehLoader({ show: false });
          if (response.data.success) {
            if (response.data.records.length === 0) {
              swalMessage({
                title: "No records Found",
                type: "warning",
              });
            }

            this.setState({ patientData: response.data.records });
          }
        },
        onFailure: (error) => {
          algaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    } else {
      let inPutObj = {
        from_date: this.state.from_date,
        to_date: this.state.to_date,
      };

      algaehApiCall({
        uri: "/mrd/getPatientMrdList",
        method: "GET",
        module: "MRD",
        data: inPutObj,
        onSuccess: (response) => {
          algaehLoader({ show: false });
          if (response.data.success) {
            if (response.data.records.length === 0) {
              swalMessage({
                title: "No records Found",
                type: "warning",
              });
            }

            this.setState({ patientData: response.data.records });
          }
        },
        onFailure: (error) => {
          algaehLoader({ show: false });
          swalMessage({
            title: error.message,
            type: "error",
          });
        },
      });
    }
  }

  render() {
    return (
      <div className="mrd-list">
        <div className="row  inner-top-search">
          <div className="col-2 globalSearchCntr">
            <AlgaehLabel label={{ fieldName: "s_patient_code" }} />
            <h6 onClick={this.PatientSearch.bind(this)}>
              {this.state.patient_code ? (
                this.state.patient_code
              ) : (
                <AlgaehLabel label={{ fieldName: "patient_code" }} />
              )}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div>
          <AlgaehDateHandler
            div={{ className: "col-3 mandatory form-group" }}
            label={{ forceLabel: "Patient Registration From", isImp: false }}
            textBox={{
              className: "txt-fld",
              name: "from_date",
            }}
            maxDate={new Date()}
            events={{
              onChange: this.datehandle.bind(this),
            }}
            value={this.state.from_date}
          />

          <AlgaehDateHandler
            div={{ className: "col-3 mandatory form-group" }}
            label={{ forceLabel: "Patient Registration To", isImp: false }}
            textBox={{
              className: "txt-fld",
              name: "to_date",
            }}
            maxDate={new Date()}
            events={{
              onChange: this.datehandle.bind(this),
            }}
            value={this.state.to_date}
          />
          <div className="col">
            {" "}
            <button
              className="btn btn-default btn-sm"
              onClick={this.clearData.bind(this)}
              type="button"
              style={{ marginTop: "21px" }}
            >
              clear
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={this.loadData.bind(this)}
              type="button"
              style={{ marginTop: "21px", marginLeft: 10 }}
            >
              Load
            </button>
          </div>
        </div>
        <div className="portlet portlet-bordered margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Patient List</h3>
            </div>
          </div>
          <div className="portlet-body" id="mrdListCntr">
            <div className="row">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="mrdListGrid"
                  columns={[
                    {
                      fieldName: "registration_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Registration Date" }}
                        />
                      ),
                      filterable: true,
                      sortable: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "primary_id_no",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Primary ID No." }} />
                      ),
                      sortable: true,
                      filterable: true,
                      others: { resizable: false },
                    },
                    {
                      fieldName: "patient_code",
                      //label: "Patient Code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient code" }} />
                      ),
                      sortable: true,
                      filterable: true,
                      displayTemplate: (row) => {
                        return (
                          <span
                            onClick={() => {
                              setGlobal({
                                "MRD-STD": "PatientMRD",
                                mrd_patient: row.hims_d_patient_id,
                                nationality: row.nationality,
                                primary_id: row.primary_document_name,
                                primary_id_number: row.primary_id_no,
                                gender: row.gender,
                                age: row.age,
                                date_of_birth: row.date_of_birth,
                                patient_code: row.patient_code,
                                contact_number: row.contact_number,
                                pat_name: row.full_name,
                              });
                              document.getElementById("mrd-router").click();
                            }}
                            className="pat-code"
                          >
                            {row.patient_code}
                          </span>
                        );
                      },
                      others: {
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                      className: (drow) => {
                        return "greenCell";
                      },
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                      ),
                      filterable: true,
                      sortable: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "left" },
                      },
                    },
                    {
                      fieldName: "gender",
                      label: <AlgaehLabel label={{ forceLabel: "Gender" }} />,
                      filterable: true,
                      sortable: true,
                      // filterType: "choices",
                      // choices: [
                      //   {
                      //     name: "M",
                      //     value: "Male",
                      //   },
                      //   {
                      //     name: "F",
                      //     value: "N",
                      //   },
                      // ],
                      others: {
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "date_of_birth",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Date of Birth" }} />
                      ),
                      filterable: true,
                      sortable: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "age",
                      label: <AlgaehLabel label={{ forceLabel: "Age" }} />,
                      filterable: true,
                      sortable: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                    {
                      fieldName: "contact_number",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Phone Number" }} />
                      ),
                      filterable: true,
                      sortable: true,
                      others: {
                        resizable: false,
                        style: { textAlign: "center" },
                      },
                    },
                  ]}
                  keyId="mrdListGrid"
                  // dataSource={{
                  data={this.state.patientData}
                  // }}
                  pagination={true}
                  pageOptions={{ rows: 50, page: 1 }}
                  isFilterable={true}
                  // filter={true}
                  // isEditable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MRDList;
