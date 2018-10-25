import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { successfulMessage } from "../../../../utils/GlobalFunctions";
import "./ItemBatchs.css";
import "./../../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  Modal
} from "../../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../../actions/algaehActions";

class ItemBatchs extends PureComponent {
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
          <Modal
            className="model-set"
            open={this.props.show}
            onClose={e => {
              this.onClose(e);
            }}
          >
            <div className="algaeh-modal">
              <div className="popupHeader">
                <h4> Batchs </h4>
              </div>
              <div className="hptl-phase1-item-batch-form">
                <div className="container-fluid">
                  {/* Services Details */}

                  <div className="row">
                    <AlgaehDataGrid
                      id="item_batchs"
                      columns={[
                        {
                          fieldName: "network_type",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          )
                          // subinsuranceprovider
                        },
                        {
                          fieldName: "sales_uom",
                          label: <AlgaehLabel label={{ forceLabel: "UOM" }} />
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
                          this.props.itemBatch === undefined
                            ? []
                            : this.props.itemBatch
                      }}
                      algaehSearch={true}
                      // isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      onRowSelect={row => {
                        this.onClose(row);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemBatch: state.itemBatch
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemLocationStock: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemBatchs)
);
