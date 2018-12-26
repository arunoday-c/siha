import React, { Component } from "react";
import "./leave_master.css";
import AlgaehModalPopUp from "../../../../Wrapper/modulePopUp";
import LeaveEntitlement from "./LeaveEntitlement/LeaveEntitlement";
import LeaveDetails from "./LeaveDetails/LeaveDetails";
import LeaveEncashment from "./LeaveEncashment/LeaveEncashment";
import LeaveRules from "./LeaveRules/LeaveRules";
import { AlgaehLabel } from "../../../../Wrapper/algaehWrapper";

class LeaveMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "LeaveEntitlement"
    };
  }

  openTab(e) {
    var specified = e.currentTarget.getAttribute("algaehtabs");
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");

    this.setState({
      pageDisplay: specified
    });
  }

  componentDidMount() {
    this.setState({
      open: this.props.open
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open
    });
  }

  render() {
    return (
      <div className="hims_leave_master">
        <AlgaehModalPopUp
          openPopup={this.state.open}
          events={{
            onClose: () => {
              this.setState({
                open: false
              });
            }
          }}
        >
          <div className=" leaveMasterMainPage">
            <div className="tab-container toggle-section">
              <ul className="nav">
                <li
                  algaehtabs={"LeaveEntitlement"}
                  className={"nav-item tab-button active"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Leave Entitlement"
                      }}
                    />
                  }
                </li>

                <li
                  algaehtabs={"LeaveDetails"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Leave Details"
                      }}
                    />
                  }
                </li>
                <li
                  algaehtabs={"LeaveEncashment"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Leave Encashment"
                      }}
                    />
                  }
                </li>
                <li
                  algaehtabs={"LeaveRules"}
                  className={"nav-item tab-button"}
                  onClick={this.openTab.bind(this)}
                >
                  {
                    <AlgaehLabel
                      label={{
                        forceLabel: "Leave Rules"
                      }}
                    />
                  }
                </li>
              </ul>
            </div>
            {/* <MyContext.Provider
                  value={{
                    state: this.state,
                    updateState: obj => {
                      this.setState({ ...obj });
                    }
                  }}
                > */}
            <div className="popupInner">
              {this.state.pageDisplay === "LeaveEntitlement" ? (
                <LeaveEntitlement LeaveMaster={this} />
              ) : this.state.pageDisplay === "LeaveDetails" ? (
                <LeaveDetails LeaveMaster={this} />
              ) : this.state.pageDisplay === "LeaveEncashment" ? (
                <LeaveEncashment LeaveMaster={this} />
              ) : this.state.pageDisplay === "LeaveRules" ? (
                <LeaveRules LeaveMaster={this} />
              ) : null}
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>

                  <div className="col-lg-8">
                    <button
                      // onClick={() => {}}
                      // onClick={InsertUpdateEmployee.bind(this, this)}
                      type="button"
                      className="btn btn-primary"
                    >
                      {this.props.editEmployee ? (
                        <AlgaehLabel label={{ fieldName: "btnUpdate" }} />
                      ) : (
                        <AlgaehLabel label={{ fieldName: "btnSave" }} />
                      )}
                    </button>
                    <button
                      onClick={e => {
                        this.onClose(e);
                      }}
                      type="button"
                      className="btn btn-default"
                    >
                      <AlgaehLabel label={{ fieldName: "btnCancel" }} />
                    </button>
                    <button
                      //    onClick={ClearEmployee.bind(this, this)}
                      type="button"
                      className="btn btn-other"
                    >
                      <AlgaehLabel label={{ fieldName: "btn_clear" }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* </MyContext.Provider> */}
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

export default LeaveMaster;
