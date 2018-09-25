import React, { PureComponent } from "react";
import "../BreadCrumb/breadcrumbAr.css";
import { AlagehFormGroup } from "../../Wrapper/algaehWrapper";
import { SearchDetails } from "./BreadCurmbFunctionality";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
class BreadCrumb extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createNew: true,
      value: "",
      printOpen: false
    };
  }

  selectedValue(e) {
    this.setState({
      createNew: !this.state.createNew
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value:
        nextProps.soptlightSearch !== undefined
          ? nextProps.soptlightSearch.value
          : ""
    });
  }

  Handle(e) {
    if (this.props.soptlightSearch.events !== undefined) {
      this.props.soptlightSearch.events.onChange(e.target.value);
    }

    this.setState({
      value: e.target.value
    });
  }

  showSpotlightSearch() {
    if (this.props.soptlightSearch !== undefined) {
      return (
        <div className="col-lg-5">
          <ul className="actions-area">
            <li>
              <Tooltip title="Search">
                <img
                  className="finderImg"
                  src={require("../BreadCrumb/images/search.png")}
                  onClick={SearchDetails.bind(this, this)}
                />
              </Tooltip>
            </li>
            <li>
              <span>
                <Tooltip title="First">
                  <i className="fas fa-step-backward" />
                </Tooltip>
                <Tooltip title="Previous">
                  <i className="fas fa-chevron-left" />
                </Tooltip>
              </span>
            </li>
            <li className="action-input-area">
              <AlagehFormGroup
                label={{
                  forceLabel: this.props.soptlightSearch.label,
                  className: "internal-label"
                }}
                div={{ className: "col-lg-9" }}
                textBox={{
                  value: this.state.value,
                  className: "txt-fld",
                  events: {
                    onChange: this.Handle.bind(this)
                  },
                  others: {
                    placeholder: "*** NEW ***"
                  }
                }}
              />
            </li>
            <li>
              <span>
                <Tooltip title="Next">
                  <i className="fas fa-chevron-right" />
                </Tooltip>
                <Tooltip title="Last">
                  <i className="fas fa-step-forward" />
                </Tooltip>
              </span>
            </li>
          </ul>
        </div>
      );
    }
  }
  showUserArea() {
    if (this.props.userArea !== undefined) {
      return this.props.userArea;
    }
  }
  openPrintMenu(e) {
    this.setState({ printOpen: !this.state.printOpen });
  }
  showPrintArea() {
    if (this.props.printArea !== undefined) {
      return (
        <div className="col-lg-2 printAr-area">
          <div>
            <ul>
              <li className="printMenuDisplay">
                <img
                  className="printImg"
                  src={require("../BreadCrumb/images/print.png")}
                  title="Print"
                  // {...(this.props.printArea.menuitems !== undefined &&
                  // this.props.printArea.menuitems.length === 1
                  //   ? this.props.printArea.menuitems[0].events
                  //   : { onClick: this.openPrintMenu.bind(this) })}
                />

                {this.props.printArea.menuitems !== undefined ? (
                  <ul className="printActionMenu">
                    {this.props.printArea.menuitems.map((menu, index) => {
                      console.log("menu ", menu);
                      return (
                        <li key={index} {...menu.events}>
                          <span>{menu.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <React.Fragment />
                )}
              </li>
            </ul>
          </div>
        </div>
      );
    }
  }
  render() {
    //   let NewCreate = this.state.createNew ? "*** NEW ***" : "";
    return (
      <React.Fragment>
        <div
          className="fixed-top breadcrumbAr-fixed "
          // style={{ ...this.props.breadStyle }}
        >
          <div className="breadCrumbAr-Data row">
            {this.showPrintArea()}

            <div className="col-lg-2 third-position">{this.showUserArea()}</div>
            {this.showSpotlightSearch()}
            <div className="col-lg-3 text hdg_bredcrump">
              <h5 className="header">{this.props.title}</h5>
              <ul>
                {this.props.pageNavPath !== undefined
                  ? this.props.pageNavPath.map((row, index) => {
                      return (
                        <React.Fragment key={index}>
                          {this.props.pageNavPath.length - 2 ===
                          index ? null : (
                            <li>&nbsp;/&nbsp; </li>
                          )}
                          <li key={index}>
                            <a>{row.pageName}</a>
                          </li>
                        </React.Fragment>
                      );
                    })
                  : null}
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BreadCrumb;
