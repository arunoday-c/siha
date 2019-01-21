import React, { Component } from "react";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import moment from "moment";

export default class HolidayListSelf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holidays: []
    };
    this.getHolidayMaster();
  }

  getHolidayMaster() {
    algaehApiCall({
      uri: "/holiday/getAllHolidays",
      method: "GET",
      data: {
        hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
          .hims_d_hospital_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            holidays: res.data.records
          });
        }
      },
      onFailure: err => {}
    });
  }

  render() {
    return (
      <div>
        <AlgaehDataGrid
          columns={[
            {
              fieldName: "holiday_date",
              label: <AlgaehLabel label={{ forceLabel: "Holiday Date" }} />,
              displayTemplate: row => {
                return (
                  <span>{moment(row.holiday_date).format("DD-MM-YYYY")}</span>
                );
              }
            },
            {
              fieldName: "holiday_description",
              label: (
                <AlgaehLabel label={{ forceLabel: "Holyday Description" }} />
              )
            },
            {
              fieldName: "holiday",
              label: (
                <AlgaehLabel label={{ forceLabel: "Holiday / Week Off" }} />
              ),
              displayTemplate: row => {
                return (
                  <span>
                    {row.holiday === "Y"
                      ? "Holiday"
                      : row.weekoff === "Y"
                      ? "Week Off"
                      : "------"}
                  </span>
                );
              }
            },
            {
              fieldName: "holiday_type",
              label: <AlgaehLabel label={{ forceLabel: "Holiday Type" }} />,
              displayTemplate: row => {
                return (
                  <span>
                    {row.holiday_type === "RE"
                      ? "Regular"
                      : row.holiday_type === "RS"
                      ? "Restricted"
                      : "------"}
                  </span>
                );
              }
            },
            {
              fieldName: "religion_name",
              label: <AlgaehLabel label={{ forceLabel: "Applicable For" }} />,
              displayTemplate: row => {
                return (
                  <span>
                    {row.religion_name !== null ? row.religion_name : "ALL"}
                  </span>
                );
              }
            }
          ]}
          keyId="hims_d_holiday_id"
          dataSource={{
            data: this.state.holidays
          }}
          isEditable={false}
          filterable
          paging={{ page: 0, rowsPerPage: 20 }}
        />
      </div>
    );
  }
}
