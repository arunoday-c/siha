import React, { Component } from "react";
import "./perf_mgmt.scss";
import PerformanceReview from "./PerformanceReview/PerformanceReview";
import SalaryApprisal from "./SalaryApprisal/SalaryApprisal";
import AppraisalMatrixMaster from "./AppraisalMatrixMaster/AppraisalMatrixMaster";
import PerfoParaMaster from "./PerfoParaMaster/PerfoParaMaster";

import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";

class PerformanceManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "AppraisalMatrixMaster",
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
      pageDisplay: specified,
    });
  }

  render() {
    return (
      <div className="perf_mgmt">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Appraisal Matrix Master",
                  }}
                />
              ),
              children: <AppraisalMatrixMaster />,
              componentCode: "PER_MAT_MST",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Performance Parameters Master",
                  }}
                />
              ),
              children: <PerfoParaMaster />,
              componentCode: "PER_QST_MST",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Performance Review",
                  }}
                />
              ),
              children: <PerformanceReview />,
              componentCode: "PER_PER_REV",
            },

            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Salary Apprisal",
                  }}
                />
              ),
              children: <SalaryApprisal />,
              componentCode: "PER_SAL_APP",
            },
          ]}
          renderClass="performanceManagementSection"
        />
      </div>
    );
  }
}

export default PerformanceManagement;
