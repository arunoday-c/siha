import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehModalPopUp,
} from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall";

class ItemLocationReorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location_id: null,
      reorder_locations: [],
      reorder_qty: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.item_id !== undefined) {
      this.setState({ reorder_locations: newProps.reorder_locations });
    }
  }

  textHandeler(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  dropDownHandler(ctrl, e) {
    e = e || ctrl;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    this.setState({ [name]: value });
  }

  gridtextHandeler(row, ctrl, e) {
    e = e || ctrl;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
    // this.setState({ [name]: value })
  }

  addLocationWiseReorder(e) {
    let reorder_locations = this.state.reorder_locations;

    let location_Exists = reorder_locations.find(
      (f) => f.location_id === this.state.location_id
    );

    if (location_Exists !== undefined) {
      swalMessage({
        type: "warning",
        title: "Selected location alreday defined, Please check in list.",
      });
      return;
    }

    let inputObj = {
      item_id: this.props.item_id,
      location_id: this.state.location_id,
      reorder_qty: this.state.reorder_qty,
    };

    reorder_locations.push(inputObj);

    algaehApiCall({
      uri: "/pharmacy/addLocationReorder",
      module: "pharmacy",
      data: inputObj,
      onSuccess: (response) => {
        if (response.data.success === true) {
          this.setState({
            reorder_locations: reorder_locations,
            location_id: null,
            reorder_qty: 0,
          });
          swalMessage({
            type: "success",
            title: "Added successfully . .",
          });
        }
      },
    });
  }

  updateLocationReorder(row) {
    algaehApiCall({
      uri: "/pharmacy/updateLocationReorder",
      module: "pharmacy",
      method: "PUT",
      data: {
        hims_d_phar_location_reorder_id: row.hims_d_phar_location_reorder_id,
        reorder_qty: row.reorder_qty,
      },
      onSuccess: (response) => {
        if (response.data.success === true) {
          swalMessage({
            type: "success",
            title: "Updated successfully . .",
          });
        }
      },
    });
  }

  onClose = (e) => {
    this.setState(
      {
        location_id: null,
        reorder_locations: [],
        reorder_qty: 0,
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  render() {
    return (
      <div className="ReorderQtyMasterPharmacyScreen">
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this),
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.open}
        >
          <div className="popupInner" data-validate="ItemMaster">
            <div className="col-12 popRightDiv">
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Item Name",
                    }}
                  />
                  <h6>
                    {this.props.item_description
                      ? this.props.item_description
                      : "--------"}
                  </h6>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col-3 form-group" }}
                  label={{ forceLabel: "Select Location", isImp: true }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations,
                      autoComplete: "off",
                    },

                    onChange: this.dropDownHandler.bind(this),
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-3 form-group" }}
                  label={{
                    forceLabel: "Reorder Quantity",
                    isImp: true,
                  }}
                  textBox={{
                    number: {
                      // allowNegative: false,
                      thousandSeparator: ",",
                    },
                    type: "number",
                    className: "txt-fld",
                    name: "reorder_qty",
                    value: this.state.reorder_qty,
                    // dontAllowKeys: ["-", "e", "."],
                    events: {
                      onChange: this.textHandeler.bind(this),
                    },
                  }}
                />

                <div className="col">
                  <button
                    style={{ marginTop: 19 }}
                    className="btn btn-primary"
                    onClick={this.addLocationWiseReorder.bind(this)}
                  >
                    Add to List
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-12" id="ReorderQtyMasterPharmacyGrid_Cntr">
                  <AlgaehDataGrid
                    id="ReorderQtyMasterPharmacyGrid"
                    columns={[
                      {
                        fieldName: "location_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Location" }} />
                        ),
                        displayTemplate: (row) => {
                          let display =
                            this.props.locations === undefined
                              ? []
                              : this.props.locations.filter(
                                  (f) =>
                                    f.hims_d_pharmacy_location_id ===
                                    row.location_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].location_description
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: (row) => {
                          let display =
                            this.props.locations === undefined
                              ? []
                              : this.props.locations.filter(
                                  (f) =>
                                    f.hims_d_pharmacy_location_id ===
                                    row.location_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].location_description
                                : ""}
                            </span>
                          );
                        },
                        others: {
                          minWidth: 150,
                          filterable: true,
                          editable: false,
                        },
                      },
                      {
                        fieldName: "reorder_qty",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Reorder Qty",
                            }}
                          />
                        ),
                        editorTemplate: (row) => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                number: {
                                  allowNegative: false,
                                  thousandSeparator: ",",
                                },
                                className: "txt-fld",
                                name: "reorder_qty",
                                value: row.reorder_qty,
                                dontAllowKeys: ["-", "e", "."],
                                events: {
                                  onChange: this.gridtextHandeler.bind(
                                    this,
                                    row
                                  ),
                                },
                              }}
                            />
                          );
                        },
                        others: {
                          maxWidth: 100,
                          filterable: false,
                        },
                      },
                    ]}
                    keyId=""
                    dataSource={{ data: this.state.reorder_locations }}
                    filter={true}
                    isEditable={true}
                    actions={{
                      allowDelete: false,
                    }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: () => {},
                      onDone: this.updateLocationReorder.bind(this),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4"> &nbsp;</div>

                <div className="col-lg-8">
                  <button
                    onClick={(e) => {
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
    locations: state.locations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ItemLocationReorder)
);
