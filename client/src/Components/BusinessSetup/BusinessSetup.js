import React, { Component } from "react";
import "./business_setup.scss";
import "../../styles/site.scss";
import BranchMaster from "./BranchMaster/BranchMaster";
import DeptMaster from "./DeptMaster/DeptMaster";
import Counter from "./Counter/Counter";
import Currency from "./Currency/Currency";
import Shift from "./Shift/Shift";
import UserShiftMapping from "./UserShiftMapping/UserShiftMapping";
import BankMaster from "./BankMaster/BankMaster";
import CompanyAccount from "./CompanyAccount/CompanyAccount";
import ProjectMapping from "./ProjectMapping/ProjectMapping";
import ProjectMaster from "./ProjectMaster/ProjectMaster";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";
import { MainContext } from "algaeh-react-components";

class BusinessSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "BranchMaster",
      HIMS_Active: false,
      screens_data: [],
    };
  }
  static contextType = MainContext;

  UNSAFE_componentWillMount() {
    const userToken = this.context.userToken;
    const active =
      userToken.product_type === "HIMS_ERP" ||
      userToken.product_type === "HIMS_CLINICAL" ||
      userToken.product_type === "NO_FINANCE"
        ? true
        : false;
    let screens_data = [
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "departments",
            }}
          />
        ),
        children: <DeptMaster />,
        componentCode: "BUSS_DEPT",
      },
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "branch",
            }}
          />
        ),
        children: <BranchMaster />,
        componentCode: "BUSS_BRNH",
      },
    ];

    if (active) {
      screens_data.push(
        {
          title: (
            <AlgaehLabel
              label={{
                fieldName: "shift",
              }}
            />
          ),
          children: <Shift />,
          componentCode: "BUSS_SHIFT",
        },
        {
          title: (
            <AlgaehLabel
              label={{
                fieldName: "users_shift",
              }}
            />
          ),
          children: <UserShiftMapping />,
          componentCode: "BUSS_USERSHIFT",
        },
        {
          title: (
            <AlgaehLabel
              label={{
                fieldName: "counter",
              }}
            />
          ),
          children: <Counter />,
          componentCode: "BUSS_COUNTER",
        }
      );
    }
    screens_data.push(
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "currency",
            }}
          />
        ),
        children: <Currency />,
        componentCode: "BUSS_CURR",
      },
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "bank_master",
            }}
          />
        ),
        children: <BankMaster />,
        componentCode: "BUSS_BANK",
      },
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "company_account",
            }}
          />
        ),
        children: <CompanyAccount />,
        componentCode: "BUSS_COMPANY",
      },
      {
        title: (
          <AlgaehLabel
            label={{
              forceLabel: "Project Master",
            }}
          />
        ),
        children: <ProjectMaster />,
        componentCode: "BUSS_PRJ_MTR",
      },
      {
        title: (
          <AlgaehLabel
            label={{
              forceLabel: "Project Mapping",
            }}
          />
        ),
        children: <ProjectMapping />,
        componentCode: "BUSS_PRJ_MAP",
      }
    );
    this.setState({
      HIMS_Active: active,
      screens_data: screens_data,
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
      pageDisplay: specified,
    });
  }

  render() {
    return (
      <div className="business_setup">
        <AlgaehTabs
          removeCommonSection={true}
          content={this.state.screens_data}
          renderClass="BusSetupSection"
        />
      </div>
    );
  }
}

// function ChildrenItem({ children }) {
//   return <div className="bussiness-section">{children}</div>;
// }

export default BusinessSetup;
