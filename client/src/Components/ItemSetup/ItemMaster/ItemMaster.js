import React, { Component } from "react";
import ItemDetails from "./ItemDetails/ItemDetails";
import "./../../../styles/site.scss";
import "./ItemMaster.scss";
import {
  AlgaehLabel,
  AlgaehModalPopUp,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import ButtonType from "../../Wrapper/algaehButton";
import ItemSetup from "../../../Models/ItemSetup";
import { InsertUpdateItems } from "./ItemMasterEvents";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
// import "./ItemDetails.scss";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import {
  radioChange,
  BatchExpRequired,
  CptCodesSearch,
  VatAppilicable,
  texthandle,
  AddUom,
  deleteUOM,
  updateUOM,
  onchangegridcol,
  uomtexthandle,
  stockingtexthandle,
  stockonchangegridcol,
  additionaleInfo,
  numberEventHandaler
} from "./ItemDetailsEvents";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class ItemMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchexpreq: false,
      item_code_placeHolder: "",

      uom_id: null,
      stocking_uom: null,
      conversion_factor: 0,
      convertEnable: false,
      loading_itemInsert: false
    };
    this.initCall();
  }

  initCall() {
    let that = this;
    algaehApiCall({
      uri: "/init/",
      method: "GET",
      data: {
        fields: "item_code",
        tableName: "hims_d_item_master",
        keyFieldName: "hims_d_item_master_id"
      },
      onSuccess: response => {
        if (response.data.success === true) {
          const placeHolder =
            response.data.records.length > 0 ? response.data.records[0] : {};
          that.setState({
            item_code_placeHolder: placeHolder.item_code
          });
        }
      }
    });
  }

  onClose = e => {
    let IOputs = ItemSetup.inputParam();
    this.setState({ ...this.state, ...IOputs });
    this.props.onClose && this.props.onClose(false);
  };

  componentWillMount() {
    let IOputs = ItemSetup.inputParam();
    this.setState({ ...this.state, ...IOputs });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.itemPop.hims_d_item_master_id !== undefined) {
      let IOputs = newProps.itemPop;
      this.setState({ ...this.state, ...IOputs });
    }
  }

  render() {
    return (
      <div className="hptl-phase1-Display-patient-details">
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.open}
        >
          <div className="popupInner" data-validate="ItemMaster">
            <div className="col-12 popRightDiv">
              <div className="row">
                <div className="col-6">
                  <div className="row">
                    {/* Patient code */}
                    <AlagehFormGroup
                      div={{ className: "col-3 mandatory form-group" }}
                      label={{
                        fieldName: "item_code",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "item_code",
                        value: this.state.item_code,
                        others: {
                          placeholder: this.state.item_code_placeHolder
                        },
                        events: {
                          onChange: texthandle.bind(this, this)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-5 mandatory form-group" }}
                      label={{
                        fieldName: "item_description",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "item_description",
                        value: this.state.item_description,
                        events: {
                          onChange: texthandle.bind(this, this)
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-4 mandatory form-group" }}
                      label={{
                        fieldName: "generic_id",
                        isImp: true
                      }}
                      selector={{
                        name: "generic_id",
                        className: "select-fld",
                        value: this.state.generic_id,
                        dataSource: {
                          textField: "generic_name",
                          valueField: "hims_d_item_generic_id",
                          data: this.props.itemgeneric
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                    <AlagehAutoComplete
                      div={{
                        className: "col-4 mandatory  form-group "
                      }}
                      label={{
                        fieldName: "category_id",
                        isImp: true
                      }}
                      selector={{
                        name: "category_id",
                        className: "select-fld",
                        value: this.state.category_id,
                        dataSource: {
                          textField: "category_desc",
                          valueField: "hims_d_item_category_id",
                          data: this.props.itemcategory
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-4 mandatory form-group" }}
                      label={{
                        fieldName: "group_id",
                        isImp: true
                      }}
                      selector={{
                        name: "group_id",
                        className: "select-fld",
                        value: this.state.group_id,
                        dataSource: {
                          textField: "group_description",
                          valueField: "hims_d_item_group_id",
                          data: this.props.itemgroup
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-4 form-group" }}
                      label={{
                        forceLabel: "SFDA"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "sfda_code",
                        value: this.state.sfda_code,
                        events: {
                          onChange: texthandle.bind(this, this)
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-4 form-group" }}
                      label={{
                        fieldName: "form_id"
                      }}
                      selector={{
                        name: "form_id",
                        className: "select-fld",
                        value: this.state.form_id,
                        dataSource: {
                          textField: "form_description",
                          valueField: "hims_d_item_form_id",
                          data: this.props.itemform
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-4  form-group " }}
                      label={{
                        fieldName: "storage_id"
                      }}
                      selector={{
                        name: "storage_id",
                        className: "select-fld",
                        value: this.state.storage_id,
                        dataSource: {
                          textField: "storage_description",
                          valueField: "hims_d_item_storage_id",
                          data: this.props.itemstorage
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                    <div className="col-6">
                      <label>Item Currently </label>
                      <div className="customRadio" style={{ borderBottom: 0 }}>
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="Active"
                            checked={this.state.radioActive}
                            onChange={radioChange.bind(this, this)}
                          />
                          <span>
                            <AlgaehLabel
                              label={{
                                fieldName: "active"
                              }}
                            />
                          </span>
                        </label>
                        <label className="radio inline">
                          <input
                            type="radio"
                            value="Inactive"
                            checked={this.state.radioInactive}
                            onChange={radioChange.bind(this, this)}
                          />
                          <span>
                            <AlgaehLabel
                              label={{
                                fieldName: "inactive"
                              }}
                            />
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="col-3">
                      <label>Expiry Date</label>
                      <div
                        className="customCheckbox"
                        style={{ borderBottom: 0 }}
                      >
                        <label
                          className="checkbox"
                          style={{ color: "#212529" }}
                        >
                          <input
                            type="checkbox"
                            name="exp_date_not_required"
                            checked={
                              this.state.exp_date_not_required === "Y"
                                ? true
                                : false
                            }
                            onChange={BatchExpRequired.bind(this, this)}
                          />
                          <span>Not Required</span>
                        </label>
                      </div>
                    </div>
                    <AlagehFormGroup
                      div={{ className: "col-3 form-group" }}
                      label={{
                        forceLabel: "Reorder Quantity",
                        isImp: true
                      }}
                      textBox={{
                        number: {
                          allowNegative: false,
                          thousandSeparator: ","
                        },
                        className: "txt-fld",
                        name: "reorder_qty",
                        value: this.state.reorder_qty,
                        dontAllowKeys: ["-", "e", "."],
                        events: {
                          onChange: numberEventHandaler.bind(this, this)
                        },
                        others: {
                          type: "number"
                        }
                      }}
                    />

                    <div className="col-12">
                      <div className="row">
                        <div className="col-6">
                          <AlgaehLabel
                            label={{ fieldName: "vat_applicable" }}
                          />
                          <div className=" customCheckbox ">
                            <label className="checkbox inline">
                              <input
                                type="checkbox"
                                name="vat_applicable"
                                value="Y"
                                checked={
                                  this.state.vat_applicable === "Y"
                                    ? true
                                    : false
                                }
                                onChange={VatAppilicable.bind(this, this)}
                              />
                              <span>Yes</span>
                            </label>
                          </div>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            fieldName: "vat_percent"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            className: "txt-fld",
                            name: "vat_percent",
                            value: this.state.vat_percent,
                            events: {
                              onChange: numberEventHandaler.bind(this, this)
                            },
                            others: {
                              disabled:
                                this.state.vat_applicable === "Y" ? false : true
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-12  form-group">
                      <AlgaehLabel
                        label={{ forceLabel: "Additional Information" }}
                      />
                      <textarea
                        value={this.state.addl_information || ""}
                        name="addl_information"
                        onChange={additionaleInfo.bind(this, this)}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="col-6"
                  style={{ borderLeft: "1px solid #dededf" }}
                >
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        fieldName: "uom_id"
                      }}
                      selector={{
                        name: "uom_id",
                        className: "select-fld",
                        value: this.state.uom_id,
                        dataSource: {
                          textField: "uom_description",
                          valueField: "hims_d_pharmacy_uom_id",
                          data: this.props.itemuom
                        },
                        onChange: uomtexthandle.bind(this, this),
                        others: {
                          exclude: "true"
                        }
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-3" }}
                      label={{
                        fieldName: "stocking_uom"
                      }}
                      selector={{
                        name: "stocking_uom",
                        className: "select-fld",
                        value: this.state.stocking_uom,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: GlobalVariables.FORMAT_YESNO
                        },
                        onChange: stockingtexthandle.bind(this, this),
                        others: {
                          exclude: "true"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col" }}
                      label={{
                        fieldName: "conversion_factor"
                      }}
                      textBox={{
                        number: {
                          allowNegative: false,
                          thousandSeparator: ","
                        },
                        className: "txt-fld",
                        name: "conversion_factor",
                        value: this.state.conversion_factor,
                        dontAllowKeys: ["-", "e", "."],
                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          disabled: this.state.convertEnable,
                          exclude: "true"
                        }
                      }}
                    />

                    <div className="col actions" style={{ paddingLeft: 0 }}>
                      <a
                        onClick={AddUom.bind(this, this)}
                        style={{ marginTop: 19 }}
                        className="btn btn-primary btn-circle active"
                      >
                        <i className="fas fa-plus" />
                      </a>
                    </div>
                  </div>

                  <div className="row" style={{ marginBottom: 10 }}>
                    <div className="col-lg-12" id="itemSetupPopGrid">
                      <AlgaehDataGrid
                        id="UOM_stck"
                        columns={[
                          {
                            fieldName: "action",
                            label: (
                              <AlgaehLabel label={{ fieldName: "action" }} />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>
                                  <i
                                    className="fa fa-trash-alt"
                                    aria-hidden="true"
                                    onClick={deleteUOM.bind(this, this, row)}
                                  />
                                </span>
                              );
                            },
                            others: {
                              maxWidth: 60,
                              style: {
                                textAlign: "center"
                              }
                            }
                          },
                          {
                            fieldName: "uom_id",
                            label: (
                              <AlgaehLabel label={{ fieldName: "uom_id" }} />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.itemuom === undefined
                                  ? []
                                  : this.props.itemuom.filter(
                                      f =>
                                        f.hims_d_pharmacy_uom_id === row.uom_id
                                    );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].uom_description
                                    : ""}
                                </span>
                              );
                            },
                            editorTemplate: row => {
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "uom_id",
                                    className: "select-fld",
                                    value: row.uom_id,
                                    dataSource: {
                                      textField: "uom_description",
                                      valueField: "hims_d_pharmacy_uom_id",
                                      data: this.props.itemuom
                                    },
                                    others: {
                                      disabled: true
                                    },
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,

                                      row
                                    )
                                  }}
                                />
                              );
                            },
                            others: {
                              style: {
                                textAlign: "center"
                              }
                            }
                          },

                          {
                            fieldName: "conversion_factor",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "conversion_factor" }}
                              />
                            ),
                            editorTemplate: row => {
                              return (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    value: row.conversion_factor,
                                    className: "txt-fld",
                                    name: "conversion_factor",
                                    others: {
                                      disabled: true
                                    },
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,

                                        row
                                      )
                                    }
                                  }}
                                />
                              );
                            },
                            others: {
                              style: {
                                textAlign: "center"
                              }
                            }
                          },
                          {
                            fieldName: "stocking_uom",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "stocking_uom" }}
                              />
                            ),
                            displayTemplate: row => {
                              return row.stocking_uom === "N" ? "No" : "Yes";
                            },
                            editorTemplate: row => {
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "stocking_uom",
                                    className: "select-fld",
                                    value: row.stocking_uom,
                                    dataSource: {
                                      textField: "name",
                                      valueField: "value",
                                      data: GlobalVariables.FORMAT_YESNO
                                    },
                                    others: {
                                      disabled: true
                                    },
                                    onChange: stockonchangegridcol.bind(
                                      this,
                                      this,

                                      row
                                    )
                                  }}
                                />
                              );
                            },
                            others: {
                              style: {
                                textAlign: "center"
                              }
                            }
                          }
                        ]}
                        keyId="service_type_id"
                        dataSource={{
                          data: this.state.detail_item_uom
                        }}
                        paging={{ page: 0, rowsPerPage: 5 }}
                        events={{
                          onDelete: deleteUOM.bind(this, this),
                          onEdit: row => {},
                          onDone: updateUOM.bind(this, this)
                        }}
                      />
                    </div>
                  </div>
                  <small>
                    Add UOM in above table to show the list in dropdown
                  </small>
                  <hr style={{ marginTop: 0 }} />
                  <div className="row">
                    {/* Patient code */}

                    <AlagehAutoComplete
                      div={{ className: "col-4 mandatory form-group" }}
                      label={{
                        fieldName: "purchase_uom_id",
                        isImp: true
                      }}
                      selector={{
                        name: "purchase_uom_id",
                        className: "select-fld",
                        value: this.state.purchase_uom_id,
                        dataSource: {
                          textField: "uom_description",
                          valueField: "uom_id",
                          data: this.state.detail_item_uom
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                      //forceUpdate={true}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-4 mandatory form-group" }}
                      label={{
                        fieldName: "sales_uom_id",
                        isImp: true
                      }}
                      selector={{
                        name: "sales_uom_id",
                        className: "select-fld",
                        value: this.state.sales_uom_id,
                        dataSource: {
                          textField: "uom_description",
                          valueField: "uom_id",
                          data: this.state.detail_item_uom
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-4 mandatory form-group " }}
                      label={{
                        fieldName: "stocking_uom_id",
                        isImp: true
                      }}
                      selector={{
                        name: "stocking_uom_id",
                        className: "select-fld",
                        value: this.state.stocking_uom_id,
                        dataSource: {
                          textField: "uom_description",
                          valueField: "hims_d_pharmacy_uom_id",
                          data: this.props.itemuom
                        },
                        onChange: texthandle.bind(this, this),
                        others: {
                          disabled: true
                        }
                      }}
                    />
                    {/*<AlagehAutoComplete
                      div={{ className: "col-4" }}
                      label={{
                        fieldName: "item_uom_id"
                      }}
                      selector={{
                        name: "item_uom_id",
                        className: "select-fld",
                        value: this.state.item_uom_id,
                        dataSource: {
                          textField: "uom_description",
                          valueField: "uom_id",
                          data: this.state.detail_item_uom
                        }
                      }}
                    />*/}

                    <AlagehFormGroup
                      div={{ className: "col-4 mandatory form-group" }}
                      label={{
                        fieldName: "purchase_cost",
                        isImp: true
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "purchase_cost",
                        value: this.state.purchase_cost,
                        others: {
                          min: 0
                        },
                        events: {
                          onChange: numberEventHandaler.bind(this, this)
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-4 mandatory form-group" }}
                      label={{
                        fieldName: "price"
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "standard_fee",
                        value: this.state.standard_fee
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4"> &nbsp;</div>

                <div className="col-lg-8">
                  {/*<button
                    onClick={InsertUpdateItems.bind(this, this)}
                    type="button"
                    className="btn btn-primary"
                  >
                    {this.state.hims_d_item_master_id === null ? (
                      <AlgaehLabel label={{ fieldName: "btnSave" }} />
                    ) : (
                      <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                    )}
                  </button>*/}

                  <ButtonType
                    classname="btn btn-primary"
                    loading={this.state.loading_itemInsert}
                    onClick={InsertUpdateItems.bind(this, this)}
                    label={{
                      forceLabel:
                        this.state.hims_d_item_master_id === null
                          ? "Save"
                          : "Update"
                    }}
                  />

                  <button
                    onClick={e => {
                      this.onClose(e);
                    }}
                    type="button"
                    className="btn btn-default"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patienttype: state.patienttype,
    itemcategory: state.itemcategory,
    itemgroup: state.itemgroup,
    itemgeneric: state.itemgeneric,
    itemform: state.itemform,
    itemstorage: state.itemstorage,
    itemservices: state.itemservices,
    itemuom: state.itemuom,
    itemlist: state.itemlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemGeneric: AlgaehActions,
      getItemForm: AlgaehActions,
      getItemStorage: AlgaehActions,
      getServices: AlgaehActions,
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemMaster)
);
