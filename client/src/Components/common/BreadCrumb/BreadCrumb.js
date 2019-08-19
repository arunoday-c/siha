import React, { PureComponent } from "react";
import "./breadcrumb.css";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { SearchDetails, EditDetails } from "./BreadCurmbFunctionality";
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
        <div className="col  margin-top-15">
          <div className="row spotlightSearchBox">
            <div className="col-lg-9">
              <AlgaehLabel
                label={{ forceLabel: this.props.soptlightSearch.label }}
              />
              <h6>{this.state.value ? this.state.value : "----------"}</h6>
            </div>
            <div className="col spotlightSearchIconBox">
              <i
                className="fas fa-search fa-lg"
                style={{ paddingTop: 17, paddingLeft: 3, cursor: "pointer" }}
                onClick={SearchDetails.bind(this, this)}
              />
            </div>
          </div>
        </div>
      );
    }
  }
  showEditData() {
    if (this.props.editData !== undefined) {
      return (
        <i
          className="fas fa-pen"
          style={{ paddingTop: 17, paddingLeft: 3, cursor: "pointer" }}
          onClick={EditDetails.bind(this, this)}
        />
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
        <div className="col-lg-2 print-area">
          <div>
            <ul>
              <li className="printMenuDisplay">
                <img
                  alt="Algaeh"
                  className="printImg"
                  src={require("../../../assets/images/print.webp")}
                  title="Print"
                  // {...(this.props.printArea.menuitems !== undefined &&
                  // this.props.printArea.menuitems.length === 1
                  //   ? this.props.printArea.menuitems[0].events
                  //   : { onClick: this.openPrintMenu.bind(this) })}
                />

                {this.props.printArea.menuitems !== undefined ? (
                  <div
                    className="dropdown-menu animated fadeIn faster"
                    aria-labelledby="dropdownMenuButton"
                  >
                    {/* <ul className="printActionMenu"> */}
                    {this.props.printArea.menuitems.map((menu, index) => {
                      return (
                        <a
                          className="dropdown-item"
                          key={index}
                          {...menu.events}
                        >
                          <span>{menu.label}</span>
                        </a>
                      );
                    })}
                  </div>
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
    //   let NewCreate = this.state.createNew ? "----------" : "";
    return (
      <React.Fragment>
        <div
          className="fixed-top breadcrumb-fixed "
          // style={{ ...this.props.breadStyle }}
        >
          <div className="breadCrumb-Data row">
            <div className="col-3 text hdg_bredcrump">
              <h5 className="header">{this.props.title}</h5>
              <ul>
                {this.props.pageNavPath !== undefined
                  ? this.props.pageNavPath.map((row, index) => {
                      return (
                        <React.Fragment key={index}>
                          <li key={index}>
                            <a>{row.pageName}</a>
                          </li>
                          {this.props.pageNavPath.length - 1 ===
                          index ? null : (
                            <li>&nbsp;/&nbsp; </li>
                          )}
                        </React.Fragment>
                      );
                    })
                  : null}
              </ul>
            </div>

            {this.showSpotlightSearch()}

            <div className="col margin-top-15">{this.showUserArea()}</div>
            {this.showEditData()}
            {this.showPrintArea()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BreadCrumb;
