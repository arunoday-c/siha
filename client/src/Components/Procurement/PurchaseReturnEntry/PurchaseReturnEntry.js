import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./PurchaseReturnEntry.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  vendortexthandle,
  loctexthandle,
  texthandle,
  poforhandle,
  ReceiptSearch,
  ClearData,
  SavePOReutrnEnrty,
  getCtrlCode,
  PostPOReturnEntry,
  getVendorMaster,
  generatePOReceipt,
  generatePOReceiptNoPrice,
  getData
} from "./PurchaseReturnEntryEvent";
import { AlgaehActions } from "../../../actions/algaehActions";
import POReturnEntry from "../../../Models/POReturnEntry";
import Enumerable from "linq";
import POReturnItemList from "./POReturnItemList/POReturnItemList";
import { MainContext } from "algaeh-react-components/context";
import { AlgaehSecurityComponent, RawSecurityComponent } from "algaeh-react-components";

class PurchaseReturnEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decimal_places: null
    };
    getVendorMaster(this, this);

    RawSecurityComponent({ componentCode: "PUR_RTN_INVENTORY" }).then((result) => {
      if (result === "show") {
        getData(this, "INV")
        this.setState({ po_return_from: "INV" })
      }
    });

    RawSecurityComponent({ componentCode: "PUR_RTN_PHARMACY" }).then((result) => {
      if (result === "show") {
        getData(this, "PHR")
        this.setState({ po_return_from: "PHR" })
      }
    });
  }

  UNSAFE_componentWillMount() {
    let IOputs = POReturnEntry.inputParam();
    this.setState(IOputs);
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    if (
      this.props.purchase_return_number !== undefined &&
      this.props.purchase_return_number.length !== 0
    ) {
      getCtrlCode(this, this.props.purchase_return_number);
    }

    this.setState({
      decimal_places: userToken.decimal_places
    });
  }

  render() {
    const _mainStore =
      this.state.po_return_from === null
        ? []
        : Enumerable.from(this.props.polocations)
          .where(w => w.location_type === "WH")
          .toArray();

    const class_finder =
      this.state.dataFinder === true
        ? " disableFinder"
        : this.state.ReqData === false
          ? ""
          : " disableFinder";

    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Purchase Return Entry", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ forceLabel: "Purchase Return Entry", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "PO Return Number", returnText: true }}
              />
            ),
            value: this.state.purchase_return_number,
            selectValue: "purchase_return_number",
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Purchase.POReturnEntry"
            },
            searchName: "POReturnEntry"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "PO Return Date"
                  }}
                />
                <h6>
                  {this.state.return_date
                    ? moment(this.state.return_date).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.purchase_return_number !== null
              ? {
                menuitems: [
                  {
                    label: "Receipt for Internal",
                    events: {
                      onClick: () => {
                        generatePOReceipt(this.state);
                      }
                    }
                  },
                  {
                    label: "Receipt for Vendor",
                    events: {
                      onClick: () => {
                        generatePOReceiptNoPrice(this.state);
                      }
                    }
                  }
                ]
              }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div className="hims-purchase-order-entry">
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "PO Return For" }}
                  selector={{
                    name: "po_return_from",
                    className: "select-fld",
                    value: this.state.po_return_from,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PO_FROM
                    },
                    others: {
                      disabled: true
                    },
                    onChange: poforhandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        po_return_from: null,
                        ReqData: true,
                        pharmcy_location_id: null,
                        inventory_location_id: null
                      });
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Location Code" }}
                  selector={{
                    name:
                      this.state.po_return_from === "PHR"
                        ? "pharmcy_location_id"
                        : "inventory_location_id",
                    className: "select-fld",
                    value:
                      this.state.po_return_from === "PHR"
                        ? this.state.pharmcy_location_id
                        : this.state.inventory_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField:
                        this.state.po_return_from === "PHR"
                          ? "hims_d_pharmacy_location_id"
                          : "hims_d_inventory_location_id",
                      data: _mainStore
                    },
                    others: {
                      disabled: this.state.dataExitst
                    },
                    onChange: loctexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        location_description: null,
                        pharmcy_location_id: null,
                        inventory_location_id: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Vendor Name" }}
                  selector={{
                    name: "vendor_id",
                    className: "select-fld",
                    value: this.state.vendor_id,
                    dataSource: {
                      textField: "vendor_name",
                      valueField: "hims_d_vendor_id",
                      data: this.props.povendors
                    },
                    others: {
                      disabled: this.state.dataExitst
                    },
                    onChange: vendortexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        vendor_id: null
                      });
                    }
                  }}
                />

                <div className={"col-2 globalSearchCntr" + class_finder}>
                  <AlgaehLabel label={{ forceLabel: "Search Receipt No." }} />
                  <h6 onClick={ReceiptSearch.bind(this, this)}>
                    {this.state.grn_number
                      ? this.state.grn_number
                      : "Receipt No."}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>

                {/* <AlagehFormGroup
                                    div={{ className: "col-2" }}
                                    label={{
                                        forceLabel: "Receipt Number"
                                    }}
                                    textBox={{
                                        value: this.state.grn_number,
                                        className: "txt-fld",
                                        name: "grn_number",

                                        events: {
                                            onChange: null
                                        },
                                        others: {
                                            disabled: true
                                        }
                                    }}
                                />
                                <div
                                    className="col"
                                    style={{
                                        paddingLeft: 0,
                                        paddingRight: 0
                                    }}
                                >
                                    <span
                                        className="fas fa-search fa-2x"
                                        style={{
                                            fontSize: " 1.2rem",
                                            marginTop: 26,
                                            paddingBottom: 0,
                                            pointerEvents:
                                                this.state.dataExitst === true
                                                    ? "none"
                                                    : this.state.ReqData === true
                                                        ? "none"
                                                        : ""
                                        }}
                                        onClick={ReceiptSearch.bind(this, this)}
                                    />
                                </div> */}
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Payment Terms" }}
                  selector={{
                    name: "payment_terms",
                    className: "select-fld",
                    value: this.state.payment_terms,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PAYMENT_TERMS
                    },
                    others: {
                      disabled: true
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        payment_terms: null
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <MyContext.Provider
            value={{
              state: this.state,
              updateState: obj => {
                this.setState({ ...obj });
              }
            }}
          >
            <POReturnItemList POReturnEntry={this.state} />
          </MyContext.Provider>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={SavePOReutrnEnrty.bind(this, this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Save",
                    returnText: true
                  }}
                />
              </button>

              <button
                type="button"
                className="btn btn-default"
                disabled={this.state.ClearDisable}
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>

              <AlgaehSecurityComponent componentCode="PUR_RET_POST">
                <button
                  type="button"
                  className="btn btn-other"
                  onClick={PostPOReturnEntry.bind(this, this)}
                  disabled={this.state.postEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Post",
                      returnText: true
                    }}
                  />
                </button>
              </AlgaehSecurityComponent>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    polocations: state.polocations,
    poitemcategory: state.poitemcategory,
    poitemgroup: state.poitemgroup,
    poitemuom: state.poitemuom,
    povendors: state.povendors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getVendorMaster: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PurchaseReturnEntry)
);
