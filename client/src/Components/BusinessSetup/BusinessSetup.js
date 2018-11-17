import React, { Component } from "react";
import "./business_setup.css";
import "../../styles/site.css";
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
import { AlgaehLabel } from "../Wrapper/algaehWrapper";

class BusinessSetup extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "DeptMaster" };
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
                algaehtabs={"Speciality"}
                style={{ marginRight: 2 }}
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
              <li
                algaehtabs={"Category"}
                style={{ marginRight: 2 }}
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
              <li
                algaehtabs={"CategorySpeciality"}
                style={{ marginRight: 2 }}
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
            </ul>
          </div>
        </div>
        <div className="business-section">
          {this.state.pageDisplay === "DeptMaster" ? (
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
          ) : this.state.pageDisplay === "CategorySpeciality" ? (
            <CategorySpeciality />
          ) : null}
        </div>
      </div>
    );
  }
}

export default BusinessSetup;
