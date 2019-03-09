import React from "react";
import {
  AlgaehDataGrid,
  AlgaehModalPopUp,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import moment from "moment";

function MonthlyDetail(props) {
  return (
    <AlgaehModalPopUp
      title="Monthly Detail"
      openPopup={props.open}
      events={{
        onClose: props.onClose
      }}
    >
      <AlgaehLabel
        label={{
          forceLabel: props.employee_name
        }}
      />

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
          {
            fieldName: "year",
            label: <AlgaehLabel label={{ forceLabel: "Year" }} />
          },
          {
            fieldName: "month",
            label: <AlgaehLabel label={{ forceLabel: "month" }} />
          },
          {
            fieldName: "total_days",
            label: <AlgaehLabel label={{ forceLabel: "Total Days" }} />
          },
          {
            fieldName: "total_work_days",
            label: <AlgaehLabel label={{ forceLabel: "Total Work Days" }} />
          },
          {
            fieldName: "present_days",
            label: <AlgaehLabel label={{ forceLabel: "Present Days" }} />
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
            label: <AlgaehLabel label={{ forceLabel: "Unpaid Leaves" }} />
          },
          {
            fieldName: "pending_unpaid_leave",
            label: (
              <AlgaehLabel label={{ forceLabel: "Pending Unpaid Leaves" }} />
            ),
            displayTemplate: row => {
              return (
                <span>
                  {row.pending_unpaid_leave ? row.pending_unpaid_leave : 0}
                </span>
              );
            }
          },
          //   {
          //     fieldName: "total_paid_days",
          //     label: <AlgaehLabel label={{ forceLabel: "Total Paid Days" }} />
          //   },
          //   {
          //     fieldName: "total_holidays",
          //     label: <AlgaehLabel label={{ forceLabel: "Total Holidays" }} />
          //   },
          //   {
          //     fieldName: "total_weekoff_days",
          //     label: <AlgaehLabel label={{ forceLabel: "Total Week Off Days" }} />
          //   },
          {
            fieldName: "total_working_hours",
            label: (
              <AlgaehLabel label={{ forceLabel: "Total Working Hours" }} />
            ),
            displayTemplate: row => {
              return (
                <span>
                  {row.total_working_hours
                    ? row.total_working_hours + " Hrs"
                    : "00:00 Hrs"}
                </span>
              );
            }
          },
          {
            fieldName: "total_hours",
            label: <AlgaehLabel label={{ forceLabel: "Total Worked Hours" }} />,
            displayTemplate: row => {
              return (
                <span>
                  {row.total_hours ? row.total_hours + " Hrs" : "00:00 Hrs"}
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
                  {row.ot_work_hours ? row.ot_work_hours + " Hrs" : "00:00 Hrs"}
                </span>
              );
            }
          },
          {
            fieldName: "shortage_hours",
            label: <AlgaehLabel label={{ forceLabel: "Shortage Hours" }} />,
            displayTemplate: row => {
              return (
                <span>
                  {row.shortage_hours
                    ? row.shortage_hours + " Hrs"
                    : "00:00 Hrs"}
                </span>
              );
            }
          },
          {
            fieldName: "ot_weekoff_hours",
            label: <AlgaehLabel label={{ forceLabel: "Week Off OT" }} />,
            displayTemplate: row => {
              return (
                <span>
                  {row.ot_weekoff_hours
                    ? row.ot_weekoff_hours + " Hrs"
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
                  {row.ot_holiday_hours
                    ? row.ot_holiday_hours + " Hrs"
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
    </AlgaehModalPopUp>
  );
}

export default MonthlyDetail;
