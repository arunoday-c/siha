import React, { Component } from "react";
import ItemDetails from "./ItemDetails/ItemDetails";
import UOMAdditionalInfo from "./UOMAdditionalInfo/UOMAdditionalInfo";

import "./../../../styles/site.css";
import "./ItemMaster.css";

import { AlgaehLabel, AlgaehModalPopUp } from "../../Wrapper/algaehWrapper";
import MyContext from "../../../utils/MyContext.js";
import InventoryItem from "../../../Models/InventoryItem";
import { InsertUpdateItems } from "./ItemMasterEvents";

export default class PatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onClose = e => {
    this.props.onClose && this.props.onClose(false);
    let IOputs = InventoryItem.inputParam();
    this.setState({ ...this.state, ...IOputs });
  };

  componentWillMount() {
    let IOputs = InventoryItem.inputParam();
    this.setState({ ...this.state, ...IOputs });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.itemPop.hims_d_inventory_item_master_id !== undefined) {
      debugger;
      let IOputs = newProps.itemPop;
      this.setState({ ...this.state, ...IOputs });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

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
          <div className="popupInner">
            <div className="col-12 popRightDiv">
              <MyContext.Provider
                value={{
                  state: this.state,
                  updateState: obj => {
                    this.setState({ ...obj });
                  }
                }}
              >
                <ItemDetails itemPop={this.state} />
              </MyContext.Provider>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4"> &nbsp;</div>

                <div className="col-lg-8">
                  <button
                    onClick={InsertUpdateItems.bind(this, this)}
                    type="button"
                    className="btn btn-primary"
                  >
                    {this.state.hims_d_inventory_item_master_id === null ? (
                      <AlgaehLabel label={{ fieldName: "btnSave" }} />
                    ) : (
                      <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                    )}
                  </button>
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
