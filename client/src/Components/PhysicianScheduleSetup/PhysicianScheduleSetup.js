import React, { Component } from "react";
import "./phy_sch_setup.css";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import AlgaehReport from "../Wrapper/printReports";
import AppBar from "@material-ui/core/AppBar";
import PhysicianList from "./PhysicianList/PhysicianList";
import Scheduler from "./Scheduler/Scheduler";

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
          // userArea={
          //   <div className="row">
          //     <AlagehAutoComplete
          //       div={{ className: "col" }}
          //       label={{
          //         fieldName: "department_name"
          //       }}
          //       selector={{
          //         name: "sub_department_id",
          //         className: "select-fld",
          //         value: this.state.sub_department_id,
          //         dataSource: {
          //           textField: "sub_department_name",
          //           valueField: "sub_department_id",
          //           data: this.state.departments
          //         },
          //         onChange: this.deptDropDownHandler.bind(this)
          //       }}
          //     />

          //     <AlagehAutoComplete
          //       div={{ className: "col" }}
          //       label={{
          //         fieldName: "doctor"
          //       }}
          //       selector={{
          //         name: "provider_id",
          //         className: "select-fld",
          //         value: this.state.provider_id,
          //         dataSource: {
          //           textField: "full_name",
          //           valueField: "employee_id",
          //           data: this.state.doctors
          //         },
          //         onChange: this.dropDownHandler.bind(this)
          //       }}
          //     />
          //   </div>
          // }
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
          <PhysicianList doctors={this.state.doctors} />
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
