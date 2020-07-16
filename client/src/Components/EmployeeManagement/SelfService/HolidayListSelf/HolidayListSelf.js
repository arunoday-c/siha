import React, { Component } from "react";
import "./HolidayListSelf.scss";
import { algaehApiCall } from "../../../../utils/algaehApiCall";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import moment from "moment";
import { MainContext } from "algaeh-react-components";

export default class HolidayListSelf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holidays: [],
    };
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState(
      {
        hospital_id: userToken.hims_d_hospital_id,
      },
      () => {
        this.getHolidayMaster();
      }
    );
  }
  getHolidayMaster() {
    algaehApiCall({
      uri: "/payrollsettings/getAllHolidays",
      module: "hrManagement",
      method: "GET",

      data: {
        hospital_id: this.state.hospital_id, //"",
        type: "H",
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            holidays: res.data.records.weekoffs,
          });
        }
      },
      onFailure: (err) => {},
    });
  }

  render() {
    return (
      <div className="row HolidayListSelfScreen">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Holiday List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="HolidayListSelf_Cntr">
                  <AlgaehDataGrid
                    id="HolidayListSelf"
                    datavalidate="HolidayListSelf"
                    columns={[
                      {
                        fieldName: "holiday_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday Date" }} />
                        ),
                        others: {
                          maxWidth: 150,
                        },
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {moment(row.holiday_date).format("DD-MMM-YYYY")}
                            </span>
                          );
                        },
                      },
                      {
                        fieldName: "holiday_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Holyday Description" }}
                          />
                        ),
                      },
                      {
                        fieldName: "holiday_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Holiday Type" }} />
                        ),
                        others: {
                          maxWidth: 150,
                        },
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.holiday_type === "RE"
                                ? "Regular"
                                : row.holiday_type === "RS"
                                ? "Restricted"
                                : "------"}
                            </span>
                          );
                        },
                      },
                      {
                        fieldName: "religion_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Applicable For" }}
                          />
                        ),
                        others: {
                          maxWidth: 150,
                        },
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.religion_name !== null
                                ? row.religion_name
                                : "ALL"}
                            </span>
                          );
                        },
                      },
                    ]}
                    keyId="hims_d_holiday_id"
                    dataSource={{
                      data: this.state.holidays,
                    }}
                    isEditable={false}
                    filterable
                    paging={{ page: 0, rowsPerPage: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
