import React, { PureComponent } from "react";

import "./PosListItems.scss";
import "./../../../../styles/site.scss";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

export default class ItemInstructions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      item_instructions: null,
      item_name: null
    };
  }

  textChanges(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item_details.item_description !== undefined) {
      this.setState({
        hims_f_pharmacy_pos_header_id: nextProps.hims_f_pharmacy_pos_header_id,
        item_name: nextProps.item_details.item_description,
        item_id: nextProps.item_details.hims_d_item_master_id
      });
    }
  }

  onClose = e => {
    this.setState(
      {
        item_instructions: null
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  PrintLabel() {
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob"
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "PharmacyOutMedicineLabel",
          reportParams: [
            {
              name: "item_instructions",
              value: this.state.item_instructions
            },
            {
              name: "hims_f_pharmacy_pos_header_id",
              value: this.state.hims_f_pharmacy_pos_header_id
            },
            {
              name: "item_id",
              value: this.state.item_id
            }
          ],
          pageSize: "A6",
          pageOrentation: "landscape",
          outputFileType: "PDF",
          breakAtArray: true
        }
      },
      onSuccess: res => {
        const url = URL.createObjectURL(res.data);
        let myWindow = window.open(
          "{{ product.metafields.google.custom_label_0 }}",
          "_blank"
        );

        myWindow.document.write(
          "<iframe src= '" + url + "' width='100%' height='100%' />"
        );
        myWindow.document.title = "";
      }
    });
  }
  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            class="itemInstPopUp"
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Item Instruction"
            openPopup={this.props.show}
          >
            <div className="col-12 popupInner margin-top-15">
              <div className="row">
                <div className="col-12">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Item Name"
                    }}
                  />
                  <h6>
                    {this.state.item_name
                      ? this.state.item_name
                      : "-----------"}
                  </h6>
                </div>

                <div className="col-12 margin-bottom-15">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Enter Item Instructions"
                    }}
                  />
                  <textarea
                    name="item_instructions"
                    value={this.state.item_instructions}
                    onChange={this.textChanges.bind(this)}
                    className="textArea"
                  />
                </div>

                {/* <AlagehFormGroup
                  div={{ className: "col-12" }}
                  label={{
                    forceLabel: "Enter Item Instructions"
                  }}
                 
                  textBox={{
                    className: "txt-fld",
                    name: "item_instructions",
                    value: this.state.item_instructions,
                    events: {
                      onChange: this.textChanges.bind(this)
                    }
                  }}
                /> */}
              </div>
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.PrintLabel.bind(this)}
                    >
                      Print Label
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      Close
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
