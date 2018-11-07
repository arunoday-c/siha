import React, { Component } from "react";
import "./user_shift_mapping.css";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import moment from "moment";

class UserShiftMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shifts: [],
      year: moment().year(),
      month: moment().format("M")
    };
    this.getShifts();
  }

  dropDownHandle(value) {
    this.setState({ [value.name]: value.value });
  }

  changeTexts(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getShifts() {
    algaehApiCall({
      uri: "/shiftAndCounter/getShiftMaster",
      //cancelRequestId: "getShiftMasterUM",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          this.setState({
            shifts: response.data.records
          });
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

  render() {
    return (
      <div className="user_shift_mapping">
        <div className="col-lg-12">
          <div className="row">
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Shift Type"
              }}
              selector={{
                name: "hims_d_shift_id",
                className: "select-fld",
                value: this.state.hims_d_shift_id,
                dataSource: {
                  textField: "shift_description",
                  valueField: "hims_d_shift_id",
                  data: this.state.shifts
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Select Month"
              }}
              selector={{
                name: "month",
                className: "select-fld",
                value: this.state.month,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MONTHS
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <AlagehFormGroup
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "year",
                value: this.state.year,
                events: {
                  onChange: this.changeTexts.bind(this)
                },
                others: {
                  type: "number",
                  min: moment().year()
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Select Month"
              }}
              selector={{
                name: "month",
                className: "select-fld",
                value: this.state.month,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MONTHS
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col-lg-3" }}
              label={{
                forceLabel: "Select Month"
              }}
              selector={{
                name: "month",
                className: "select-fld",
                value: this.state.month,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MONTHS
                },
                onChange: this.dropDownHandle.bind(this)
              }}
            />

            <div className="col-lg-3 margin-top-15">
              <button
                //onClick={this.addCounter.bind(this)}
                className="btn btn-primary"
              >
                Add to List
              </button>
            </div>
          </div>
          <div className="form-details" data-validate="usmDiv">
            <AlgaehDataGrid
              datavalidate="data-validate='usmDiv'"
              id="usm-grid"
              columns={[
                { fieldName: "shift_type", label: "Shift Type" },
                { fieldName: "year", label: "Year" }
              ]}
              keyId="hims_d_counter_id"
              dataSource={{
                data: this.state.counters
              }}
              isEditable={true}
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

export default UserShiftMapping;
