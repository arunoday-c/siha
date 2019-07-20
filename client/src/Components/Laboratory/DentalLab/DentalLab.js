import React, { Component } from "react";
import "./DentalLab.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import ButtonType from "../../Wrapper/algaehButton";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import DentalImage from "../../../assets/images/dcaf_Dental_chart.png";
export default class DentalLab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OpenForm: false,
      from_due_date: moment()
        .add(-1, "months")
        .format("YYYY-MM-DD"),
      to_due_date: moment()
        .add(2, "months")
        .format("YYYY-MM-DD"),
      loading_request_list: false,
      request_list: [],
      openDentalModal: false
    };
  }

  openDentalModalHandler(e, cntr) {
    this.setState({
      openDentalModal: true
    });
  }
  componentDidMount() {
    this.loadRequestList();
  }
  loadRequestList() {
    this.setState(
      {
        loading_request_list: true
      },
      () => {
        const that = this;
        algaehApiCall({
          uri: "/dentalForm/getDentalLab",
          method: "GET",
          data: {
            from_due_date: that.state.from_due_date,
            to_due_date: that.state.to_due_date
          },
          onSuccess: response => {
            if (response.data.success) {
              if (response.data.records.length === 0) {
                swalMessage({
                  title: "No records Found",
                  type: "info"
                });
              }

              that.setState({
                loading_request_list: false,
                request_list: response.data.records
              });
            } else {
              that.setState({
                loading_request_list: false,
                request_list: []
              });
              swalMessage({
                title: response.data.message,
                type: "error"
              });
            }
          },
          onCatch: error => {
            that.setState({
              loading_request_list: false,
              request_list: []
            });
          }
        });
      }
    );
  }
  render() {
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          openPopup={this.state.openDentalModal}
          title="Teeth Selection"
          events={{
            onClose: () => {
              this.setState({
                openDentalModal: false
              });
            }
          }}
        >
          <div className="popupInner" data-validate="addDentalPlanDiv">
            <div className="col-12">
              <div className="row">
                <div className="col-12 popRightDiv">
                  <div className="col-lg-7">
                    <img src={DentalImage} height="400" width="400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>

        <div className="DentalLabScreen">
          <div className="row inner-top-search">
            <div className="row padding-10">
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "From Expected Date", isImp: false }}
                textBox={{
                  className: "txt-fld",
                  name: "from_due_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      from_due_date: selectedDate
                    });
                  }
                }}
                value={this.state.from_due_date}
              />

              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ forceLabel: "To Expected Date", isImp: false }}
                textBox={{
                  className: "txt-fld",
                  name: "to_due_date"
                }}
                maxDate={new Date()}
                events={{
                  onChange: selectedDate => {
                    this.setState({
                      to_due_date: selectedDate
                    });
                  }
                }}
                value={this.state.to_due_date}
              />
              <ButtonType
                label={{
                  forceLabel: "Load",
                  returnText: true
                }}
                loading={this.state.loading_request_list}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 margin-top-15">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Dental Form Requests List
                    </h3>
                  </div>
                  {/* <div className="actions">
                  <a
                    className="btn btn-primary btn-circle active"
                    onClick={this.OpenDentalForm.bind(this)}
                  >
                    <i className="fas fa-plus" />
                  </a>
                </div> */}
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-12" id="DentalFormGrid_Cntr">
                      <AlgaehDataGrid
                        id="DentalFormGrid"
                        datavalidate="DentalFormGrid"
                        columns={[
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Actions" }} />
                            ),
                            displayTemplate: row => (
                              <button
                                onClick={this.openDentalModalHandler.bind(
                                  this,
                                  row
                                )}
                              >
                                Detail
                              </button>
                            ),
                            others: {
                              maxWidth: 100,
                              resizable: false,
                              filterable: false,
                              style: { textAlign: "center" }
                            }
                          },
                          {
                            fieldName: "patient_code",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "MRN Number" }}
                              />
                            )
                          },
                          {
                            fieldName: "patient_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Patient Name" }}
                              />
                            )
                          },
                          {
                            fieldName: "employee_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Doctor Name" }}
                              />
                            )
                          },
                          {
                            fieldName: "plan_name",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Procedure Name" }}
                              />
                            )
                          },
                          {
                            fieldName: "due_date",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Expected Date" }}
                              />
                            )
                          },
                          {
                            fieldName: "work_status",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Status" }} />
                            ),
                            displayTemplate: row => (
                              <label>
                                {row.work_status === "WIP"
                                  ? "Work In Progress"
                                  : row.work_status === "PEN"
                                  ? "Pending"
                                  : "Completed"}{" "}
                              </label>
                            )
                          }
                        ]}
                        keyId="dental_lab"
                        dataSource={{ data: this.state.request_list }}
                        isEditable={false}
                        filter={true}
                        paging={{ page: 0, rowsPerPage: 20 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <DentelForm
          show={this.state.OpenForm}
          onClose={this.OpenDentalForm.bind(this)}
          HeaderCaption={
            <AlgaehLabel
              label={{
                forceLabel: "Dental Form",
                align: "ltr"
              }}
            />
          }
        /> */}
        </div>
      </React.Fragment>
    );
  }
}
