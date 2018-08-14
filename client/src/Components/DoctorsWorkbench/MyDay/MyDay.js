import React, { Component } from "react";
import "./myday.css";
import Paper from "@material-ui/core/Paper";
import { Timeline, TimelineEvent } from "react-event-timeline";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  Tooltip,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import Search from "@material-ui/icons/Search";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class MyDay extends Component {
  render() {
    return (
      <div className="myday">
        <div className="row top-bar">
          <div className="my-calendar" />
        </div>

        <div className="row card-deck panel-layout">
          {/* Left Pane Start */}
          <div className="col-lg-4 card box-shadow-normal">
            <AlgaehLabel label={{ fieldName: "patients_list" }} />
          </div>
          {/* Left Pane End */}

          {/* Right Pane Start */}

          {/* <div className="col-lg-8 card encounters-panel">
            <div className="card-body box-shadow-normal">
              <h6 className="card-subtitle mb-2 text-muted">All Patients</h6> */}

          <div className="col-lg-8 card box-shadow-normal encounters-panel">
            <div className="row">
              <div className="col-lg-3">
                {" "}
                <AlgaehLabel label={{ fieldName: "encounter_list" }} />
              </div>
              <div className="col-lg-5">
                {" "}
                <AlgaehLabel label={{ fieldName: "total_encounters" }} /> : 8
              </div>
            </div>
            <div className="divider" />
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "status"
                }}
                selector={{
                  name: "status",
                  className: "select-fld",
                  //value: this.state.consultation,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: GlobalVariables.DOC_WRK_BNCH_FILTER_CONDITIONS
                  },
                  //onChange: this.changeTexts.bind(this)
                  onChange: () => {}
                }}
              />
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ fieldName: "from_date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "from_date"
                }}
                maxDate={new Date()}
                events={{
                  //onChange: datehandle.bind(this, this)
                  onChange: () => {}
                }}
                // value={this.state.receipt_date}
              />

              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{ fieldName: "to_date", isImp: true }}
                textBox={{
                  className: "txt-fld",
                  name: "to_date"
                }}
                maxDate={new Date()}
                events={{
                  //onChange: datehandle.bind(this, this)
                  onChange: () => {}
                }}
                // value={this.state.receipt_date}
              />

              <AlagehFormGroup
                div={{ className: "col" }}
                label={{
                  fieldName: "patient_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "patient_code",
                  // value: this.state.visit_type_code,
                  //error: this.state.visit_type_code_error,
                  //helperText: this.state.visit_type_code_error_txt,
                  events: {
                    //onChange: this.changeTexts.bind(this)
                    onChange: () => {}
                  }
                }}
              />
              <div className="col-lg-1">
                <Tooltip id="tooltip-icon" title="Search">
                  <IconButton className="go-button" color="#000">
                    <Search onClick={() => {}} />
                  </IconButton>
                </Tooltip>
              </div>

              <div className="col-lg-1">
                <Tooltip id="tooltip-icon" title="Go">
                  <IconButton className="go-button" color="primary">
                    <PlayCircleFilled onClick={() => {}} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <AlgaehDataGrid
              id="encounter_table"
              columns={[
                {
                  fieldName: "encounter_code",
                  label: <AlgaehLabel label={{ fieldName: "status" }} />,
                  disabled: true
                },
                {
                  fieldName: "patient_code",
                  label: <AlgaehLabel label={{ fieldName: "patient_code" }} />
                },
                {
                  fieldName: "patient_name",
                  label: <AlgaehLabel label={{ fieldName: "patient_name" }} />
                },
                {
                  fieldName: "date",
                  label: <AlgaehLabel label={{ fieldName: "date" }} />
                },
                {
                  fieldName: "time",
                  label: <AlgaehLabel label={{ fieldName: "time" }} />
                },
                {
                  fieldName: "case_type",
                  label: <AlgaehLabel label={{ fieldName: "case_type" }} />
                },
                {
                  fieldName: "transfer_status",
                  label: (
                    <AlgaehLabel label={{ fieldName: "transfer_status" }} />
                  )
                },
                {
                  fieldName: "policy_group_description",
                  label: (
                    <AlgaehLabel
                      label={{ fieldName: "policy_group_description" }}
                    />
                  )
                }
              ]}
              keyId="encounter_code"
              dataSource={{
                data:
                  this.props.encounterlist === undefined
                    ? []
                    : this.props.encounterlist
              }}
              isEditable={false}
              paging={{ page: 0, rowsPerPage: 10 }}
              events={{
                onDelete: row => {},
                onEdit: row => {},
                onDone: row => {}
              }}
            />
          </div>
          {/* Right Pane End */}
        </div>
      </div>
    );
  }
}

export default MyDay;
