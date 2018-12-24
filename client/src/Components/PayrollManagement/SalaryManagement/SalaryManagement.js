import React, { Component } from "react";
import "./SalaryManagement.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import ReactTable from "react-table";

import "react-table/react-table.css";
import treeTableHOC from "react-table/lib/hoc/treeTable";
const TreeTable = treeTableHOC(ReactTable);

export default class SalaryManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-SalaryManagement-form">
          <div className="row  inner-top-search">
            <AlgaehDateHandler
              div={{ className: "col-3 margin-bottom-15" }}
              label={{
                forceLabel: "From Date",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "date_of_joining",
                others: {
                  tabIndex: "6"
                }
              }}
              maxDate={new Date()}
            />
            <AlgaehDateHandler
              div={{ className: "col-3 margin-bottom-15" }}
              label={{
                forceLabel: "To Date",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "date_of_joining",
                others: {
                  tabIndex: "6"
                }
              }}
              maxDate={new Date()}
            />
            <div className="col-3 margin-bottom-15">
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 21 }}
              >
                Load
              </button>
            </div>
          </div>
          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  Attendance Regularization Status
                </h3>
              </div>
              <div className="actions">
                <a className="btn btn-primary btn-circle active">
                  {/* <i className="fas fa-calculator" /> */}
                </a>
              </div>
            </div>

            <div className="portlet-body">
              <div className="row">
                <div className="col-lg-12" id="Salary_Management_Cntr">
                  <AlgaehDataGrid
                    id="Salary_Management_Cntr_grid"
                    datavalidate="data-validate='groupDiv'"
                    columns={[
                      {
                        fieldName: "app_group_code",
                        label: "Group Code",
                        disabled: true
                      },
                      {
                        fieldName: "app_group_name",
                        label: "Group Name"
                      },
                      {
                        fieldName: "app_group_desc",
                        label: "Group Description",
                        disabled: true
                      },
                      {
                        fieldName: "app_group_type",
                        label: "Group Type",
                        disabled: true
                      }
                    ]}
                    keyId="algaeh_d_module_id"
                    dataSource={{
                      data: ""
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: () => {},
                      onDone: () => {}
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
