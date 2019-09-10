import React, { Component } from "react";
import "./PharmacyOptions.css";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables";

export default class PharmacyOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hims_d_pharmacy_options_id: null,
      notification_before: 0,
      notification_type: "D"
    };

    this.getPharmacyOptions();
  }

  getPharmacyOptions() {
    algaehApiCall({
      uri: "/pharmacy/getPharmacyOptions",
      method: "GET",
      module: "pharmacy",
      onSuccess: res => {
        if (res.data.success) {
          this.setState(res.data.records[0]);
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  saveOptions() {
    if (this.state.hims_d_pharmacy_options_id !== null) {
      algaehApiCall({
        uri: "/pharmacy/updatePharmacyOptions",
        module: "pharmacy",
        data: this.state,
        method: "PUT",
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Record Updated Successfully",
              type: "success"
            });
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
        }
      });
    } else {
      algaehApiCall({
        uri: "/pharmacy/addPharmacyOptions",
        module: "pharmacy",
        data: this.state,
        method: "POST",
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Saved Successfully",
              type: "success"
            });
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
        }
      });
    }
  }

  Process() {
    algaehApiCall({
      uri: "/pharmacyGlobal/insertExpiryNotification",
      module: "pharmacy",
      data: this.state,
      method: "POST",
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Saved Successfully",
            type: "success"
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }
  changeTexts(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="row LeaveSalarySetupScreen">
        <div className="col-12">
          <div className="portlet portlet-bordered  transactionSettings">
            <div className="portlet-body">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Notification Before",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "notification_before",
                    value: this.state.notification_before,

                    events: {
                      onChange: this.changeTexts.bind(this)
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-2" }}
                  label={{
                    forceLabel: "Notification Type",
                    isImp: true
                  }}
                  selector={{
                    name: "notification_type",
                    className: "select-fld",
                    value: this.state.notification_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.NOTIFICATION_TYPE
                    },
                    onChange: this.changeTexts.bind(this)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.saveOptions.bind(this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Save", returnText: true }}
                  />
                </button>
                {/*<button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.Process.bind(this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Process", returnText: true }}
                  />
                </button>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
