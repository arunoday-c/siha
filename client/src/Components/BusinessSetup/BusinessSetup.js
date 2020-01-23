import React, { Component } from "react";
import "./business_setup.scss";
import "../../styles/site.scss";
import BranchMaster from "./BranchMaster/BranchMaster";
import DeptMaster from "./DeptMaster/DeptMaster";
import HolidayList from "./HolidayList/HolidayList";
import Numbering from "./Numbering/Numbering";
import Transaction from "./Transaction/Transaction";
import Counter from "./Counter/Counter";
import Currency from "./Currency/Currency";
import Shift from "./Shift/Shift";
import Category from "./Category/Category";
import Speciality from "./Speciality/Speciality";
import UserShiftMapping from "./UserShiftMapping/UserShiftMapping";
import CategorySpeciality from "./CategorySpecialityMapping/CategorySpeciality";
import BankMaster from "./BankMaster/BankMaster";
import CompanyAccount from "./CompanyAccount/CompanyAccount";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehOpenContainer } from "../../utils/GlobalFunctions";
import _ from "lodash";
import { CheckElement } from "../Wrapper";

class BusinessSetup extends Component {
  constructor(props) {
    super(props);
    let Activated_Modueles = JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("ModuleDetails"))
    );
    const HIMS_Active = _.filter(Activated_Modueles, f => {
      return f.module_code === "FTDSK";
    });
    this.state = {
      pageDisplay: "DeptMaster",
      HIMS_Active: HIMS_Active.length > 0 ? true : false
    };
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified
    });
  }

  render() {
    return (
      <div className="business_setup">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"DeptMaster"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "departments"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"BranchMaster"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Branch"
                    }}
                  />
                }
              </li>
              {this.state.HIMS_Active === true ? (
                <li
                  algaehtabs={"Speciality"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        fieldName: "speciality"
                      }}
                    />
                  }
                </li>
              ) : null}
              {this.state.HIMS_Active === true ? (
                <li
                  algaehtabs={"Category"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        fieldName: "category"
                      }}
                    />
                  }
                </li>
              ) : null}
              {this.state.HIMS_Active === true ? (
                <li
                  algaehtabs={"CategorySpeciality"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        fieldName: "category_speciality_map"
                      }}
                    />
                  }
                </li>
              ) : null}
              <li
                algaehtabs={"Shift"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "shift"
                    }}
                  />
                }
              </li>
              {this.state.HIMS_Active === true ? (
                <li
                  algaehtabs={"UserShiftMapping"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        fieldName: "users_shift"
                      }}
                    />
                  }
                </li>
              ) : null}
              {this.state.HIMS_Active === true ? (
                <li
                  algaehtabs={"Counter"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        fieldName: "counter"
                      }}
                    />
                  }
                </li>
              ) : null}
              <li
                algaehtabs={"Currency"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "currency"
                    }}
                  />
                }
              </li>
              <CheckElement permission={"businesssetup-bankmaster"}>
                <li
                  algaehtabs={"BankMaster"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Bank Master"
                      }}
                    />
                  }
                </li>
              </CheckElement>
              <li
                algaehtabs={"CompanyAccount"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Company Account"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="business-section">
          {this.state.pageDisplay === "BranchMaster" ? (
            <BranchMaster />
          ) : this.state.pageDisplay === "DeptMaster" ? (
            <DeptMaster />
          ) : this.state.pageDisplay === "Holiday" ? (
            <HolidayList />
          ) : this.state.pageDisplay === "Counter" ? (
            <Counter />
          ) : this.state.pageDisplay === "Shift" ? (
            <Shift />
          ) : this.state.pageDisplay === "Transaction" ? (
            <Transaction />
          ) : this.state.pageDisplay === "Numbering" ? (
            <Numbering />
          ) : this.state.pageDisplay === "UserShiftMapping" ? (
            <UserShiftMapping />
          ) : this.state.pageDisplay === "Currency" ? (
            <Currency />
          ) : this.state.pageDisplay === "Category" ? (
            <Category />
          ) : this.state.pageDisplay === "Speciality" ? (
            <Speciality />
          ) : this.state.pageDisplay === "BankMaster" ? (
            <BankMaster />
          ) : this.state.pageDisplay === "CompanyAccount" ? (
            <CompanyAccount />
          ) : this.state.pageDisplay === "CategorySpeciality" ? (
            <CategorySpeciality />
          ) : null}
        </div>
      </div>
    );
  }
}

export default BusinessSetup;
