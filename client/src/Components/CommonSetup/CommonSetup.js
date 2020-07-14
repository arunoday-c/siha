import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./common_setup.scss";
import "../../index.scss";
import PatientType from "./PatientType/PatientType.js";
import VisaType from "./VisaType/VisaType.js";
import IDType from "./IDType/IDType";
import VisitType from "./VisitType/VisitType";
import InsuranceCardClass from "./InsuranceCardClass/InsuranceCardClass";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";
import { AlgaehTabs, MainContext } from "algaeh-react-components";

class CommonSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "VisaType",
      HIMS_Active: false,
      screens_data: [],
    };
  }

  static contextType = MainContext;
  componentDidMount() {
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
              fieldName: "visa_type",
            }}
          />
        ),
        children: <VisaType />,
        componentCode: "COMM_VISA",
      },
      {
        title: (
          <AlgaehLabel
            label={{
              fieldName: "identification_type",
            }}
          />
        ),
        children: <IDType />,
        componentCode: "COMM_ID",
      },
    ];

    if (active) {
      screens_data.push(
        {
          title: (
            <AlgaehLabel
              label={{
                fieldName: "visit_type",
              }}
            />
          ),
          children: <VisitType />,
          componentCode: "COMM_VISIT",
        },
        {
          title: (
            <AlgaehLabel
              label={{
                fieldName: "patient_type",
              }}
            />
          ),
          children: <PatientType />,
          componentCode: "COMM_PAT_TYPE",
        }
      );
    }

    this.setState({
      HIMS_Active: active,
      screens_data: screens_data,
    });

    this.props.getUserDetails({
      uri: "/algaehappuser/selectAppUsers",
      method: "GET",
      redux: {
        type: "USER_DETAILS_GET_DATA",
        mappingName: "userdrtails",
      },
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
      <div className="common_setup">
        <AlgaehTabs
          removeCommonSection={true}
          content={this.state.screens_data}
          renderClass="CommSetupSection"
        />
      </div>
    );

    // return (

    // <div className="common_setup">
    //   <div className="row">
    //     <div className="tabMaster toggle-section">
    //       <ul className="nav">
    //         <li
    //           algaehtabs={"VisaType"}
    //           className={"nav-item  tab-button active"}
    //           onClick={this.openTab.bind(this)}
    //         >
    //           {
    //             <AlgaehLabel
    //               label={{
    //                 fieldName: "visa_type",
    //               }}
    //             />
    //           }
    //         </li>

    //         <li
    //           algaehtabs={"IDType"}
    //           className={"nav-item tab-button"}
    //           onClick={this.openTab.bind(this)}
    //         >
    //           {
    //             <AlgaehLabel
    //               label={{
    //                 fieldName: "identification_type",
    //               }}
    //             />
    //           }
    //         </li>

    //         {this.state.HIMS_Active === true ? (
    //           <li
    //             algaehtabs={"VisitType"}
    //             className={"nav-item tab-button"}
    //             onClick={this.openTab.bind(this)}
    //           >
    //             {
    //               <AlgaehLabel
    //                 label={{
    //                   fieldName: "visit_type",
    //                 }}
    //               />
    //             }
    //           </li>

    //           <li
    //             algaehtabs={"PatientType"}
    //             className={"nav-item tab-button"}
    //             onClick={this.openTab.bind(this)}
    //           >
    //             {
    //               <AlgaehLabel
    //                 label={{
    //                   fieldName: "patient_type",
    //                 }}
    //               />
    //             }
    //           </li>
    //         ) : null}

    //       </ul>
    //     </div>
    //   </div>
    //   <div className="common-section">
    //     {this.state.pageDisplay === "VisitType" ? (
    //       <VisitType />
    //     ) : this.state.pageDisplay === "VisaType" ? (
    //       <VisaType />
    //     ) : this.state.pageDisplay === "IDType" ? (
    //       <IDType />
    //     ) : this.state.pageDisplay === "PatientType" ? (
    //       <PatientType />
    //     ) : this.state.pageDisplay === "InsuranceCardClass" ? (
    //       <InsuranceCardClass />
    //     ) : null}
    //   </div>
    // </div>
    // );
  }
}

function mapStateToProps(state) {
  return {
    userdrtails: state.userdrtails,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CommonSetup)
);
