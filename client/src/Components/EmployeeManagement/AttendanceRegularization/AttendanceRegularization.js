import React, { Component } from "react";
import "./AttendanceRegularization.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
export default class AttendanceRegularization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-employee-form popRightDiv">
          <div className="row">
            <div className="col-lg-12" id="Attendance_Regularization_Cntr">
              <AlgaehDataGrid
                id="Attendance_Regularization_grid"
                columns={[
                  {
                    fieldName: "module_code",
                    label: "Module Code",
                    columns: [
                      {
                        fieldName: "module_code2",
                        label: "Module Code 2",
                        disabled: true
                      },
                      {
                        fieldName: "module_code3",
                        label: "Module Code 3",
                        disabled: true
                      }
                    ]
                  },
                  {
                    Header: "Info",
                    columns: [
                      {
                        Header: "Age",
                        accessor: "age"
                      },
                      {
                        Header: "Status",
                        accessor: "status"
                      }
                    ]
                  },
                  {
                    Header: "Stats",
                    columns: [
                      {
                        Header: "Visits",
                        accessor: "visits"
                      }
                    ]
                  }
                ]}
                keyId="algaeh_d_module_id"
                dataSource={{
                  data: []
                }}
                isEditable={false}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  onEdit: () => {},
                  onDelete: "",
                  onDone: ""
                }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
