import React, { PureComponent } from "react";
import {
  AlgaehModalPopUp,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import Dropzone from "react-dropzone";
import noImage from "../../../../assets/images/images.webp";

class ValidateBills extends PureComponent {
  constructor(props) {
    super(props);
    debugger;
    this.state = {
      invoices: [],
      invoice_details: []
    };
  }

  render() {
    let invoices = this.props.data !== undefined ? [this.props.data] : [];

    return (
      <AlgaehModalPopUp
        events={{
          onClose: () => {
            this.props.closeModal;
          }
        }}
        openPopup={this.props.openPopup}
      >
        <div className="col-lg-12 popupInner">
          {/* {JSON.stringify(this.props.data)} */}
          <div className="row">
            <div className="col-lg-8">
              <AlgaehDataGrid
                id="validate-bills-grid"
                columns={[
                  {
                    fieldName: "actions",
                    label: "Select",
                    displayTemplate: row => {
                      return (
                        <div className="customCheckbox">
                          <input
                            type="checkbox"
                            onChange={() => {
                              this.setState({
                                invoice_details: row.Invoice_Detail
                              });
                            }}
                          />
                        </div>
                      );
                    }
                  },
                  {
                    fieldName: "actions",
                    label: <AlgaehLabel label={{ forceLabel: "Status" }} />
                  },
                  {
                    fieldName: "status",
                    label: <AlgaehLabel label={{ forceLabel: "Bill Status" }} />
                  },
                  {
                    fieldName: "invoice_number",
                    label: <AlgaehLabel label={{ forceLabel: "Case Type" }} />
                  },
                  {
                    fieldName: "invoice_number",
                    label: <AlgaehLabel label={{ forceLabel: "Bill Number" }} />
                  },
                  {
                    fieldName: "invoice_number",
                    label: <AlgaehLabel label={{ forceLabel: "Visit Code" }} />
                  }
                ]}
                keyId="id"
                dataSource={{
                  data: invoices
                }}
                isEditable={false}
                paging={{ page: 0, rowsPerPage: 5 }}
              />
            </div>

            <div className="col-lg-4">
              <div className="image-drop-area">
                <Dropzone
                  onDrop={() => {}}
                  id="insurance"
                  className="dropzone"
                  accept="image/*"
                  multiple={false}
                  name="image"
                >
                  <img
                    src={this.state.img}
                    alt="Insurance Image"
                    onError={e => {
                      e.target.src = noImage;
                    }}
                  />

                  <div className="attach-design text-center">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Photo"
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: this.state.percent + "%",
                      height: 3,
                      backgroundColor: "#E1AE54"
                    }}
                  />
                </Dropzone>
              </div>
              <div className="image-drop-area margin-top-15">
                <Dropzone
                  onDrop={() => {}}
                  id="insurance"
                  className="dropzone"
                  accept="image/*"
                  multiple={false}
                  name="image"
                >
                  <img
                    src={this.state.img}
                    alt="Report Image"
                    onError={e => {
                      e.target.src = noImage;
                    }}
                  />

                  <div className="attach-design text-center">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Photo"
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: this.state.percent + "%",
                      height: 3,
                      backgroundColor: "#E1AE54"
                    }}
                  />
                </Dropzone>
              </div>
            </div>
          </div>

          <div className="row margin-top-15">
            <div className="col-lg-8">
              <AlgaehDataGrid
                id="validate-bills-grid"
                columns={[
                  {
                    fieldName: "quantity",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Billing Code" }} />
                    )
                  },
                  {
                    fieldName: "status",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Billing Code Desc." }}
                      />
                    )
                  },
                  {
                    fieldName: "invoice_number",
                    label: <AlgaehLabel label={{ forceLabel: "CPT Code" }} />
                  }
                ]}
                keyId="id"
                dataSource={{
                  data: this.state.invoice_details
                }}
                isEditable={false}
                paging={{ page: 0, rowsPerPage: 5 }}
              />
            </div>

            <div className="col-lg-4">
              <AlgaehDataGrid
                id="validate-bills-grid"
                columns={[
                  {
                    fieldName: "actions",
                    label: <AlgaehLabel label={{ forceLabel: "Type" }} />
                  },
                  {
                    fieldName: "status",
                    label: <AlgaehLabel label={{ forceLabel: "Code" }} />
                  },
                  {
                    fieldName: "invoice_number",
                    label: <AlgaehLabel label={{ forceLabel: "Description" }} />
                  }
                ]}
                keyId="id"
                dataSource={{
                  data: []
                }}
                isEditable={false}
                paging={{ page: 0, rowsPerPage: 5 }}
              />
            </div>
          </div>
        </div>
        <div className="popupFooter">
          <button className="btn-primary">VALIDATE</button>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default ValidateBills;
