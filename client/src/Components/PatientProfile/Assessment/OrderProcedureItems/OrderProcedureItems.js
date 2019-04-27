import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import moment from "moment";
import "./OrderProcedureItems.css";
import "../../../../styles/site.css";
import {
  AlgaehLabel,
  //   AlagehFormGroup,
  //   AlagehAutoComplete,
  //   AlgaehDateHandler,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import _ from "lodash";

// import { getLabelFromLanguage } from "../../utils/GlobalFunctions";

// import {
//   texthandle,
//   datehandle,
//   cashtexthandle,
//   cardtexthandle,
//   chequetexthandle,
//   checkcashhandaler,
//   checkcardhandaler,
//   checkcheckhandaler,
//   Validations,
//   countertexthandle,
//   getCashiersAndShiftMAP
// } from "./AdvanceModalHandaler";

// import AlgaehLoader from "../Wrapper/fullPageLoader";
// import { getAmountFormart } from "../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall.js";
import { AlgaehActions } from "../../../../actions/algaehActions";

class OrderProcedureItems extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inventory_location_id: null
    };
    this.getDepartments();
  }
  getDepartments() {
    algaehApiCall({
      uri: "/department/get/subdepartment",

      method: "GET",
      module: "masterSettings",
      onSuccess: response => {
        if (response.data.success === true) {
          const Departmant_Location = _.filter(response.data.records, f => {
            return (
              f.hims_d_sub_department_id ===
              this.props.patient_profile[0].sub_department_id
            );
          });

          this.setState({
            inventory_location_id: Departmant_Location[0].inventory_location_id
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

    if (
      this.props.inventorylocations === undefined ||
      this.props.inventorylocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventory/getInventoryLocation",
        module: "inventory",
        data: {
          location_status: "A"
        },
        method: "GET",
        redux: {
          type: "LOCATIONS_GET_DATA",
          mappingName: "inventorylocations"
        }
      });
    }
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    debugger;
    let Location_name =
      this.props.inventorylocations !== undefined &&
      this.props.inventorylocations.length > 0
        ? _.filter(this.props.inventorylocations, f => {
            return (
              f.hims_d_inventory_location_id ===
              this.state.inventory_location_id
            );
          })
        : null;

    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Procedure Items"
            openPopup={this.props.show}
          >
            <div className="row">
              <div className="col-lg-12 popupInner">
                <div className="popRightDiv">
                  <div className="row">
                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Code"
                        }}
                      />
                      <h6>
                        {this.props.inputsparameters.patient_code
                          ? this.props.inputsparameters.patient_code
                          : "Patient Code"}
                      </h6>
                    </div>
                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Name"
                        }}
                      />
                      <h6>
                        {this.props.inputsparameters.full_name
                          ? this.props.inputsparameters.full_name
                          : "Patient Name"}
                      </h6>
                    </div>

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Procedure Name"
                        }}
                      />
                      <h6>
                        {this.props.inputsparameters.procedure_name
                          ? this.props.inputsparameters.procedure_name
                          : "Procedure Name"}
                      </h6>
                    </div>

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Location Name"
                        }}
                      />
                      <h6>
                        {Location_name !== null
                          ? Location_name[0].location_description
                          : "Location Name"}
                      </h6>
                    </div>
                  </div>
                  <hr style={{ margin: "0rem" }} className="margin-bottom-15" />
                  <div className="row">
                    <div className="col-6">
                      <h4
                        style={{
                          marginTop: 32
                        }}
                      >
                        Existing Items
                      </h4>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col-8" }}
                          label={{ forceLabel: "Select Items", isImp: false }}
                          selector={{
                            name: "",
                            className: "select-fld",
                            dataSource: {},
                            others: {}
                          }}
                        />
                        <div className="col">
                          {" "}
                          <button
                            className="btn btn-primary"
                            style={{ float: "right", marginTop: 19 }}
                          >
                            Add New Item
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-6" id="ExisitingItemsGrid_Cntr">
                      <AlgaehDataGrid
                        id="ExisitingItemsGrid"
                        datavalidate="ExisitingItemsGrid"
                        columns={[
                          {
                            fieldName: "actionCheck",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Select" }} />
                            ),
                            others: { maxWidth: 60, align: "center" }
                          },
                          {
                            fieldName: "itemID",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Code" }}
                              />
                            ),
                            others: { maxWidth: 100, align: "center" }
                          },
                          {
                            fieldName: "ItemName",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Name" }}
                              />
                            )
                          },
                          {
                            fieldName: "QtyItem",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Qty" }} />
                            ),
                            others: { maxWidth: 50, align: "center" }
                          },
                          {
                            fieldName: "BatchItem",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Batch" }} />
                            ),
                            others: { maxWidth: 80, align: "center" }
                          },
                          {
                            fieldName: "itemExpiry",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Expiry" }}
                              />
                            ),
                            others: { maxWidth: 80, align: "center" }
                          },
                          {
                            fieldName: "QtyHand",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Qty in Hand" }}
                              />
                            ),
                            others: { maxWidth: 50, align: "center" }
                          }
                        ]}
                        keyId=""
                        dataSource={{ data: [] }}
                        isEditable={false}
                        paging={{ page: 0, rowsPerPage: 5 }}
                        events={{}}
                        others={{}}
                      />
                    </div>
                    <div className="col-6" id="NewItemsGrid_Cntr">
                      <AlgaehDataGrid
                        id="NewItemsGrid"
                        datavalidate="NewItemsGrid"
                        columns={[
                          {
                            fieldName: "actionCheck",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Select" }} />
                            ),
                            others: { maxWidth: 60, align: "center" }
                          },
                          {
                            fieldName: "itemID",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Code" }}
                              />
                            ),
                            others: { maxWidth: 100, align: "center" }
                          },
                          {
                            fieldName: "ItemName",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Name" }}
                              />
                            )
                          },
                          {
                            fieldName: "QtyItem",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Qty" }} />
                            ),
                            others: { maxWidth: 50, align: "center" }
                          },
                          {
                            fieldName: "BatchItem",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Batch" }} />
                            ),
                            others: { maxWidth: 80, align: "center" }
                          },
                          {
                            fieldName: "itemExpiry",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Expiry" }}
                              />
                            ),
                            others: { maxWidth: 80, align: "center" }
                          },
                          {
                            fieldName: "QtyHand",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Qty in Hand" }}
                              />
                            ),
                            others: { maxWidth: 50, align: "center" }
                          }
                        ]}
                        keyId=""
                        dataSource={{ data: [] }}
                        isEditable={false}
                        paging={{ page: 0, rowsPerPage: 5 }}
                        events={{}}
                        others={{}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button type="button" className="btn btn-primary">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_profile: state.patient_profile,
    inventorylocations: state.inventorylocations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderProcedureItems)
);
