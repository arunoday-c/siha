import React, { useState } from "react";
import { AlgaehModal } from "algaeh-react-components";
import LabResults from "../Assessment/LabResult/LabResult";
import RadResults from "../Assessment/RadResult/RadResult";
// import SubjectiveHandler from "./SubjectiveHandler";

import {
  AlgaehLabel,
  // AlagehFormGroup,
  // AlgaehDateHandler,
  // AlagehAutoComplete,
  // AlgaehDataGrid,
} from "../../Wrapper/algaehWrapper";
import "./AllReportsModal.scss";
import { Validations } from "../Subjective/Validation";
// import _ from "lodash";
// import AlgaehLoader from "../../Wrapper/fullPageLoader";

export default function AllReports(props) {
  const [pageDisplay, setPageDisplay] = useState("LabResults");

  const openTab = (e) => {
    const err = Validations(props.this);
    if (!err) {
      var element = document.querySelectorAll("[algaehtabs]");
      for (var i = 0; i < element.length; i++) {
        element[i].classList.remove("active");
      }
      e.currentTarget.classList.add("active");
      var specified = e.currentTarget.getAttribute("algaehtabs");
      setPageDisplay(specified);
    }
  };
  return (
    <AlgaehModal
      title="All Reports"
      visible={props.visible}
      maskClosable={false}
      width={540}
      closable={true}
      cancelButtonProps={{
        className: "btn btn-default",
      }}
      onCancel={props.onCancel}
      // onOk={handleSubmit(onSubmit)}
      className={`algaehNewModal AllReportsModal`}
    >
      <div className="col-12">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              algaehtabs={"LabResults"}
              className={"nav-item tab-button active"}
              onClick={openTab}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Lab Results",
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"RisResults"}
              className={"nav-item tab-button"}
              onClick={openTab}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "RIS Results",
                  }}
                />
              }
            </li>
          </ul>
        </div>

        <div className="grid-section">
          {pageDisplay === "LabResults" ? (
            <LabResults allReports={true} />
          ) : pageDisplay === "RisResults" ? (
            <RadResults />
          ) : null}
        </div>
      </div>
      {/* <Spin
      // spinning={
      //   anLoading || vLoading || inLoading || pvLoading || testLoading
      // }
      >
        <div className="row popupInner">sdjfhgjasdgfkjhsgf</div>
      </Spin> */}
    </AlgaehModal>
  );
}
