import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import "./PrescriptionList.css";
import "./../../../styles/site.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import {
  getMedicationList,
  PatientSearch,
  Refresh,
  datehandle,
  ListOfItems
} from "./PrescriptionListEvents";

import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import ListofItems from "./ListofItems/ListofItems";

class PrescriptionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prescription_date: new Date(),
      medication_list: [],
      patient_id: null,
      item_list: [],
      itemlist: false
    };
  }

  componentDidMount() {
    getMedicationList(this, this);
  }

  changeDateFormat(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-prescription-list-form">
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Prescription List", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Home",
                      align: "ltr"
                    }}
                  />
                )
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ forceLabel: "Prescription List", align: "ltr" }}
                  />
                )
              }
            ]}
          />
          <div style={{ marginTop: 76 }}>
            <div
              className="row inner-top-search"
              style={{ marginTop: 57, paddingBottom: 10 }}
            >
              <div className="col-lg-12">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ forceLabel: "Select Date" }}
                    textBox={{
                      className: "txt-fld",
                      name: "prescription_date"
                    }}
                    dontAllow={"future"}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    value={this.state.prescription_date}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Patient Code"
                    }}
                    textBox={{
                      value: this.state.patient_code,
                      className: "txt-fld",
                      name: "patient_code",

                      events: {
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <div className="col-lg-1">
                    <span
                      className="fas fa-search"
                      style={{
                        fontSize: 20,
                        marginTop: 27
                      }}
                      onClick={PatientSearch.bind(this, this)}
                    />
                  </div>

                  <div className="col" style={{ paddingTop: 21 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={getMedicationList.bind(this, this)}
                      style={{ marginRight: 10 }}
                    >
                      Load Data
                    </button>
                    <button
                      className="btn btn-default btn-sm"
                      type="button"
                      onClick={Refresh.bind(this, this)}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="portlet portlet-bordered margin-bottom-15">
              {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Investigation Lists</h3>
            </div>
            <div className="actions">
            </div>
          </div> */}
              <div className="portlet-body" id="precriptionList_Cntr">
                <AlgaehDataGrid
                  id="precription_list"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-prescription"
                              onClick={ListOfItems.bind(this, this, row)}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 70,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                      ),
                      disabled: false,
                      others: {
                        maxWidth: 150,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                      ),
                      disabled: true,
                      others: {
                        style: { textAlign: "left" }
                      }
                    },
                    {
                      fieldName: "prescription_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Prescription Date" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {this.changeDateFormat(row.prescription_date)}
                          </span>
                        );
                      },
                      disabled: true,
                      others: {
                        maxWidth: 150,
                        style: { textAlign: "center" }
                      }
                    },
                    {
                      fieldName: "number_of_items",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Number Of Items" }}
                        />
                      ),

                      disabled: true,
                      others: {
                        maxWidth: 150,
                        style: { textAlign: "center" }
                      }
                    }
                  ]}
                  keyId="patient_code"
                  dataSource={{
                    data: this.state.medication_list
                  }}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
              <ListofItems
                show={this.state.itemlist}
                onClose={ListOfItems.bind(this, this)}
                selectedLang={this.state.selectedLang}
                inputsparameters={this.state.item_list}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    medicationlist: state.medicationlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getMedicationList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PrescriptionList)
);
