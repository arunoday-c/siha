import React, { Component } from "react";
import "./mrd_list.css";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import algaehLoader from "../../Wrapper/fullPageLoader";
import moment from "moment";
import { setGlobal } from "../../../utils/GlobalFunctions";

class MRDList extends Component {
  constructor(props) {
    super(props);
    let month = moment(new Date()).format("MM");
    let year = moment().year();
    this.state = {
      patientData: [],
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d
    };
    this.getPatientMrdList();
    this.baseState = this.state;
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  datehandle(ctrl, e) {
    let intFailure = false;
    if (e === "from_date") {
      if (Date.parse(this.state.to_date) < Date.parse(moment(ctrl)._d)) {
        intFailure = true;
        swalMessage({
          title: "From Date cannot be grater than To Date.",
          type: "warning"
        });
      }
    } else if (e === "to_date") {
      if (Date.parse(moment(ctrl)._d) < Date.parse(this.state.from_date)) {
        intFailure = true;
        swalMessage({
          title: "To Date cannot be less than From Date.",
          type: "warning"
        });
      }
    }

    if (intFailure === false) {
      this.setState(
        {
          [e]: moment(ctrl)._d
        },
        () => {
          this.getPatientMrdList();
        }
      );
    }
  }

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

    let inPutObj = {
      from_date: this.state.from_date,
      to_date: this.state.to_date
    };

    algaehApiCall({
      uri: "/mrd/getPatientMrdList",
      method: "GET",
      module: "MRD",
      data: inPutObj,
      onSuccess: response => {
        algaehLoader({ show: false });
        if (response.data.success) {
          if (response.data.records.length === 0) {
            swalMessage({
              title: "No records Found",
              type: "warning"
            });
          }

          this.setState({ patientData: response.data.records });
        }
      },
      onFailure: error => {
        algaehLoader({ show: false });
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="mrd-list">
        <div className="row inner-top-search">
          <div className="row padding-10">
            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{ forceLabel: "From Registration", isImp: false }}
              textBox={{
                className: "txt-fld",
                name: "from_date"
              }}
              maxDate={new Date()}
              events={{
                onChange: this.datehandle.bind(this)
              }}
              value={this.state.from_date}
            />

            <AlgaehDateHandler
              div={{ className: "col" }}
              label={{ forceLabel: "To Registration", isImp: false }}
              textBox={{
                className: "txt-fld",
                name: "to_date"
              }}
              maxDate={new Date()}
              events={{
                onChange: this.datehandle.bind(this)
              }}
              value={this.state.to_date}
            />
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

                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "patient_code",
                      //label: "Patient Code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient code" }} />
                      ),
                      displayTemplate: row => {
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
                                pat_name: row.full_name
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
                        style: { textAlign: "center" }
                      },
                      className: drow => {
                        return "greenCell";
                      }
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                      ),

                      others: { resizable: false, style: { textAlign: "left" } }
                    },
                    {
                      fieldName: "gender",
                      label: <AlgaehLabel label={{ forceLabel: "Gender" }} />,

                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "date_of_birth",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Date of Birth" }} />
                      ),

                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "age",
                      label: <AlgaehLabel label={{ forceLabel: "Age" }} />,

                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "contact_number",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Phone Number" }} />
                      ),

                      others: {
                        resizable: false,
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  keyId="mrdListGrid"
                  dataSource={{
                    data: this.state.patientData
                  }}
                  filter={true}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 20 }}
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
