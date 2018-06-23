import React, { Component } from "react";
import TextField from "material-ui/TextField";
import "./AddBillingForm.css";
import "./../../../../styles/site.css";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";

const FORMAT_DEFAULT = [
  { name: "CSV", value: 0 },
  { name: "XML", value: 1 },
  { name: "XLS", value: 2 }
];

export default class AddBillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePreview: "",
      BillDeatils: []
    };
  }

  render() {
    return (
      <div className="hptl-phase1-add-billing-form">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <label>
                Bill Number<mark>*</mark>
              </label>
              <br />
              <TextField disabled={true} />
            </div>

            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <label>
                Bill Date<mark>*</mark>
              </label>
              <br />
              <TextField type="date" disabled={true} />
            </div>
          </div>
          <div className="row form-details">
            <div className="table-responsive">
              {/* <table className="table table-striped table-details table-hover">
                <thead style={{ background: "#b4e2df" }}>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Service Type</th>
                    <th scope="col">Bill Code</th>
                    <th scope="col">Gross Amount</th>
                    <th scope="col">Discount %</th>
                    <th scope="col">Discount Amt.</th>
                    <th scope="col">Net Amt.</th>

                    <th scope="col">Insurance</th>
                    <th scope="col">Co-Pay Amt.</th>
                    <th scope="col">Deductable Amt.</th>
                    <th scope="col">Pat. Resp.</th>
                    <th scope="col">Comp. Resp.</th>
                    <th scope="col">Pat. Tax</th>
                    <th scope="col">Comp. Tax</th>
                    <th scope="col">Pat. Payble</th>
                    <th scope="col">Comp. Payble</th>

                    <th scope="col">Sec. Insurance</th>
                    <th scope="col">Sec. Gross Amount</th>
                    <th scope="col">Sec. Co-Pay Amt.</th>
                    <th scope="col">Sec. Deductable Amt.</th>
                    <th scope="col">Sec. Comp. Resp.</th>
                    <th scope="col">Sec. Comp. Tax</th>
                    <th scope="col">Sec. Comp. Payble</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>2</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>sample</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>500.00</td>
                    <td>0.00</td>
                    <td>50.00</td>
                    <td>450.00</td>
                  </tr>
                </tbody>
              </table> */}

              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "service_type_id",
                    label: (
                      <AlgaehLabel label={{ fieldName: "service_type_id" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "services_id",
                    label: <AlgaehLabel label={{ fieldName: "services_id" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "gross_amount",
                    label: (
                      <AlgaehLabel label={{ fieldName: "gross_amount" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "discount_percentage",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "discount_percentage" }}
                      />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "discount_amout",
                    label: (
                      <AlgaehLabel label={{ fieldName: "discount_amout" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "net_amout",
                    label: <AlgaehLabel label={{ fieldName: "net_amout" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "insurance",
                    label: <AlgaehLabel label={{ fieldName: "insurance" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "copay_amount",
                    label: (
                      <AlgaehLabel label={{ fieldName: "copay_amount" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "deductable_amount",
                    label: (
                      <AlgaehLabel label={{ fieldName: "deductable_amount" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "tax_inclusive",
                    label: (
                      <AlgaehLabel label={{ fieldName: "tax_inclusive" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "patient_tax",
                    label: <AlgaehLabel label={{ fieldName: "patient_tax" }} />,
                    disabled: true
                  },

                  {
                    fieldName: "company_tax",
                    label: <AlgaehLabel label={{ fieldName: "company_tax" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "total_tax",
                    label: <AlgaehLabel label={{ fieldName: "total_tax" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "patient_resp",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_resp" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "patient_payable",
                    label: (
                      <AlgaehLabel label={{ fieldName: "patient_payable" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "comapany_resp",
                    label: (
                      <AlgaehLabel label={{ fieldName: "comapany_resp" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "company_payble",
                    label: (
                      <AlgaehLabel label={{ fieldName: "company_payble" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "net_amout",
                    label: <AlgaehLabel label={{ fieldName: "net_amout" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "sec_company",
                    label: <AlgaehLabel label={{ fieldName: "sec_company" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "sec_copay_amount",
                    label: (
                      <AlgaehLabel label={{ fieldName: "sec_copay_amount" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "sec_deductable_amount",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "sec_deductable_amount" }}
                      />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "tax_inclusive",
                    label: (
                      <AlgaehLabel label={{ fieldName: "tax_inclusive" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "sec_company_res",
                    label: (
                      <AlgaehLabel label={{ fieldName: "sec_company_res" }} />
                    ),
                    disabled: true
                  },

                  {
                    fieldName: "sec_company_tax",
                    label: (
                      <AlgaehLabel label={{ fieldName: "sec_company_tax" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "sec_company_paybale",
                    label: (
                      <AlgaehLabel
                        label={{ fieldName: "sec_company_paybale" }}
                      />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "tax_inclusive",
                    label: (
                      <AlgaehLabel label={{ fieldName: "tax_inclusive" }} />
                    ),
                    disabled: true
                  },
                  {
                    fieldName: "sec_company_res",
                    label: (
                      <AlgaehLabel label={{ fieldName: "sec_company_res" }} />
                    ),
                    disabled: true
                  }
                ]}
                keyId="visit_code"
                dataSource={{
                  data: this.state.BillDeatils
                }}
                // isEditable={true}
                // paging={{ page: 0, rowsPerPage: 5 }}
                // events={{
                //   onDone: row => {
                //     alert("done is raisedd");
                //   }
                // }}
              />
            </div>
          </div>

          <div className="row header-details">
            {/* <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
							<label>Discount By</label>							
						</div>	

						<div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
							<TextFieldData disabled={true} type="number"/>
						</div> */}

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Sub Total</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Discount</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Sec. Discount</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Net Total</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>
          </div>

          {/* <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Co-PayAmount</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Total</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Gross Total</label>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 boderlabel">
              <label />
            </div>
          </div>

          <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Deductable</label>
            </div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Total Tax</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Discount</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <TextField type="number" InputAdornment="%" />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>
          </div>

          <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Pat. Resp.</label>
            </div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Advance</label>
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Net Total</label>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 boderlabel">
              <label />
            </div>
          </div>

          <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Comp. Resp.</label>
            </div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Credit</label>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <TextField type="number" />
            </div>
          </div>

          <div className="row form-details">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
              <label>Sec. Comp. Resp.</label>
            </div>
            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 boderlabel">
              <label />
            </div>

            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              &nbsp;
            </div>

            <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 col-xl-1">
              <label>Receivable</label>
            </div>

            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 boderlabel">
              <label />
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}
