import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";

import "./MedicationHistory.css";
import "../../../../styles/site.css";
import { AlgaehActions } from "../../../../actions/algaehActions";

class MedicationHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderservicesdata: []
    };
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEMS_GET_DATA",
        mappingName: "meditemlist"
      }
    });
  }

  render() {
    const all_mediction =
      this.props.all_mediction === undefined ? [] : this.props.all_mediction;
    return (
      <div>
        <div className="popupInner">
          <div className="popRightDiv">
            <AlgaehDataGrid
              id="medicationHistory"
              columns={[
                {
                  fieldName: "generic_id",
                  label: <AlgaehLabel label={{ forceLabel: "Generic Name" }} />,
                  displayTemplate: row => {
                    let display =
                      this.props.genericlist === undefined
                        ? []
                        : this.props.genericlist.filter(
                            f => f.hims_d_item_generic_id === row.generic_id
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
                  label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
                  displayTemplate: row => {
                    let display =
                      this.props.meditemlist === undefined
                        ? []
                        : this.props.meditemlist.filter(
                            f => f.hims_d_item_master_id === row.item_id
                          );

                    return (
                      <span>
                        {display !== undefined && display.length !== 0
                          ? display[0].item_description
                          : ""}
                      </span>
                    );
                  }
                },
                {
                  fieldName: "frequency",
                  label: <AlgaehLabel label={{ forceLabel: "Freq." }} />,
                  displayTemplate: row => {
                    return row.frequency === "0"
                      ? "1-0-1"
                      : row.frequency === "1"
                      ? "1-0-0"
                      : row.frequency === "2"
                      ? "0-0-1"
                      : row.frequency === "3"
                      ? "0-1-0"
                      : row.frequency === "4"
                      ? "1-1-0"
                      : row.frequency === "5"
                      ? "0-1-1"
                      : row.frequency === "6"
                      ? "1-1-1"
                      : null;
                  },

                  others: {
                    minWidth: 50
                  }
                },
                {
                  fieldName: "frequency_type",
                  label: <AlgaehLabel label={{ forceLabel: "Freq. Type" }} />,
                  displayTemplate: row => {
                    return row.frequency_type === "PD"
                      ? "Per Day"
                      : row.frequency_type === "PH"
                      ? "Per Hour"
                      : row.frequency_type === "PW"
                      ? "Per Week"
                      : row.frequency_type === "PM"
                      ? "Per Month"
                      : row.frequency_type === "AD"
                      ? "Alternate Day"
                      : null;
                  },

                  others: {
                    minWidth: 70
                  }
                },
                {
                  fieldName: "frequency_time",
                  label: <AlgaehLabel label={{ forceLabel: "Freq. Time" }} />,
                  displayTemplate: row => {
                    return row.frequency_time === "BM"
                      ? "Before Meals"
                      : row.frequency_time === "AM"
                      ? "After Meals"
                      : null;
                  },

                  others: {
                    minWidth: 70
                  }
                },
                {
                  fieldName: "dosage",
                  label: <AlgaehLabel label={{ forceLabel: "Dosage" }} />,
                  others: {
                    minWidth: 50
                  }
                },
                {
                  fieldName: "no_of_days",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Duration (Days)" }} />
                  ),
                  others: {
                    minWidth: 90
                  }
                }
              ]}
              keyId="item_id"
              dataSource={{
                data: all_mediction
              }}
              paging={{ page: 0, rowsPerPage: 10 }}
            />
          </div>
        </div>

        <div className="popupFooter">
          <div className="col">
            <button
              type="button"
              className="btn btn-default"
              onClick={e => {
                this.props.onclosePopup && this.props.onclosePopup(e);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    meditemlist: state.meditemlist,
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
  )(MedicationHistory)
);
