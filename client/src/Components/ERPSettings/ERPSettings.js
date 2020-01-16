import React, { Component } from "react";
import "./ERPSettings.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../Wrapper/algaehWrapper";
import GlobalVariables from "../../utils/GlobalVariables";
import {
  changeTexts,
  savePharmacyOptions,
  saveInventoryOptions,
  savePOOptions,
  saveSalesOptions,
  getPharmacyOptions,
  getInventoryOptions,
  getPOOptions,
  getSalesOptions,
  checkBoxEvent
} from "./ERPSettingsEvents";
import { AlgaehOpenContainer } from "../../utils/GlobalFunctions";

export default class ERPSettings extends Component {
  constructor(props) {
    super(props);
    let Activated_Modueles = JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("ModuleDetails"))
    );

    const PROC_Active = Activated_Modueles.filter(f => {
      return f.module_code === "PROC";
    });

    const PHCY_Active = Activated_Modueles.filter(f => {
      return f.module_code === "PHCY";
    });

    const INVTRY_Active = Activated_Modueles.filter(f => {
      return f.module_code === "INVTRY";
    });

    const SALES_Active = Activated_Modueles.filter(f => {
      return f.module_code === "SALES";
    });

    this.PROC_Active = PROC_Active.length > 0 ? true : false;
    this.PHCY_Active = PHCY_Active.length > 0 ? true : false;
    this.INVTRY_Active = INVTRY_Active.length > 0 ? true : false;
    this.SALES_Active = SALES_Active.length > 0 ? true : false;

    debugger;
    this.state = {
      hims_d_pharmacy_options_id: null,
      notification_before: 0,
      notification_type: "D",
      requisition_auth_level: "1",

      hims_d_inventory_options_id: null,
      inv_requisition_auth_level: "1",

      hims_d_procurement_options_id: null,
      po_auth_level: "1",

      hims_d_sales_options_id: null,
      sales_order_auth_level: "1",
      services_required: "N"
    };

    if (this.PHCY_Active) {
      getPharmacyOptions(this, this);
    }

    if (this.INVTRY_Active) {
      getInventoryOptions(this, this);
    }

    if (this.PROC_Active) {
      getPOOptions(this, this);
    }

    if (this.SALES_Active) {
      getSalesOptions(this, this);
    }
  }

  render() {
    return (
      <div className="row" style={{ paddingTop: 15 }}>
        {this.PHCY_Active ? (
          <div className="col-3">
            <div className="portlet portlet-bordered marginBottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Pharmacy Settings</h3>
                </div>
              </div>
              {/* <div className="portlet-title">
                            <div className="caption">
                                <h3 className="caption-subject">Item Notification Settings</h3>
                            </div>
                        </div> */}
              <div className="portlet-body">
                <div className="row">
                  <AlagehFormGroup
                    div={{
                      className: "col-6",
                      others: {
                        style: { paddingRight: 0 }
                      }
                    }}
                    label={{
                      forceLabel: "Notify Expiry Before",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "notification_before",
                      value: this.state.notification_before,

                      events: {
                        onChange: changeTexts.bind(this, this)
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{
                      className: "col-6"
                    }}
                    label={{
                      forceLabel: ".",
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
                      onChange: changeTexts.bind(this, this),
                      onClear: () => {
                        this.setState({
                          notification_type: null
                        });
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group" }}
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
                      onChange: changeTexts.bind(this, this),
                      onClear: () => {
                        this.setState({
                          requisition_auth_level: null
                        });
                      }
                    }}
                  />{" "}
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={savePharmacyOptions.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Save", returnText: true }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {this.INVTRY_Active ? (
          <div className="col-3">
            <div className="portlet portlet-bordered marginBottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Inventory Settings</h3>
                </div>
              </div>
              {/* <div className="portlet-title">
                            <div className="caption">
                                <h3 className="caption-subject">
                                    Material Requestion Settings
                                </h3>
                            </div>
                        </div> */}
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Requisition Auth level",
                      isImp: false
                    }}
                    selector={{
                      name: "inv_requisition_auth_level",
                      value: this.state.inv_requisition_auth_level,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.AUTH_LEVEL2
                      },
                      onChange: changeTexts.bind(this, this),
                      onClear: () => {
                        this.setState({
                          inv_requisition_auth_level: null
                        });
                      }
                    }}
                  />{" "}
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={saveInventoryOptions.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Save", returnText: true }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {this.PROC_Active ? (
          <div className="col-3">
            <div className="portlet portlet-bordered marginBottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Procurement Settings</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Purchase Order Auth level",
                      isImp: false
                    }}
                    selector={{
                      name: "po_auth_level",
                      value: this.state.po_auth_level,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.AUTH_LEVEL2
                      },
                      onChange: changeTexts.bind(this, this),
                      onClear: () => {
                        this.setState({
                          po_auth_level: null
                        });
                      }
                    }}
                  />
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={savePOOptions.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Save", returnText: true }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {this.SALES_Active ? (
          <div className="col-3">
            <div className="portlet portlet-bordered marginBottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Sales Settings</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-12 form-group" }}
                    label={{
                      forceLabel: "Sales Order Auth level",
                      isImp: false
                    }}
                    selector={{
                      name: "sales_order_auth_level",
                      value: this.state.sales_order_auth_level,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.AUTH_LEVEL2
                      },
                      onChange: changeTexts.bind(this, this),
                      onClear: () => {
                        this.setState({
                          sales_order_auth_level: null
                        });
                      }
                    }}
                  />

                  <div
                    className="col-12 customCheckbox"
                    style={{ marginTop: 23, border: "none" }}
                  >
                    <label className="checkbox inline">
                      <input
                        type="checkbox"
                        name="services_required"
                        value={this.state.services_required}
                        checked={
                          this.state.services_required === "Y" ? true : false
                        }
                        onChange={checkBoxEvent.bind(this, this)}
                      />
                      <span>
                        <AlgaehLabel
                          label={{ forceLabel: "Sales Services Required" }}
                        />
                      </span>
                    </label>
                  </div>
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={saveSalesOptions.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Save", returnText: true }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
