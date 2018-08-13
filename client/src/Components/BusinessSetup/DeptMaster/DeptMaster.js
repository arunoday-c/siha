import React, { Component } from "react";
import "./dept.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

class DeptMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      department_code: "",
      sub_department_code: "",
      department_name: "",
      department_desc: "",
      department_type: "",
      hospital_id: "1",
      effective_start_date: null,
      effective_end_date: "9999-12-31",
      department_status: "",
      created_by: "1",
      buttonText: "ADD TO LIST",
      checkedActive: false,
      checkedInactive: false,
      department_id: "",
      hims_d_department_id: "",
      sub_department_name: "",
      sub_department_desc: "",
      sub_department_status: "",
      subTableHeight: "",
      dtVlaue: new Date(),
      subdeps: []
    };
  }

  render() {
    return (
      <div className="dept">
        <Paper className="container-fluid">
          <div>
            <div className="row">
              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "department_code",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "department_code",
                  value: this.state.department_code,
                  events: {
                    // onChange: this.changeDeptCode.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "department_name",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "department_name",
                  value: this.state.department_name,
                  events: {
                    //  onChange: this.changeDeptName.bind(this)
                  }
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-lg-3" }}
                label={{
                  fieldName: "department_name_arabic",
                  isImp: true
                }}
                textBox={{
                  className: "txt-fld",
                  name: "department_name",
                  // value: this.state.department_name,
                  events: {
                    //  onChange: this.changeDeptName.bind(this)
                  }
                }}
              />
            </div>

            <div
              className="row"
              style={{
                marginTop: 20
              }}
            >
              <AlgaehDateHandler
                div={{ className: "col-lg-3" }}
                label={{ fieldName: "effective_start_date", isImp: true }}
                textBox={{ className: "txt-fld" }}
                maxDate={new Date()}
                events={
                  {
                    // onChange: this.changeEST.bind(this)
                  }
                }
              />
              <div className="col-lg-3">
                <label>
                  DEPARTMENT TYPE <span className="imp"> *</span>
                </label>
                <br />
                {/* <AlagehAutoComplete
                  selected={this.selectedDeptType.bind(this)}
                  children={DEPT_TYPE}
                /> */}
              </div>
              <div className="col-lg-3">
                <label>HEAD DEPARTMENT</label>
                <br />
                {/* <AlagehAutoComplete
                  children={SelectFiledData({
                    textField: "department_name",
                    valueField: "hims_d_department_id",
                    payload: this.props.departments
                  })}
                  selected={this.selectedHeadDept.bind(this)}
                /> */}
              </div>
              <div className="col-lg-3 align-middle">
                <br />
                <Button
                  //  onClick={this.addBtnClick.bind(this)}
                  variant="raised"
                  color="primary"
                >
                  {this.state.buttonText}
                </Button>
              </div>
            </div>
          </div>

          <div className="row form-details">
            <div className="col">
              <AlgaehDataGrid
                id="dept_grid"
                columns={[
                  {
                    fieldName: "dept_type_code",
                    label: <AlgaehLabel label={{ fieldName: "type_code" }} />,
                    disabled: true
                  }
                ]}
                keyId="dept_type_code"
                dataSource={{
                  data:
                    //this.props.visatypes === undefined
                    //?
                    []
                  //: this.props.visatypes
                }}
                isEditable={true}
                paging={{ page: 0, rowsPerPage: 5 }}
                events={{
                  // onDelete: this.deleteVisaType.bind(this),
                  onDelete: row => {},
                  onEdit: row => {}
                  // onDone: row => {
                  //   alert(JSON.stringify(row));
                  // }
                  // onDone: this.updateVisaTypes.bind(this)
                }}
              />
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    //departments: state.departments.departments,
    // subdepartments: state.subdepartments.subdepartments
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // getDepartments: getDepartments,
      // getSubDepartments: getSubDepartments
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeptMaster)
);
