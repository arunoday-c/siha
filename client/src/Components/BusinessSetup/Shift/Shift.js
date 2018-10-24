import React, { Component } from "react";
import "./shift.css";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

class Shift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: []
    };
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

  addShift() {
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

  deleteShifts() {}

  updateShifts() {}

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
    this.refreshState();
  }

  render() {
    return (
      <div className="shift">
        <div className="col-lg-12">
          <form>
            <div className="row" onSubmit={this.addShift.bind(this)}>
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "shift_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "shft_code",
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
                  name: "shft_code",
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
                <button type="submit" className="btn btn-primary">
                  Add to List
                </button>
              </div>
            </div>

            <div className="form-details">
              <AlgaehDataGrid
                id="appt-status-grid"
                columns={[
                  {
                    fieldName: "shift_code",
                    label: <AlgaehLabel label={{ fieldName: "shift_code" }} />,
                    editorTemplate: row => {
                      return (
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          textBox={{
                            className: "txt-fld",
                            name: "shift_code",
                            value: row.shift_code,
                            events: {
                              onChange: this.changeGridEditors.bind(this, row)
                            }
                          }}
                        />
                      );
                    }
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
                            }
                          }}
                        />
                      );
                    }
                  },
                  {
                    fieldName: "shift_status",
                    label: <AlgaehLabel label={{ fieldName: "shift_status" }} />
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
          </form>
        </div>
      </div>
    );
  }
}

export default Shift;
