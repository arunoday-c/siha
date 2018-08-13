import React, { Component } from "react";
import "./myday.css";
import Paper from "@material-ui/core/Paper";
import { Timeline, TimelineEvent } from "react-event-timeline";
import { AlgaehDataGrid, AlgaehLabel } from "../../Wrapper/algaehWrapper";

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
          <div className="col-lg-8 card box-shadow-normal encounters-panel">
            <div className="row">
              <div className="col-lg-3">
                {" "}
                <AlgaehLabel label={{ fieldName: "encounter_list" }} />{" "}
              </div>
              <div className="col-lg-5">
                {" "}
                <AlgaehLabel label={{ fieldName: "total_encounters" }} /> : 5{" "}
              </div>
            </div>
            <AlgaehDataGrid
              className=""
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
