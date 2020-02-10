import React, { Component } from "react";
import "./business_setup.scss";
import "../../styles/site.scss";
import BranchMaster from "./BranchMaster/BranchMaster";
import DeptMaster from "./DeptMaster/DeptMaster";
// import HolidayList from "./HolidayList/HolidayList";
// import Numbering from "./Numbering/Numbering";
// import Transaction from "./Transaction/Transaction";
import Counter from "./Counter/Counter";
import Currency from "./Currency/Currency";
import Shift from "./Shift/Shift";
// import Category from "./Category/Category";
// import Speciality from "./Speciality/Speciality";
import UserShiftMapping from "./UserShiftMapping/UserShiftMapping";
// import CategorySpeciality from "./CategorySpecialityMapping/CategorySpeciality";
import BankMaster from "./BankMaster/BankMaster";
import CompanyAccount from "./CompanyAccount/CompanyAccount";
import ProjectMapping from "./ProjectMapping/ProjectMapping";
import ProjectMaster from "./ProjectMaster/ProjectMaster";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import _ from "lodash";
import { AlgaehTabs } from "algaeh-react-components";
import { MainContext } from "algaeh-react-components/context";

class BusinessSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "BranchMaster",
      HIMS_Active: false,
      screens_data: []
    };
  }
  static contextType = MainContext;

  UNSAFE_componentWillMount() {

    const userToken = this.context.userToken;
    const active =
      userToken.product_type === "HIMS_ERP" ||
        userToken.product_type === "HIMS_CLINICAL"
        ? true
        : false;
    let screens_data = [
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "departments"
            }}
          />
        ),
        children: (
          <ChildrenItem>
            <DeptMaster />
          </ChildrenItem>
        ),
        componentCode: "BUSS_DEPT"
      },
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "branch"
            }}
          />
        ),
        children: (
          <ChildrenItem>
            <BranchMaster />
          </ChildrenItem>
        ),
        componentCode: "BUSS_BRNH"
      }
    ];

    if (active) {
      screens_data.push(
        {
          title: (
            <AlgaehLabel
              label={{
                fieldName: "shift"
              }}
            />
          ),
          children: (
            <ChildrenItem>
              <Shift />
            </ChildrenItem>
          ),
          componentCode: "BUSS_SHIFT"
        },
        {
          title: (
            <AlgaehLabel
              label={{
                fieldName: "users_shift"
              }}
            />
          ),
          children: (
            <ChildrenItem>
              <UserShiftMapping />
            </ChildrenItem>
          ),
          componentCode: "BUSS_USERSHIFT"
        },
        {
          title: (
            <AlgaehLabel
              label={{
                fieldName: "counter"
              }}
            />
          ),
          children: (
            <ChildrenItem>
              <Counter />
            </ChildrenItem>
          ),
          componentCode: "BUSS_COUNTER"
        })
    }
    screens_data.push(
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "currency"
            }}
          />
        ),
        children: (
          <ChildrenItem>
            <Currency />
          </ChildrenItem>
        ),
        componentCode: "BUSS_CURR"
      },
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "bank_master"
            }}
          />
        ),
        children: (
          <ChildrenItem>
            <BankMaster />
          </ChildrenItem>
        ),
        componentCode: "BUSS_BANK"
      },
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "company_account"
            }}
          />
        ),
        children: (
          <ChildrenItem>
            <CompanyAccount />
          </ChildrenItem>
        ),
        componentCode: "BUSS_COMPANY"
      })
    this.setState({
      HIMS_Active: active,
      screens_data: screens_data
    });
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

        <AlgaehTabs
          removeCommonSection={true}
          content={this.state.screens_data}
        />

        {/* <div className="row">
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
              </li>{" "}
              <li
                algaehtabs={"ProjectMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Project Master"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ProjectMapping"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Project Mapping"
                    }}
                  />
                }
              </li>
              {/* {this.state.HIMS_Active === true ? (
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
              ) : null} */}
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
          ) : this.state.pageDisplay === "ProjectMapping" ? (
            <ProjectMapping />
          ) : this.state.pageDisplay === "ProjectMaster" ? (
            <ProjectMaster />
          ) : null}
        </div> */}
      </div>
    );
  }
}

function ChildrenItem({ children }) {
  return <div className="bussiness-section">{children}</div>;
}

export default BusinessSetup;
