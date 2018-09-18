import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ListofItems.css";
import "./../../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  Modal
} from "../../../Wrapper/algaehWrapper";
import {
  PRESCRIPTION_FREQ_PERIOD,
  PRESCRIPTION_FREQ_TIME,
  PRESCRIPTION_FREQ_DURATION
} from "../../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../../Options.json";

class ListofItems extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
    // this.props.onSelectdata && this.props.onSelectdata;
  };

  dateFormater({ value }) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/itemmaster/getItems",
      method: "GET",
      redux: {
        type: "DIET_GET_DATA",
        mappingName: "itemlist"
      }
    });

    this.props.getGenerics({
      uri: "/genericmaster/getGenerics",
      method: "GET",
      redux: {
        type: "DIET_GET_DATA",
        mappingName: "genericlist"
      }
    });
  }

  render() {
    debugger;
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
                <h4> Medication Items </h4>
              </div>
              <div className="hptl-phase1-add-insurance-form">
                <div className="container-fluid">
                  {/* Services Details */}

                  <div className="row">
                    <AlgaehDataGrid
                      id="Order_Medication"
                      columns={[
                        {
                          fieldName: "generic_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Generic Name" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.genericlist === undefined
                                ? []
                                : this.props.genericlist.filter(
                                    f =>
                                      f.hims_d_item_generic_id ===
                                      row.generic_id
                                  );

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].generic_name
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "item_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.itemlist === undefined
                                ? []
                                : this.props.itemlist.filter(
                                    f => f.hims_d_item_master_id === row.item_id
                                  );

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].item_description
                                  : ""}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "frequency",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Frequency" }} />
                          ),
                          displayTemplate: row => {
                            return row.frequency == "0"
                              ? "1-0-1"
                              : row.frequency == "1"
                                ? "1-0-0"
                                : row.frequency == "2"
                                  ? "0-0-1"
                                  : row.frequency == "3"
                                    ? "0-1-0"
                                    : row.frequency == "4"
                                      ? "1-1-0"
                                      : row.frequency == "5"
                                        ? "0-1-1"
                                        : row.frequency == "6"
                                          ? "1-1-1"
                                          : null;
                          }
                        },
                        {
                          fieldName: "frequency_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Frequency Type" }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.frequency_type == "PD"
                              ? "Per Day"
                              : row.frequency_type == "PH"
                                ? "Per Hour"
                                : row.frequency_type == "PW"
                                  ? "Per Week"
                                  : row.frequency_type == "PM"
                                    ? "Per Month"
                                    : row.frequency_type == "AD"
                                      ? "Alternate Day"
                                      : null;
                          }
                        },
                        {
                          fieldName: "frequency_time",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Frequency Time" }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.frequency_time == "BM"
                              ? "Before Meals"
                              : row.frequency_time == "AM"
                                ? "After Meals"
                                : null;
                          }
                        },
                        {
                          fieldName: "dosage",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Dosage" }} />
                          )
                        },
                        {
                          fieldName: "no_of_days",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Duration (Days)" }}
                            />
                          )
                        },
                        {
                          fieldName: "start_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Start Date" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>{this.dateFormater(row.start_date)}</span>
                            );
                          }
                        }
                      ]}
                      keyId="item_id"
                      dataSource={{
                        data: this.props.inputsparameters.item_list
                      }}
                      // isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        //   onDelete: deleteItems.bind(this, this),
                        onEdit: row => {}
                        // onDone: this.updateBillDetail.bind(this)
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
    itemlist: state.itemlist,
    genericlist: state.genericlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getGenerics: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ListofItems)
);
