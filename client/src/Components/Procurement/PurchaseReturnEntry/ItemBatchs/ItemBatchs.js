import React, { PureComponent } from "react";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";

import "./ItemBatchs.scss";
import "./../../../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";

// import { AlgaehActions } from "../../../../actions/algaehActions";

export default class ItemBatchs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Item Batch"
            openPopup={this.props.show}
          >
            <div className="hptl-phase1-item-batch-form">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      id="item_batchs"
                      columns={[
                        {
                          fieldName: "item_description",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          )
                        },
                        {
                          fieldName: "uom_description",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Stocking UOM" }} />
                          )
                        },
                        {
                          fieldName: "batchno",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                          )
                        },
                        {
                          fieldName: "expirydt",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Expiry Date" }}
                            />
                          )
                        },
                        {
                          fieldName: "qtyhand",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Quantity in Hand" }}
                            />
                          )
                        }
                      ]}
                      keyId="item_id"
                      dataSource={{
                        data:
                          this.props.inputsparameters.Batch_Items === undefined
                            ? []
                            : this.props.inputsparameters.Batch_Items
                      }}
                      algaehSearch={true}
                      // isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      onRowSelect={row => {
                        row.selected = true;
                        this.onClose(row);
                      }}
                    />
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

// function mapStateToProps(state) {
//   return {
//     itemuom: state.itemuom,
//     itemlist: state.itemlist
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getItemUOM: AlgaehActions
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )(ItemBatchs)
// );
