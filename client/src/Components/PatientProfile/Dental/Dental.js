import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./Dental.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import Enumerable from "linq";

let teeth = [];

class Dental extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDentalModal: false,
      procedures: [],
      treatements: [
        {
          date: "01-12-2018",
          tooth: 1,
          surface: "D, L",
          code: "PROC00989",
          description: "ROOT CANAL",
          status: "Completed"
        }
      ]
    };
    this.getProcedures();
  }

  getProcedures() {
    algaehApiCall({
      uri: "/serviceType/getService",
      data: {
        procedure_type: "DN"
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            procedures: response.data.records
          });
        }
      },
      onError: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  textHandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  componentDidMount() {}

  markTeethSurface(e) {
    e.currentTarget.classList.contains("mark-active")
      ? e.currentTarget.classList.remove("mark-active")
      : e.currentTarget.classList.add("mark-active");

    let my_obj = {
      tooth_number: parseInt(
        e.currentTarget.parentElement.previousElementSibling.innerText,
        10
      ),
      surface: e.currentTarget.innerText.toString()
    };

    let my_item = Enumerable.from(teeth)
      .where(
        w =>
          w.tooth_number === my_obj.tooth_number && w.surface === my_obj.surface
      )
      .firstOrDefault();

    if (my_item !== undefined) {
      teeth.splice(teeth.indexOf(my_item), 1);
      //console.log("Teeth Selected", teeth);
    } else {
      teeth.push(my_obj);
      //console.log("Teeth Selected", teeth);
    }
  }

  generateToothUpperLeftSet() {
    let plot = [];
    for (let i = 1; i < 9; i++) {
      plot.push(
        <div
          key={i}
          className={
            "col tooth-sec up-side " +
            (i <= 3
              ? "molar-up-"
              : i <= 5
              ? "premolar-up-"
              : i === 6
              ? "canine-up-"
              : "incisors-up-up-") +
            i
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {i >= 6 ? null : (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return plot;
  }
  generateToothUpperRightSet() {
    let plot = [];
    for (let i = 9; i < 17; i++) {
      plot.push(
        <div
          key={i}
          className={
            "col tooth-sec up-side " +
            (i <= 10
              ? "incisors-up-up-"
              : i === 11
              ? "canine-up-"
              : i <= 13
              ? "premolar-up-"
              : "i molar-up-") +
            i
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {i >= 12 ? (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    return plot;
  }

  generateToothLowerLeftSet() {
    let plot = [];
    let counter = 1;

    for (let i = 32; i >= 25; i--) {
      plot.push(
        <div
          key={i}
          className={
            "col tooth-sec down-side " +
            (counter <= 3
              ? "molar-down-"
              : counter <= 5
              ? "premolar-down-"
              : counter === 6
              ? "canine-down-"
              : "incisors-down-") +
            counter
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {counter >= 6 ? null : (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            )}
          </div>
        </div>
      );
      counter++;
    }
    return plot;
  }

  generateToothLowerRightSet() {
    let plot = [];
    let counter = 1;

    for (let i = 24; i < 18; i--) {
      plot.push(
        <div
          key={i}
          className={
            "col tooth-sec down-side " +
            (counter <= 3
              ? "incisors-down-"
              : counter === 5
              ? "canine-down-"
              : counter <= 6
              ? "premolar-down-"
              : "i molar-down-") +
            i
          }
        >
          <span>{i}</span>
          <div className="surface-Marking">
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="top-surface"
            >
              <span>D</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="right-surface"
            >
              <span>L</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="bottom-surface"
            >
              <span>I</span>
            </div>
            <div
              onClick={this.markTeethSurface.bind(this)}
              className="left-surface"
            >
              <span>P</span>
            </div>
            {i >= 20 ? (
              <div
                onClick={this.markTeethSurface.bind(this)}
                className="middle-surface"
              >
                <span>M</span>
              </div>
            ) : null}
          </div>
        </div>
      );
      counter++;
    }
    return plot;
  }

  render() {
    return (
      <div id="dentalTreatment">
        <AlgaehModalPopUp
          events={{
            onClose: () => {
              teeth = [];
              this.setState({
                openDentalModal: false,
                hims_d_services_id: null
              });
            }
          }}
          openPopup={this.state.openDentalModal}
          title="Dental Plan"
        >
          <div className="col-lg-12 margin-bottom-15">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-4" }}
                label={{
                  forceLabel: "Treatment Plan",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "treatement_plan",
                  value: this.state.treatement_plan,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    disabled: true,
                    placeholder: "Enter Treatment Name"
                  }
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col-lg-3" }}
                label={{
                  forceLabel: "Select a Procedure",
                  isImp: true
                }}
                selector={{
                  name: "hims_d_services_id",
                  className: "select-fld",
                  value: this.state.hims_d_services_id,
                  dataSource: {
                    textField: "service_name",
                    valueField: "hims_d_services_id",
                    data: this.state.procedures
                  },
                  onChange: this.dropDownHandler.bind(this)
                }}
              />
            </div>
          </div>

          <div className="col-lg-12" id="dentalTreatment">
            <div className="row top-teeth-sec">
              <div className="col-lg-6 teeth-sec">
                <h6>Upper Left</h6>
                <div className="row">{this.generateToothUpperLeftSet()}</div>
              </div>
              <div className="col-lg-6 teeth-sec">
                <h6>Upper Right</h6>
                <div className="row">{this.generateToothUpperRightSet()}</div>
              </div>
            </div>

            <div className="row bottom-teeth-sec">
              <div className="col-lg-6 teeth-sec">
                <div className="row">{this.generateToothLowerLeftSet()}</div>
                <h6>Lower Left</h6>
              </div>
              <div className="col-lg-6 teeth-sec">
                <div className="row">
                  {/* {this.generateToothLowerRightSet()} */}
                  <div className="col tooth-sec down-side incisors-down-9">
                    <span>24</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side incisors-down-10">
                    <span>23</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side canine-down-11">
                    <span>22</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side premolar-down-12">
                    <span>21</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side premolar-down-13">
                    <span>20</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side molar-down-14">
                    <span>19</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side molar-down-15">
                    <span>18</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                  <div className="col tooth-sec down-side molar-down-16">
                    <span>17</span>
                    <div className="surface-Marking">
                      <div className="top-surface">
                        <span>D</span>
                      </div>
                      <div className="right-surface">
                        <span>L</span>
                      </div>
                      <div className="bottom-surface">
                        <span>I</span>
                      </div>
                      <div className="left-surface">
                        <span>P</span>
                      </div>
                      <div className="middle-surface">
                        <span>M</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h6>Lower Right</h6>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 margin-bottom-15">
              <button className="btn btn-primary" style={{ float: "right" }}>
                Add to List
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
          <div className="portlet-title">
            {/* <div className="caption">
              <h3 className="caption-subject">Treatement List</h3>
            </div>
            <div className="actions">
              <a
                onClick={() => {
                  this.setState({
                    openDentalModal: true
                  });
                }}
                className="btn btn-primary btn-circle active"
              >
                <i className="fas fa-plus" />
              </a>
            </div> */}
            <div className="col-lg-12 margin-bottom-15">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  label={{
                    forceLabel: "Treatment Plan",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "treatement_plan",
                    value: this.state.treatement_plan,
                    events: {
                      onChange: this.textHandle.bind(this)
                    },
                    others: {
                      placeholder: "Enter Treatment Name"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  label={{
                    forceLabel: "Remarks",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "remarks",
                    value: this.state.remarks,
                    events: {
                      onChange: this.textHandle.bind(this)
                    },
                    others: {
                      placeholder: "Enter Remarks"
                    }
                  }}
                />

                <div className="col-lg-4 margin-top-15">
                  <button className="btn btn-primary">Add to List</button>
                </div>
              </div>
            </div>
          </div>
          <div className="portlet-body">
            <AlgaehDataGrid
              id="shift-grid"
              datavalidate="data-validate='shiftDiv'"
              columns={[
                {
                  fieldName: "actions",
                  label: "Actions",
                  displayTemplate: row => {
                    return (
                      <span
                        onClick={() => {
                          this.setState({
                            openDentalModal: true
                          });
                        }}
                      >
                        <i className="fas fa-file-alt" />
                      </span>
                    );
                  }
                },
                {
                  fieldName: "date",
                  label: "Date"
                },
                {
                  fieldName: "tooth",
                  label: "Tooth",
                  disabled: true
                },
                {
                  fieldName: "surface",
                  label: "Surface"
                },
                {
                  fieldName: "code",
                  label: "Code",
                  disabled: true
                },

                {
                  fieldName: "description",
                  label: "Description",
                  disabled: true
                },
                {
                  fieldName: "status",
                  label: "Status",
                  disabled: true
                }
              ]}
              keyId="algaeh_app_screens_id"
              dataSource={{
                data: this.state.treatements
              }}
              filter={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: () => {},
                onDone: () => {}
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_summary: state.patient_summary,
    patient_profile: state.patient_profile
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientSummary: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dental)
);
