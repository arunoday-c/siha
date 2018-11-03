import React, { Component } from "react";
import "./shift.css";
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

class Shift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: []
    };
  }

  clearState() {
    this.setState({
      shift_code: "",
      shift_description: "",
      arabic_name: ""
    });
  }

  getShifts() {
    algaehApiCall({
      uri: "/shiftAndCounter/getShiftMaster",
      method: "GET",
      data: {},
      onSuccess: response => {
        if (response.data.success) {
          this.setState({ shifts: response.data.records });
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
    this.getShifts();
  }

  addShift(e) {
    e.preventDefault();

    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        algaehApiCall({
          uri: "/shiftAndCounter/addShiftMaster",
          method: "POST",
          data: {
            shift_code: this.state.shift_code,
            shift_description: this.state.shift_description,
            arabic_name: this.state.arabic_name
          },
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Shift added Successfully",
                type: "success"
              });

              this.getShifts();
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

  deleteShifts(data) {
    swal({
      title: "Delete the Shift " + data.shift_description + "?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#",
      cancelButtonColor: "#d33",
      cancelButtonText: "No"
    }).then(willDelete => {
      if (willDelete.value) {
        algaehApiCall({
          uri: "/shiftAndCounter/updateShiftMaster",
          data: {
            shift_code: data.shift_code,
            record_status: "I",
            shift_description: data.shift_description,
            arabic_name: data.arabic_name,
            shift_status: data.shift_status,
            hims_d_shift_id: data.hims_d_shift_id
          },
          method: "PUT",
          onSuccess: response => {
            if (response.data.success) {
              swalMessage({
                title: "Record deleted successfully . .",
                type: "success"
              });

              this.getShifts();
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

  updateShifts(data) {
    algaehApiCall({
      uri: "/shiftAndCounter/updateShiftMaster",
      data: {
        shift_code: data.shift_code,
        record_status: "A",
        shift_description: data.shift_description,
        arabic_name: data.arabic_name,
        shift_status: data.shift_status,
        hims_d_shift_id: data.hims_d_shift_id
      },
      method: "PUT",
      onSuccess: response => {
        if (response.data.success) {
          swalMessage({
            title: "Record updated successfully . .",
            type: "success"
          });

          this.getShifts();
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

  refreshState() {
    this.setState({ ...this.state });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
    //this.refreshState();
  }

  render() {
    return (
      <div className="shift">
        <div className="col-lg-12">
          <form action="none">
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "shift_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "shift_code",
                  value: this.state.shift_code,
                  events: {
                    onChange: this.changeTexts.bind(this)
                  }
                }}
              />
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "shift_description",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "shift_description",
                  value: this.state.shift_description,
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
                  onClick={this.addShift.bind(this)}
                  className="btn btn-primary"
                >
                  Add to List
                </button>
              </div>
            </div>
          </form>
          <div className="form-details" data-validate="shiftDiv">
            <AlgaehDataGrid
              id="shift-grid"
              datavalidate="data-validate='shiftDiv'"
              columns={[
                {
                  fieldName: "shift_code",
                  label: <AlgaehLabel label={{ fieldName: "shift_code" }} />,
                  disabled: true
                  // editorTemplate: row => {
                  //   return (
                  //     <AlagehFormGroup
                  //       div={{ className: "col" }}
                  //       textBox={{
                  //         className: "txt-fld",
                  //         name: "shift_code",
                  //         value: row.shift_code,
                  //         events: {
                  //           onChange: this.changeGridEditors.bind(this, row)
                  //         }
                  //       }}
                  //     />
                  //   );
                  // }
                },
                {
                  fieldName: "shift_description",
                  label: (
                    <AlgaehLabel label={{ fieldName: "shift_description" }} />
                  ),
                  editorTemplate: row => {
                    return (
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "shift_description",
                          value: row.shift_description,
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
                  fieldName: "shift_status",
                  label: <AlgaehLabel label={{ fieldName: "shift_status" }} />,
                  displayTemplate: row => {
                    return (
                      <span>
                        {row.shift_status === "A" ? "Active" : "Inactive"}
                      </span>
                    );
                  },
                  editorTemplate: row => {
                    return (
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        selector={{
                          name: "shift_status",
                          className: "select-fld",
                          value: row.shift_status,
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
              keyId="hims_d_shift_id"
              dataSource={{
                data: this.state.shifts
              }}
              isEditable={true}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onEdit: () => {},
                onDelete: this.deleteShifts.bind(this),
                onDone: this.updateShifts.bind(this)
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Shift;
