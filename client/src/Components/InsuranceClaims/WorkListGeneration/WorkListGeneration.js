import React, { Component } from "react";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import "./WorkListGeneration.scss";

import AlgaehLabel from "../../Wrapper/label.js";

// import moment from "moment";
// import Options from "../../../Options.json";

class WorkListGeneration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en"
    };
  }

  render() {
    return (
      <div className="" style={{ marginBottom: "50px" }}>
        <BreadCrumb
          title={
            <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "form_home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
              )
            }
          ]}
        />
      </div>
    );
  }
}

export default WorkListGeneration;
