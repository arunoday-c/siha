import React, { Component } from "react";
import "./InventoryOptions.scss";
import {
  // AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import GlobalVariables from "../../../utils/GlobalVariables";

export default class InventoryOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hims_d_inventory_options_id: null,
      notification_before: 0,
      notification_type: "D",
      requisition_auth_level: "1"
    };

    this.getInventoryOptions();
  }

  getInventoryOptions() {
    algaehApiCall({
      uri: "/inventory/getInventoryOptions",
      method: "GET",
      module: "inventory",
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
    if (this.state.hims_d_inventory_options_id !== null) {
      algaehApiCall({
        uri: "/inventory/updateInventoryOptions",
        module: "inventory",
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
        uri: "/inventory/addInventoryOptions",
        module: "inventory",
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

  changeTexts(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="row" style={{ paddingTop: 15 }}>
        <div className="col-3">
          <div className="portlet portlet-bordered marginBottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  Material Requestion Settings
                </h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col form-group" }}
                  label={{
                    forceLabel: "Requisition Auth level",
                    isImp: false
                  }}
                  selector={{
                    name: "requisition_auth_level",
                    value: this.state.requisition_auth_level,
                    className: "select-fld",
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.AUTH_LEVEL2
                    },
                    onChange: this.changeTexts.bind(this),
                    onClear: () => {
                      this.setState({
                        requisition_auth_level: null
                      });
                    }
                  }}
                />
              </div>
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
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
