import React, { Component } from "react";
import "./vendor_setup.css";
import Modal from "@material-ui/core/Modal";

class VendorSetup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false
    };
  }

  render() {
    return (
      <div className="vendor_setup">
        <Modal open={this.state.openModal}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Vendor Details</h4>
                </div>
                <div className="col-lg-4">
                  <button
                    type="button"
                    className=""
                    onClick={e => {
                      this.setState({
                        openModal: false
                      });
                    }}
                  >
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="popupInner" />
        </Modal>

        <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Vendors List</h3>
            </div>
            <div className="actions">
              <a
                className="btn btn-primary btn-circle active"
                onClick={() => {
                  this.setState({
                    openModal: true
                  });
                }}
              >
                <i className="fas fa-plus" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VendorSetup;
