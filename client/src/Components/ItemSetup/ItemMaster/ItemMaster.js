import React, { Component } from "react";
import ItemDetails from "./ItemDetails/ItemDetails";
import UOMAdditionalInfo from "./UOMAdditionalInfo/UOMAdditionalInfo";
import "./../../../styles/site.css";
import "./ItemMaster.css";
import { AlgaehLabel, Modal } from "../../Wrapper/algaehWrapper";
import MyContext from "../../../utils/MyContext.js";
import ItemSetup from "../../../Models/ItemSetup";
import { InsertUpdateItems } from "./ItemMasterEvents";
import ItemPriceList from "./ItemPriceList/ItemPriceList";

export default class PatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changesDone: false
    };
  }

  onClose = e => {
    let IOputs = ItemSetup.inputParam();
    this.setState({ ...this.state, ...IOputs });
    this.props.onClose && this.props.onClose(this.state.changesDone);
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

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div className="hptl-phase1-Display-patient-details">
        <Modal open={this.props.open}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>{this.props.HeaderCaption}</h4>
                </div>
                <div className="col-lg-4">
                  <button
                    type="button"
                    className=""
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
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
                  <UOMAdditionalInfo itemPop={this.state} />
                  <ItemPriceList itemPop={this.state} />
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
                      {this.state.hims_d_item_master_id === null ? (
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
          </div>
        </Modal>
      </div>
    );
  }
}
