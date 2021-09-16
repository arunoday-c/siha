import React, { PureComponent } from "react";
// import "./breadcrumb.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import { AlgaehSecurityComponent } from "algaeh-react-components";
import { SearchDetails, EditDetails } from "./BreadCurmbFunctionality";
class BreadCrumb extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createNew: true,
      value: "",
      printOpen: false,
    };
  }

  selectedValue(e) {
    this.setState({
      createNew: !this.state.createNew,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      value:
        nextProps.soptlightSearch !== undefined
          ? nextProps.soptlightSearch.value
          : "",
    });
  }

  Handle(e) {
    if (this.props.soptlightSearch.events !== undefined) {
      this.props.soptlightSearch.events.onChange(e.target.value);
    }

    this.setState({
      value: e.target.value,
    });
  }

  showSpotlightSearch() {
    if (this.props.soptlightSearch !== undefined) {
      return (
        <div className="col-2">
          <div
            className="row spotlightSearchBox"
            onClick={SearchDetails.bind(this, this)}
          >
            <div className="col">
              <AlgaehLabel
                label={{ forceLabel: this.props.soptlightSearch.label }}
              />
              <h6>{this.state.value ? this.state.value : "----------"}</h6>
            </div>
            <div className="col spotlightSearchIconBox">
              <i className="fas fa-search fa-lg" />
            </div>
          </div>
        </div>
      );
    }
  }
  showEditData() {
    if (this.props.editData !== undefined) {
      return (
        <AlgaehSecurityComponent componentCode="PAT_DATA_EDIT">
          <li onClick={EditDetails.bind(this, this)}>
            {" "}
            {this.props.editData.events.addNewPat ? (
              <i class="fas fa-user-plus"></i>
            ) : (
              <i className="fas fa-user-edit bredcrumpIconBig" />
            )}
          </li>
        </AlgaehSecurityComponent>
      );
    }
  }
  showAttachments() {
    if (this.props.attachments !== undefined) {
      return (
        <AlgaehSecurityComponent componentCode="PAT_DATA_ATTC">
          <li onClick={() => this.props.attachments?.onClick()}>
            {" "}
            <i className="fas fa-paperclip bredcrumpIconBig" />
          </li>
        </AlgaehSecurityComponent>
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
        <li className="printMenuDisplay">
          {/* <img
                  alt="Algaeh"
                  className="printImg"
                  src={require("../../../assets/images/print.webp")}
                  title="Print"
                  // {...(this.props.printArea.menuitems !== undefined &&
                  // this.props.printArea.menuitems.length === 1
                  //   ? this.props.printArea.menuitems[0].events
                  //   : { onClick: this.openPrintMenu.bind(this) })}
                /> */}

          <i className="fas fa-print bredcrumpIconBig" />

          {this.props.printArea.menuitems !== undefined ? (
            <div
              className="dropdown-menu animated fadeIn faster"
              aria-labelledby="dropdownMenuButton"
            >
              {/* <ul className="printActionMenu"> */}
              {this.props.printArea.menuitems.map((menu, index) => {
                return (
                  <a className="dropdown-item" key={index} {...menu.events}>
                    <span>{menu.label}</span>
                  </a>
                );
              })}
            </div>
          ) : (
            <React.Fragment />
          )}
        </li>
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
            <div className="col-2 text hdg_bredcrump">
              <h5 className="header">{this.props.title}</h5>
              <ul>
                {this.props.pageNavPath !== undefined
                  ? this.props.pageNavPath.map((row, index) => {
                      return (
                        <React.Fragment key={index}>
                          <li key={index}>{row.pageName}</li>
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

            <div className="col-6 margin-top-15">{this.showUserArea()}</div>

            <div className="col print-area">
              <div>
                <ul>
                  {this.showAttachments()}
                  {this.showEditData()}
                  {this.showPrintArea()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BreadCrumb;
