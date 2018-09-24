import React, { Component } from "react";
import "./phy_sch_setup.css";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { AlgaehLabel, AlagehAutoComplete } from "../Wrapper/algaehWrapper";
import AlgaehReport from "../Wrapper/printReports";
import AppBar from "@material-ui/core/AppBar";
import PhysicianList from "./PhysicianList/PhysicianList";
import Scheduler from "./Scheduler/Scheduler";
import Enumerable from "linq";
import { algaehApiCall } from "../../utils/algaehApiCall";
import swal from "sweetalert";

class PhysicianScheduleSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      doctors: []
    };
  }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value });
  }

  deptDropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let dept = Enumerable.from(this.state.departments)
        .where(w => w.sub_department_id === this.state.sub_department_id)
        .firstOrDefault();
      this.setState({ doctors: dept.doctors });
    });
  }

  getDoctorsAndDepts() {
    algaehApiCall({
      uri: "/department/get/get_All_Doctors_DepartmentWise",
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          console.log("DocsDepts:", response.data.records);
          this.setState({
            departments: response.data.records.departmets,
            doctors: response.data.records.doctors
          });
        }
      },
      onFailure: error => {
        swal(error.message, {
          buttons: false,
          icon: "error",
          timer: 2000
        });
      }
    });
  }

  componentDidMount() {
    this.getDoctorsAndDepts();
  }

  render() {
    return (
      <div className="phy-sch-setup">
        <BreadCrumb
          title={
            <AlgaehLabel label={{ fieldName: "phy_sch_setup", align: "ltr" }} />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: "Front Desk"
            },
            {
              pageName: "Physician Schedule Setup"
            }
          ]}
          userArea={
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "department_name"
                }}
                selector={{
                  name: "sub_department_id",
                  className: "select-fld",
                  value: this.state.sub_department_id,
                  dataSource: {
                    textField: "sub_department_name",
                    valueField: "sub_department_id",
                    data: this.state.departments
                  },
                  onChange: this.deptDropDownHandler.bind(this)
                }}
              />

              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  fieldName: "doctor"
                }}
                selector={{
                  name: "provider_id",
                  className: "select-fld",
                  value: this.state.provider_id,
                  dataSource: {
                    textField: "full_name",
                    valueField: "employee_id",
                    data: this.state.doctors
                  },
                  onChange: this.dropDownHandler.bind(this)
                }}
              />
            </div>
          }
          printArea={{
            menuitems: [
              {
                label: "Print Receipt",
                events: {
                  onClick: () => {
                    AlgaehReport({
                      report: {
                        fileName: "printreceipt"
                      },
                      data: {
                        doctor: "Norman John"
                      }
                    });
                  }
                }
              }
            ]
          }}
        />

        <div className="spacing-push">
          <PhysicianList />
        </div>
        <div className="margin-top-15">
          <Scheduler />
        </div>

        <div className="hptl-phase1-footer">
          <AppBar position="static" className="main">
            <div className="row">
              <div className="col-lg-12">
                <button type="button" className="btn btn-primary">
                  Save
                </button>

                <button type="button" className="btn btn-default">
                  Cancel
                </button>
              </div>
            </div>
          </AppBar>
        </div>
      </div>
    );
  }
}

export default PhysicianScheduleSetup;
