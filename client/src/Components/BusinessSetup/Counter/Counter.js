import React, { Component } from "react";
import "./counter.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import swal from "sweetalert2";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counters: []
    };
  }

  clearState() {
    this.setState({
      counter_code: "",
      counter_description: "",
      arabic_name: ""
    });
  }

  getCounters() {
    algaehApiCall({
      uri: "/shiftAndCounter/getCounterMaster",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ counters: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  componentDidMount() {
    this.getCounters();
  }

  addCounter(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",

      onSuccess: () => {
        algaehApiCall({
          uri: "/shiftAndCounter/addCounterMaster",
          method: "POST",
          data: {
            counter_code: this.state.counter_code,
            counter_description: this.state.counter_description,
            arabic_name: this.state.arabic_name
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "counter added Successfully",
                type: "success"
              });

              this.getCounters();
              this.clearState();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.response.data.message,
              type: "error"
            });
          }
        });
      }
    });
  }

  deleteCounters(data) {
    swal({
      title: "Delete the counter " + data.counter_description + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/shiftAndCounter/updateCounterMaster",
          data: {
            counter_code: data.counter_code,
            record_status: "I",
            counter_description: data.counter_description,
            arabic_name: data.arabic_name,
            counter_status: data.counter_status,
            hims_d_counter_id: data.hims_d_counter_id
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getCounters();
            }
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      } else {
        swalMessage({
          title: "Delete request cancelled",
          type: "warning"
        });
      }
    });
  }

  updatecounters(data) {
    algaehApiCall({
      uri: "/shiftAndCounter/updateCounterMaster",
      data: {
        counter_code: data.counter_code,
        record_status: "A",
        counter_description: data.counter_description,
        arabic_name: data.arabic_name,
        counter_status: data.counter_status,
        hims_d_counter_id: data.hims_d_counter_id
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });
          this.getCounters();
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "error"
        });
      }
    });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  render() {
    return (
      <div className="counter">
        <div className="col-lg-12">
          <form action="none">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "counter_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "counter_code",
                  value: this.state.counter_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "counter_description",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "counter_description",
                  value: this.state.counter_description,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "arabic_name",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "arabic_name",
                  value: this.state.arabic_name,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />

              <div className="col-lg-3 margin-top-15">
                <button
                  type="submit"
                  onClick={this.addCounter.bind(this)}
                  className="btn btn-primary"
                >
                  Add to List
                </button>
              </div>
            </div>
          </form>
          <div className="form-details" data-validate="counterDiv">
            <AlgaehDataGrid
              datavalidate="data-validate='counterDiv'"
              id="appt-status-grid"
              columns={[
                {
                  fieldName: "counter_code",
                  label: <AlgaehLabel label={{ fieldName: "counter_code" }} />,
                  disabled: true
                },
                {
                  fieldName: "counter_description",
                  label: (
                    <AlgaehLabel label={{ fieldName: "counter_description" }} />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "counter_description",
                          value: row.counter_description,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Description - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "arabic_name",
                  label: <AlgaehLabel label={{ fieldName: "arabic_name" }} />,
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "arabic_name",
                          value: row.arabic_name,
                          events: {
                            onChange: this.changeGridEditors.bind(this, row)
                          },
                          others: {
                            errormessage: "Arabic Name - cannot be blank",
                            required: true
                          }
                        }}
                      />
                    );
                  }
                },
                {
                  fieldName: "counter_status",
                  label: (
                    <AlgaehLabel label={{ fieldName: "counter_status" }} />
                  ),
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.counter_status === "A" ? "Active" : "Inactive"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "counter_status",
                          className: "select-fld",
                          value: row.counter_status,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: GlobalVariables.FORMAT_STATUS
                          },
                          others: {
                            errormessage: "Status - cannot be blank",
                            required: true
                          },
                          onChange: this.changeGridEditors.bind(this, row)
                        }}
                      />
                    );
                  }
                }
              ]}
              keyId="hims_d_counter_id"
              dataSource={{
                data: this.state.counters
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteCounters.bind(this),
                onDone: this.updatecounters.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Counter;
