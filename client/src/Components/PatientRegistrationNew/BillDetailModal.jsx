import React, { useContext } from "react";
import { AlgaehModal, MainContext, AlgaehLabel } from "algaeh-react-components";
import { useCurrency } from "./patientHooks";

export function BillDetailModal({ visible, data, onClose, title, billData }) {
  const { userLanguage } = useContext(MainContext);
  const { amountWithCur } = useCurrency();
  return (
    <div className="hptl-phase1-op-display-billing-form">
      <AlgaehModal
        title={title}
        visible={visible}
        mask={true}
        maskClosable={true}
        onCancel={onClose}
        footer={null}
        className={`${userLanguage}_comp row algaehNewModal`}
        // class={this.state.lang_sets}
      >
        <div className="col-lg-12">
          {/* Services Details */}
          {/* {this.state.frontDesk === null ? (
            <div className="row form-details" style={{ paddingBottom: 0 }}>
              <AlagehAutoComplete
                div={{ className: "col-3" }}
                label={{
                  fieldName: "present-bill-services",
                }}
                selector={{
                  name: "services_id",
                  className: "select-fld",
                  value: this.state.services_id,
                  dataSource: {
                    textField:
                      this.state.selectedLang === "en"
                        ? "service_name"
                        : "arabic_service_name",
                    valueField: "hims_d_services_id",
                    data: this.displayServiceBills(),
                  },
                  onChange: (selector) => {
                    let row = selector.selected;
                    this.setState({ ...this.state, ...row });
                  },
                }}
              />
              <div className="col-lg-9"> &nbsp;</div>
            </div>
          ) : null} */}
          <hr />
          {/* Amount Details */}
          <div className="row">
            <div className="col-lg-2">
              <AlgaehLabel
                label={{
                  fieldName: "quantity",
                }}
              />
              <h6>{amountWithCur(billData?.quantity)}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel
                label={{
                  fieldName: "unit_cost",
                }}
              />
              <h6>{amountWithCur(billData?.unit_cost) || 0.0}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel
                label={{
                  fieldName: "gross_amount",
                }}
              />
              <h6>{amountWithCur(billData?.gross_amount) || 0.0}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel
                label={{
                  fieldName: "discount_percentage",
                }}
              />
              <h6>{`${billData?.discount_percentage || 0.0} %`}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel
                label={{
                  fieldName: "discount_amout",
                }}
              />
              <h6>{amountWithCur(billData?.discount_amout) || 0.0}</h6>
            </div>

            <div className="col-lg-2">
              <AlgaehLabel
                label={{
                  fieldName: "net_amout",
                }}
              />
              <h6>{amountWithCur(billData?.net_amout) || 0.0}</h6>
            </div>
          </div>
          <hr />
          {/* Insurance Details */}
          <div className="row">
            <div className="col-4">
              <b>
                <u>
                  <AlgaehLabel
                    label={{
                      fieldName: "prim-insurance",
                      returnText: true,
                    }}
                  />
                </u>
              </b>

              <div className="Paper">
                <div className="row insurance-details">
                  <div className="col-6">
                    <AlgaehLabel
                      label={{
                        fieldName: "copay_percentage",
                      }}
                    />
                    <h6>{`${billData?.copay_percentage || 0.0} %`}</h6>
                  </div>

                  <div className="col-6">
                    <AlgaehLabel
                      label={{
                        fieldName: "copay_amount",
                      }}
                    />
                    <h6>{amountWithCur(billData?.copay_amount) || 0.0}</h6>
                  </div>

                  {billData?.deductable_amount === 0 ? null : (
                    <div className="col-12">
                      <div className="row">
                        <div className="col-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "deductable_percentage",
                            }}
                          />
                          <h6>{`${billData?.deductable_percentage || 0.0} ${
                            billData?.deductable_type.toUpperCase() === "AMOUNT"
                              ? "AMT"
                              : "%"
                          }`}</h6>
                        </div>

                        <div className="col-6">
                          <AlgaehLabel
                            label={{
                              fieldName: "deductable_amount",
                            }}
                          />
                          <h6>
                            {amountWithCur(billData?.deductable_amount) || 0.0}
                          </h6>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="col-4"
              style={{
                borderLeft: "1px solid #ccc",
                borderRight: "1px solid #ccc",
              }}
            >
              <b>
                <u>
                  <AlgaehLabel
                    label={{ fieldName: "patient_lbl", returnText: true }}
                  />
                </u>
              </b>

              <div className="Paper">
                <div className="row insurance-details">
                  <div className="col-7">
                    <AlgaehLabel
                      label={{
                        fieldName: "gross_amount",
                      }}
                    />
                    <h6>{amountWithCur(billData?.patient_resp) || 0.0}</h6>
                  </div>

                  <div className="col-5">
                    <AlgaehLabel
                      label={{
                        fieldName: "tax_lbl",
                      }}
                    />
                    <h6>{amountWithCur(billData?.patient_tax) || 0.0}</h6>
                  </div>

                  <div className="col-12">
                    <AlgaehLabel
                      label={{
                        fieldName: "payable_lbl",
                      }}
                    />
                    <h6>{amountWithCur(billData?.patient_payable) || 0.0}</h6>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-lg-1"> &nbsp; </div> */}

            <div className="col-4">
              <b>
                <u>
                  <AlgaehLabel
                    label={{ fieldName: "company_lbl", returnText: true }}
                  />
                </u>
              </b>
              <div className="Paper">
                <div className="row insurance-details">
                  <div className="col-7">
                    <AlgaehLabel
                      label={{
                        fieldName: "gross_amount",
                      }}
                    />
                    <h6>{amountWithCur(billData?.comapany_resp) || 0.0}</h6>
                  </div>

                  <div className="col-5">
                    <AlgaehLabel
                      label={{
                        fieldName: "tax_lbl",
                      }}
                    />
                    <h6>{amountWithCur(billData?.company_tax) || 0.0}</h6>
                  </div>

                  <div className="col-12">
                    <AlgaehLabel
                      label={{
                        fieldName: "payable_lbl",
                      }}
                    />
                    <h6>{amountWithCur(billData?.company_payble) || 0.0}</h6>
                  </div>
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
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </AlgaehModal>
    </div>
  );
}
