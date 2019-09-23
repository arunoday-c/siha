import React, { Component } from "react";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";

import "./ActiveMedication.scss";
import "../../../../styles/site.scss";

import _ from "lodash";
class ActiveMedication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderservicesdata: []
    };
  }

  render() {
    const active_medication =
      this.props.active_medication === undefined
        ? []
        : this.props.active_medication;
    return (
      <div>
        <div className="popupInner">
          <div className="popRightDiv">
            <AlgaehDataGrid
              id="activeMedication"
              columns={[
                {
                  fieldName: "generic_name",
                  label: <AlgaehLabel label={{ forceLabel: "Generic Name" }} />,
                  displayTemplate: row => {
                    return row.generic_name !== undefined
                      ? row.generic_name.replace(/\w+/g, _.capitalize)
                      : row.generic_name;
                  }
                },
                {
                  fieldName: "item_description",
                  label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
                  displayTemplate: row => {
                    return row.item_description !== undefined
                      ? row.item_description.replace(/\w+/g, _.capitalize)
                      : row.item_description;
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
                },
                {
                  fieldName: "instructions",
                  label: <AlgaehLabel label={{ forceLabel: "Instructions" }} />
                }
              ]}
              keyId="item_id"
              dataSource={{
                data: active_medication
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
export default ActiveMedication;
