import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Collections from "@material-ui/icons/Collections";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import "./PrescriptionList.css";
import "./../../../styles/site.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
  Tooltip
} from "../../Wrapper/algaehWrapper";

import {
  getMedicationList,
  PatientSearch,
  Refresh,
  datehandle,
  ListOfItems
} from "./PrescriptionListEvents";

import IconButton from "@material-ui/core/IconButton";
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

  changeDateFormat({ value }) {
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
          <div
            className="container-fluid"
            style={{ marginTop: "85px", minHeight: "80vh" }}
          >
            <div className="row">
              <AlgaehDateHandler
                div={{ className: "col-lg-2" }}
                label={{ forceLabel: "Select Date" }}
                textBox={{ className: "txt-fld", name: "prescription_date" }}
                events={{
                  onChange: datehandle.bind(this, this)
                }}
                value={this.state.prescription_date}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-2" }}
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
              <div className="col-lg-1 form-group">
                <span
                  className="fas fa-search fa-2x"
                  onClick={PatientSearch.bind(this, this)}
                />
              </div>

              <div className="col-lg-4"> &nbsp; </div>

              <div className="col-lg-1" style={{ paddingTop: "4vh" }}>
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  onClick={getMedicationList.bind(this, this)}
                >
                  Load Data
                </button>
              </div>

              <div className="col-lg-1"> &nbsp; </div>

              <div className="col-lg-1">
                <Tooltip id="tooltip-icon" title="Refresh">
                  <IconButton className="go-button" color="primary">
                    <i
                      className="fas fa-sync-alt"
                      aria-hidden="true"
                      onClick={Refresh.bind(this, this)}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <div className="row form-details">
              <div className="col-lg-12">
                <AlgaehDataGrid
                  id="precription_list"
                  columns={[
                    {
                      fieldName: "patient_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                      ),
                      disabled: false
                    },
                    {
                      fieldName: "full_name",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                      ),
                      disabled: true
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
                      disabled: true
                    },
                    {
                      fieldName: "number_of_items",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Number Of Items" }}
                        />
                      ),

                      disabled: true
                    },

                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ forceLabel: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <IconButton
                              color="primary"
                              title="Collection"
                              style={{ maxHeight: "4vh" }}
                            >
                              <Collections
                                onClick={ListOfItems.bind(this, this, row)}
                              />
                            </IconButton>
                          </span>
                        );
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
