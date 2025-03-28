import React, { Component } from "react";
import "./admin_setup.scss";
import LoginUsers from "./LoginUsers/LoginUsers";
import Roles from "./Roles/Roles";
import Groups from "./Groups/Groups";
import ScreenAssignment from "./ScreenAssignment/ScreenAssignment";
import AuditLog from "./AuditLog/AuditLog";
import EnableAudit from "./EnableAudit";
// import ComponentElementAssignment from "./ComponentElementAssignment/ComponentElementAssignment";
// import ApiConfig from "./APIConfig";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";
import { setCookie } from "../../utils/algaehApiCall";
class AdminSetup extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "Groups" };
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

  componentDidMount() {
    setCookie("ScreenName", "AdministrationSetup", 30);
    setCookie("module_id", 2, 30);
    setCookie("ScreenCode", "ST0001", 30);
  }
  render() {
    return (
      <div className="admin_setup">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Group",
                  }}
                />
              ),
              children: <Groups />,
              componentCode: "AD_USER_GROUP",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Roles",
                  }}
                />
              ),
              children: <Roles />,
              componentCode: "AD_USER_ROLES",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Login Users",
                  }}
                />
              ),
              children: <LoginUsers />,
              componentCode: "AD_USER_LOGIN",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Screen Assignment",
                  }}
                />
              ),
              children: <ScreenAssignment />,
              componentCode: "AD_SCR_ASSI",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Enable Auditing",
                  }}
                />
              ),
              children: <EnableAudit />,
              componentCode: "AD_ENA_AUD_LOG",
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Audit Log",
                  }}
                />
              ),
              children: <AuditLog />,
              componentCode: "AD_AUD_LOG",
            },
          ]}
          renderClass="adminSettingsSection"
        />
      </div>
    );
  }
}
// function ChildrenItem({ children }) {
//   return <div className="admin-section">{children}</div>;
// }
export default AdminSetup;
