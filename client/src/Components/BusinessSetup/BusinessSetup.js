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
        }
      );
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
      },
      {
        title: (
          <AlgaehLabel
            label={{
              forceLabel: "Project Mapping"
            }}
          />
        ),
        children: (
          <ChildrenItem>
            <ProjectMapping />
          </ChildrenItem>
        ),
        componentCode: "BUSS_PRJ_MAP"
      },
      {
        title: (
          <AlgaehLabel
            label={{
              forceLabel: "Project Master"
            }}
          />
        ),
        children: (
          <ChildrenItem>
            <ProjectMaster />
          </ChildrenItem>
        ),
        componentCode: "BUSS_PRJ_MTR"
      }
    );
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
    debugger;
    return (
      <div className="business_setup">
        <AlgaehTabs
          removeCommonSection={true}
          content={this.state.screens_data}
        />
      </div>
    );
  }
}

function ChildrenItem({ children }) {
  return <div className="bussiness-section">{children}</div>;
}

export default BusinessSetup;
