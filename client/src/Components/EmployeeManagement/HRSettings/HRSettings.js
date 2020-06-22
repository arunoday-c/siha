import React, { Component } from "react";
import "./hr_settings.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import EmployeeGroups from "./EmployeeGroups/EmployeeGroups";
import EmployeeDesignations from "./EmployeeDesignations/EmployeeDesignations";
import AuthorizationSetup from "./AuthorizationSetup/AuthorizationSetup";
import DocumentMaster from "./DocumentMaster/DocumentMaster";
import AgencyMaster from "./AgencyMaster/AgencyMaster";
import { AlgaehTabs } from "algaeh-react-components";
import CreateTemplates from "./TemplateCreation";
class HRSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "EmployeeGroups",
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
      <div className="hr_settings">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Group Master",
                  }}
                />
              ),
              children: <EmployeeGroups />,
              componentCode: "HR_SET_GRP_MTR",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Designation Master",
                  }}
                />
              ),
              children: <EmployeeDesignations />,
              componentCode: "HR_SET_DES_MTR",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Document Master",
                  }}
                />
              ),
              children: <DocumentMaster />,
              componentCode: "HR_SET_AUT_SET",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Authorization Setup",
                  }}
                />
              ),
              children: <AuthorizationSetup />,
              componentCode: "HR_SET_DOC_MTR",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Certificate Master",
                  }}
                />
              ),
              children: <CreateTemplates />,
              componentCode: "HR_SET_CER_MTR",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Agency Master",
                  }}
                />
              ),
              children: <AgencyMaster />,
              componentCode: "HR_SET_AGS_MTR",
            },
          ]}
          renderClass="hrSettingsSection"
        />
      </div>
    );
  }
}

export default HRSettings;
