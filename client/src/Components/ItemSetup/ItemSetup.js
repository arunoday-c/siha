import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Edit from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

// import Enumerable from "linq";
import "./ItemSetup.css";
import "../../styles/site.css";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";

import ItemMaster from "./ItemMaster/ItemMaster";
import { AlgaehActions } from "../../actions/algaehActions";
import { getItems, EditItemMaster } from "./ItemSetupEvent";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import AppBar from "@material-ui/core/AppBar";

class ItemSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      itemPop: {},
      addNew: true,
      ItemList: []
    };
  }

  componentDidMount() {
    this.props.getItemCategory({
      uri: "/pharmacy/getItemCategory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "itemcategory"
      }
    });

    this.props.getItemGroup({
      uri: "/pharmacy/getItemGroup",
      method: "GET",
      redux: {
        type: "ITEM_GROUOP_GET_DATA",
        mappingName: "itemgroup"
      }
    });

    this.props.getItemUOM({
      uri: "/pharmacy/getPharmacyUom",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "itemuom"
      }
    });

    this.props.getItemGeneric({
      uri: "/pharmacy/getItemGeneric",
      method: "GET",
      redux: {
        type: "ITEM_GENERIC_GET_DATA",
        mappingName: "itemgeneric"
      }
    });

    this.props.getItemForm({
      uri: "/pharmacy/getItemForm",
      method: "GET",
      redux: {
        type: "ITEM_FORM_GET_DATA",
        mappingName: "itemform"
      }
    });

    this.props.getItemStorage({
      uri: "/pharmacy/getItemStorage",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "itemstorage"
      }
    });

    if (
      this.props.itemservices === undefined ||
      this.props.itemservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "itemservices"
        }
      });
    }

    getItems(this, this);
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      itemPop: {}
    });
  }

  render() {
    return (
      <div className="hims_item_setup">
        <BreadCrumb
          title={
            <AlgaehLabel label={{ fieldName: "item_setup", align: "ltr" }} />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "item_settings",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "item_setup", align: "ltr" }}
                />
              )
            }
          ]}
        />
        <div className="hims_item_setup">
          <div
            className="portlet portlet-bordered box-shadow-normal margin-bottom-15"
            style={{ marginTop: 50 }}
          >
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Item List</h3>
              </div>
              <div className="actions">
                <a
                  href="javascript:;"
                  className="btn btn-primary btn-circle active"
                  onClick={this.ShowModel.bind(this)}
                >
                  <i className="fas fa-plus" />
                </a>
                <ItemMaster
                  HeaderCaption={
                    <AlgaehLabel
                      label={{
                        fieldName: "item_setup",
                        align: "ltr"
                      }}
                    />
                  }
                  open={this.state.isOpen}
                  onClose={this.ShowModel.bind(this)}
                  itemPop={this.state.itemPop}
                  addNew={this.state.addNew}
                />
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-lg-12" id="itemSetupGrid">
                  <AlgaehDataGrid
                    id="item_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ fieldName: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                className="fas fa-pen"
                                onClick={EditItemMaster.bind(this, this, row)}
                              />
                            </span>
                          );
                        },
                        others: {
                          style: {
                            textAlign: "center"
                          }
                        }
                      },
                      {
                        fieldName: "item_description",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "item_description" }}
                          />
                        ),
                        others: {
                          minWdith: 300
                          // style: {
                          //   textAlign: "center"
                          // }
                        }
                      },
                      {
                        fieldName: "generic_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "generic_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.itemgeneric === undefined
                              ? []
                              : this.props.itemgeneric.filter(
                                  f =>
                                    f.hims_d_item_generic_id === row.generic_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].generic_name
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "category_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "category_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.itemcategory === undefined
                              ? []
                              : this.props.itemcategory.filter(
                                  f =>
                                    f.hims_d_item_category_id ===
                                    row.category_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].category_desc
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "group_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "group_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.itemgroup === undefined
                              ? []
                              : this.props.itemgroup.filter(
                                  f => f.hims_d_item_group_id === row.group_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].group_description
                                : ""}
                            </span>
                          );
                        }
                      },

                      {
                        fieldName: "purchase_uom_id",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "purchase_uom_id" }}
                          />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.itemuom === undefined
                              ? []
                              : this.props.itemuom.filter(
                                  f =>
                                    f.hims_d_pharmacy_uom_id ===
                                    row.purchase_uom_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].uom_description
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "sales_uom_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "sales_uom_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.itemuom === undefined
                              ? []
                              : this.props.itemuom.filter(
                                  f =>
                                    f.hims_d_pharmacy_uom_id ===
                                    row.purchase_uom_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].uom_description
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "stocking_uom_id",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "stocking_uom_id" }}
                          />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.itemuom === undefined
                              ? []
                              : this.props.itemuom.filter(
                                  f =>
                                    f.hims_d_pharmacy_uom_id ===
                                    row.stocking_uom_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].uom_description
                                : ""}
                            </span>
                          );
                        }
                      },
                      // {
                      //   fieldName: "item_uom_id",
                      //   label: <AlgaehLabel label={{ fieldName: "item_uom_id" }} />,
                      //   displayTemplate: row => {
                      //     let display =
                      //       this.props.itemuom === undefined
                      //         ? []
                      //         : this.props.itemuom.filter(
                      //             f => f.hims_d_pharmacy_uom_id === row.item_uom_id
                      //           );

                      //     return (
                      //       <span>
                      //         {display !== undefined && display.length !== 0
                      //           ? display[0].uom_description
                      //           : ""}
                      //       </span>
                      //     );
                      //   }
                      // },

                      {
                        fieldName: "item_status",
                        label: (
                          <AlgaehLabel label={{ fieldName: "item_status" }} />
                        ),
                        displayTemplate: row => {
                          return row.item_status === "A"
                            ? "Active"
                            : "Inactive";
                        }
                      }
                    ]}
                    keyId="hims_d_item_master_id"
                    dataSource={{
                      data: this.state.ItemList
                    }}
                    filter={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Start */}

          {/* <div className="hptl-phase1-footer">
            <AppBar position="static" className="main">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.ShowModel.bind(this)}
                  >
                    
                    Add New
                  </button>

                </div>
              </div>
            </AppBar>
          </div> 
*/}

          {/* Footer End */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemlist: state.itemlist,
    itemcategory: state.itemcategory,
    itemgroup: state.itemgroup,
    itemuom: state.itemuom,
    itemgeneric: state.itemgeneric,
    itemform: state.itemform,
    itemstorage: state.itemstorage,
    itemservices: state.itemservices
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemMaster: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getItemGeneric: AlgaehActions,
      getItemForm: AlgaehActions,
      getItemStorage: AlgaehActions,
      getServices: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemSetup)
);
