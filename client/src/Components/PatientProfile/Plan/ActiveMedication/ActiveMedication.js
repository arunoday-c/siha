import React, { Component } from "react";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";

import "./ActiveMedication.scss";
import "../../../../styles/site.scss";

import _ from "lodash";
class ActiveMedication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orderservicesdata: [],
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
                  displayTemplate: (row) => {
                    return row.generic_name !== undefined
                      ? row.generic_name.replace(/\w+/g, _.capitalize)
                      : row.generic_name;
                  },
                },
                {
                  fieldName: "item_description",
                  label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
                  displayTemplate: (row) => {
                    return row.item_description !== undefined
                      ? row.item_description.replace(/\w+/g, _.capitalize)
                      : row.item_description;
                  },
                },
                {
                  fieldName: "frequency",
                  label: <AlgaehLabel label={{ forceLabel: "Freq." }} />,
                  displayTemplate: (row) => {
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
                      : row.frequency === "7"
                      ? "Once only"
                      : row.frequency === "8"
                      ? "Once daily (q24h)"
                      : row.frequency === "9"
                      ? "Twice daily (Bid)"
                      : row.frequency === "10"
                      ? "Three times daily (tid)"
                      : row.frequency === "11"
                      ? "Five times daily"
                      : row.frequency === "12"
                      ? "Every two hours (q2h)"
                      : row.frequency === "13"
                      ? "Every three hours (q3h)"
                      : row.frequency === "14"
                      ? "Every four hours (q4h)"
                      : row.frequency === "15"
                      ? "Every six hours (q6h)"
                      : row.frequency === "16"
                      ? "Every eight hours (q8h)"
                      : row.frequency === "17"
                      ? "Every twelve hours (q12h)"
                      : row.frequency === "18"
                      ? "Four times daily (qid)"
                      : row.frequency === "19"
                      ? "Other (According To Physician)"
                      : null;
                  },

                  others: {
                    minWidth: 50,
                  },
                },
                {
                  fieldName: "frequency_type",
                  label: <AlgaehLabel label={{ forceLabel: "Freq. Type" }} />,
                  displayTemplate: (row) => {
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
                      : row.frequency_type === "2W"
                      ? "Every 2 weeks"
                      : row.frequency_type === "2M"
                      ? "Every 2 months"
                      : row.frequency_type === "3M"
                      ? "Every 3 months"
                      : row.frequency_type === "4M"
                      ? "Every 4 months"
                      : row.frequency_type === "6M"
                      ? "Every 6 months"
                      : null;
                  },

                  others: {
                    minWidth: 70,
                  },
                },
                {
                  fieldName: "frequency_time",
                  label: <AlgaehLabel label={{ forceLabel: "Freq. Time" }} />,
                  displayTemplate: (row) => {
                    return row.frequency_time === "BM"
                      ? "Before Meals"
                      : row.frequency_time === "AM"
                      ? "After Meals"
                      : row.frequency_time === "WF"
                      ? "With Food"
                      : row.frequency_time === "EM"
                      ? "Early Morning"
                      : row.frequency_time === "BB"
                      ? "Before Bed Time"
                      : row.frequency_time === "AB"
                      ? "At Bed Time"
                      : null;
                  },

                  others: {
                    minWidth: 70,
                  },
                },
                {
                  fieldName: "frequency_route",
                  label: <AlgaehLabel label={{ forceLabel: "Freq. Route" }} />,
                  displayTemplate: (row) => {
                    return row.frequency_route === "BL"
                      ? "Buccal"
                      : row.frequency_route === "EL"
                      ? "Enteral"
                      : row.frequency_route === "IL"
                      ? "Inhalation"
                      : row.frequency_route === "IF"
                      ? "Infusion"
                      : row.frequency_route === "IM"
                      ? "Intramuscular Inj"
                      : row.frequency_route === "IT"
                      ? "Intrathecal Inj"
                      : row.frequency_route === "IR"
                      ? "Intravenous Inj"
                      : row.frequency_route === "NL"
                      ? "Nasal"
                      : row.frequency_route === "OP"
                      ? "Ophthalmic"
                      : row.frequency_route === "OR"
                      ? "Oral"
                      : row.frequency_route === "OE"
                      ? "Otic (ear)"
                      : row.frequency_route === "RL"
                      ? "Rectal"
                      : row.frequency_route === "ST"
                      ? "Subcutaneous"
                      : row.frequency_route === "SL"
                      ? "Sublingual"
                      : row.frequency_route === "TL"
                      ? "Topical"
                      : row.frequency_route === "TD"
                      ? "Transdermal"
                      : null;
                  },

                  others: {
                    minWidth: 70,
                  },
                },
                {
                  fieldName: "dosage",
                  label: <AlgaehLabel label={{ forceLabel: "Dosage" }} />,
                  others: {
                    minWidth: 50,
                  },
                },
                {
                  fieldName: "med_units",
                  label: <AlgaehLabel label={{ forceLabel: "Units" }} />,
                  others: {
                    minWidth: 40,
                  },
                },
                {
                  fieldName: "no_of_days",
                  label: (
                    <AlgaehLabel label={{ forceLabel: "Duration (Days)" }} />
                  ),
                  others: {
                    minWidth: 90,
                  },
                },
                {
                  fieldName: "instructions",
                  label: <AlgaehLabel label={{ forceLabel: "Instructions" }} />,
                },
              ]}
              keyId="item_id"
              dataSource={{
                data: active_medication,
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
              onClick={(e) => {
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
