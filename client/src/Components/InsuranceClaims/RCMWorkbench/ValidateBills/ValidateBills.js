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

    this.state = {
      invoices: [],
      invoice_details: []
    };
  }

  render() {
    let invoices = this.props.data !== undefined ? [this.props.data] : [];
    let invoice_details =
      this.props.data !== undefined ? this.props.data.invoiceDetails : [];

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
                  // {
                  //   fieldName: "actions",
                  //   label: "Select",
                  //   displayTemplate: row => {
                  //     return (
                  //       <div className="customCheckbox">
                  //         <input
                  //           type="checkbox"
                  //           onChange={() => {
                  //             this.setState({
                  //               invoice_details: row.invoiceDetails
                  //             });
                  //           }}
                  //         />
                  //       </div>
                  //     );
                  //   }
                  // },
                  {
                    fieldName: "actions",
                    label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                    displayTemplate: row => {
                      return <span>Not Validated</span>;
                    }
                  },
                  {
                    fieldName: "status",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Bill Status" }} />
                    ),
                    displayTemplate: row => {
                      return <span>Paid</span>;
                    }
                  },
                  {
                    fieldName: "patient_name",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                    )
                  },
                  {
                    fieldName: "invoice_number",
                    label: <AlgaehLabel label={{ forceLabel: "Bill Number" }} />
                  },
                  {
                    fieldName: "visit_code",
                    label: <AlgaehLabel label={{ forceLabel: "Visit Code" }} />
                  },
                  {
                    fieldName: "gross_amount",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Gross Amount" }} />
                    )
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
                    label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                  },
                  {
                    fieldName: "cpt_code",
                    label: <AlgaehLabel label={{ forceLabel: "CPT Code" }} />
                  },
                  {
                    fieldName: "service_type_code",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Service Code" }} />
                    )
                  },
                  {
                    fieldName: "service_type",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Service Name" }} />
                    )
                  },
                  {
                    fieldName: "gross_amount",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Gross Amount" }} />
                    )
                  },
                  {
                    fieldName: "discount_amount",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Discount Amount" }} />
                    )
                  },
                  {
                    fieldName: "patient_resp",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Patient Responsibility" }}
                      />
                    )
                  },
                  {
                    fieldName: "patient_tax",
                    label: <AlgaehLabel label={{ forceLabel: "Patient Tax" }} />
                  }
                ]}
                keyId="id"
                dataSource={{
                  data: invoice_details
                  // data: this.state.invoice_details
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
          <button className="btn btn-primary">VALIDATE</button>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default ValidateBills;
