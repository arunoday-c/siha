import jsbarcode from "jsbarcode";
import React from "react";
import ReactDOM from "react-dom";
import "./wrapper.scss";
import { AlgaehLabel } from "./algaehWrapper";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
const reportWindow = document.getElementById("reportWindow");

let accessReport = options => {
  debugger;
  const fileName = "./Reports/" + options.reportName + ".html";

  var xhr = new XMLHttpRequest();
  xhr.open("GET", fileName, true);
  xhr.onreadystatechange = function() {
    debugger;
    if (this.response != "") {
      var parser = new DOMParser();
      let _html = parser.parseFromString(this.response, "text/xml");
      debugger;
    }
  };
  xhr.send();
};
let AlgaehReport = options => {
  accessReport(options);
};

let openTab = e => {
  var element = document.querySelectorAll("[algaehtabs]");
  for (var i = 0; i < element.length; i++) {
    element[i].classList.remove("active");
  }
  e.currentTarget.classList.add("active");
  var specified = e.currentTarget.getAttribute("algaehtabs");
  this.setState({
    pageDisplay: specified
  });
};

renderPopup => {
  return (
    <div>
      <Modal open={this.state.openPopup}>
        <div className="algaeh-modal">
          <div className="row popupHeader">
            <h4>Print Preview</h4>
          </div>
          <div className="col-lg-12 popupInner">
            <div className="tab-container toggle-section">
              <ul className="nav">
                <li
                  algaehtabs={"Report1"}
                  style={{ marginRight: 2 }}
                  className={"nav-item tab-button active"}
                  onClick={openTab()}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Report 1"
                      }}
                    />
                  }
                </li>
                <li
                  style={{ marginRight: 2 }}
                  algaehtabs={"Report2"}
                  className={"nav-item tab-button"}
                  onClick={openTab()}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Report 2"
                      }}
                    />
                  }
                </li>
                <li
                  style={{ marginRight: 2 }}
                  algaehtabs={"Report3"}
                  className={"nav-item tab-button"}
                  onClick={openTab()}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Report 3"
                      }}
                    />
                  }
                </li>
                <li
                  style={{ marginRight: 2 }}
                  algaehtabs={"Report4"}
                  className={"nav-item tab-button"}
                  onClick={openTab()}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Report 4"
                      }}
                    />
                  }
                </li>
                <li
                  style={{ marginRight: 2 }}
                  algaehtabs={"Report5"}
                  className={"nav-item tab-button"}
                  onClick={openTab()}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Report 5"
                      }}
                    />
                  }
                </li>
              </ul>
            </div>
            <div className="report-section">
              {/* Display Selected Reports here */}
              Report 1
            </div>
          </div>
          <div className="row popupFooter">
            <Button
              variant="raised"
              //onClick={this.handleClose}
              style={{ backgroundColor: "#D5D5D5" }}
              size="small"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default AlgaehReport;
