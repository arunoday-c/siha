import React from "react";
import "./MonthlyDetail.css";
import {
  AlgaehDataGrid,
  AlgaehModalPopUp,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import moment from "moment";

function MonthlyDetail(props) {
  // const _open = props.open;
  return (
    <AlgaehModalPopUp
      title="Monthly Detail"
      openPopup={props.open}
      events={{
        onClose: props.onClose
      }}
      className="col-lg-12 MonthlyDetailsPopup"
    >
      <div className="popupInner">
        <div className="col-12">
          {/* <AlgaehLabel
            label={{
              forceLabel: props.employee_name
            }}
          /> */}

          <div className="row margin-top-15">
            {" "}
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Employee Name"
                }}
              />
              <h6>{props.employee_name}</h6>
            </div>
          </div>

          <div className="row">
            <div className="col-12 margin-bottom-15" id="monthlyDetailGridCntr">
              <AlgaehDataGrid
                id="monthlyDetailGrid"
                columns={[
                  {
                    fieldName: "attendance_date",
                    label: <AlgaehLabel label={{ forceLabel: "Date" }} />,
                    displayTemplate: row => {
                      return moment(row.attendance_date).format("DD-MMM-YYYY");
                    }
                  },
                  // {
                  //   fieldName: "year",
                  //   label: <AlgaehLabel label={{ forceLabel: "Year" }} />
                  // },
                  // {
                  //   fieldName: "month",
                  //   label: <AlgaehLabel label={{ forceLabel: "month" }} />,
                  //   displayTemplate: row => {
                  //     return moment(row.month, "M").format("MMMM");
                  //   }
                  // },
                  {
                    fieldName: "weekoff_days",
                    label: <AlgaehLabel label={{ forceLabel: "weekoffs" }} />
                  },
                  {
                    fieldName: "holidays",
                    label: <AlgaehLabel label={{ forceLabel: "holidays" }} />
                  },
                  // {
                  //   fieldName: "total_work_days",
                  //   label: (
                  //     <AlgaehLabel label={{ forceLabel: "Total Work Days" }} />
                  //   )
                  // },
                  {
                    fieldName: "present_days",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Present Days" }} />
                    )
                  },
                  {
                    fieldName: "absent_days",
                    label: <AlgaehLabel label={{ forceLabel: "Absent Days" }} />
                  },
                  {
                    fieldName: "paid_leave",
                    label: <AlgaehLabel label={{ forceLabel: "Paid Leaves" }} />
                  },
                  {
                    fieldName: "unpaid_leave",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Unpaid Leaves" }} />
                    )
                  },
                  {
                    fieldName: "pending_unpaid_leave",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Pending Unpaid Leaves" }}
                      />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.pending_unpaid_leave
                            ? row.pending_unpaid_leave
                            : 0}
                        </span>
                      );
                    }
                  },

                  {
                    fieldName: "total_working_hours",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Total Working Hours" }}
                      />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.working_hours
                            ? row.working_hours + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "total_hours",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Actual Worked Hours" }}
                      />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.total_hours
                            ? row.total_hours + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "ot_work_hours",
                    label: <AlgaehLabel label={{ forceLabel: "OT Hours" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.complete_ot_hr
                            ? row.complete_ot_hr + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "shortage_hours",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Shortage Hours" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.complete_shortage_hr
                            ? row.complete_shortage_hr + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "ot_weekoff_hours",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Week Off OT" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.complete_weekoff_ot_hr
                            ? row.complete_weekoff_ot_hr + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  },
                  {
                    fieldName: "ot_holiday_hours",
                    label: <AlgaehLabel label={{ forceLabel: "Holiday OT" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.complete_holiday_ot_hr
                            ? row.complete_holiday_ot_hr + " Hrs"
                            : "00:00 Hrs"}
                        </span>
                      );
                    }
                  }
                ]}
                dataSource={{
                  data: props.data
                }}
                filter={true}
                paging={{ page: 0, rowsPerPage: 31 }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="popupFooter">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-4"> &nbsp;</div>

            <div className="col-lg-8">
              <button
                onClick={this.props.onClose}
                type="button"
                className="btn btn-default"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="popupFooter">
        <div className="col-lg-12">
          <button
            onClick={props.onClose}
            type="button"
            className="btn btn-other"
          >
            Close
          </button>
        </div>
      </div>
    </AlgaehModalPopUp>
  );
}

export default MonthlyDetail;
