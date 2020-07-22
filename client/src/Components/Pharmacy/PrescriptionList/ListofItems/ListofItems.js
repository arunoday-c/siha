import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ListofItems.scss";
import "./../../../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp,
} from "../../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../../Options.json";

class ListofItems extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
    // this.props.onSelectdata && this.props.onSelectdata;
  };

  dateFormater({ value }) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  componentDidMount() {
    if (this.props.itemlist === undefined || this.props.itemlist.length === 0) {
      this.props.getItems({
        uri: "/pharmacy/getItemMaster",
        data: { item_status: "A" },
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "DIET_GET_DATA",
          mappingName: "itemlist",
        },
      });
    }
    if (
      this.props.genericlist === undefined ||
      this.props.genericlist.length === 0
    ) {
      this.props.getGenerics({
        uri: "/pharmacy/getItemGeneric",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "DIET_GET_DATA",
          mappingName: "genericlist",
        },
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this),
            }}
            title="Medication Items"
            openPopup={this.props.show}
          >
            <div
              className="col-lg-12 popupInner"
              style={{ padding: "15px" }}
              id="orderMedicationList"
            >
              <AlgaehDataGrid
                id="Order_Medication"
                columns={[
                  {
                    fieldName: "generic_id",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Generic Name" }} />
                    ),
                    displayTemplate: (row) => {
                      let display =
                        this.props.genericlist === undefined
                          ? []
                          : this.props.genericlist.filter(
                              (f) => f.hims_d_item_generic_id === row.generic_id
                            );

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].generic_name
                            : ""}
                        </span>
                      );
                    },
                    others: {
                      minWidth: 200,
                    },
                  },
                  {
                    fieldName: "item_id",
                    label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
                    displayTemplate: (row) => {
                      let display =
                        this.props.itemlist === undefined
                          ? []
                          : this.props.itemlist.filter(
                              (f) => f.hims_d_item_master_id === row.item_id
                            );

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].item_description
                            : ""}
                        </span>
                      );
                    },
                    disabled: true,
                    others: {
                      minWidth: 200,
                    },
                  },
                  {
                    fieldName: "frequency",
                    label: <AlgaehLabel label={{ forceLabel: "Frequency" }} />,
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
                      //minWidth: 200,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "frequency_type",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Frequency Type" }} />
                    ),
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
                      //minWidth: 200,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "frequency_time",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Frequency Time" }} />
                    ),
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
                      //minWidth: 200,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "dosage",
                    label: <AlgaehLabel label={{ forceLabel: "Dosage" }} />,
                    others: {
                      //minWidth: 200,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "no_of_days",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Duration (Days)" }} />
                    ),
                    others: {
                      //minWidth: 200,
                      style: { textAlign: "center" },
                    },
                  },
                  {
                    fieldName: "start_date",
                    label: <AlgaehLabel label={{ forceLabel: "Start Date" }} />,
                    displayTemplate: (row) => {
                      return <span>{this.dateFormater(row.start_date)}</span>;
                    },
                    others: {
                      //minWidth: 200,
                      style: { textAlign: "center" },
                    },
                  },
                ]}
                keyId="item_id"
                dataSource={{
                  data:
                    this.props.inputsparameters !== undefined
                      ? this.props.inputsparameters.item_list
                      : [],
                }}
                // isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  //   onDelete: deleteItems.bind(this, this),
                  onEdit: (row) => {},
                  // onDone: this.updateBillDetail.bind(this)
                }}
              />
            </div>

            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4" />
                  <div className="col-lg-8">
                    <button
                      className="btn btn-default"
                      onClick={(e) => {
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

function mapStateToProps(state) {
  return {
    itemlist: state.itemlist,
    genericlist: state.genericlist,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getGenerics: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListofItems)
);
