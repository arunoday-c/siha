import React, { Component, PureComponent } from "react";
import "./breadcrumb.css";

const CREATE_PATIENT = [
  { label: "Yes", value: "Y" },
  { label: "No", value: "N" }
];

class BreadCrumb extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createNew: true
    };
  }

  selectedValue(e) {
    debugger;
    this.setState({
      createNew: !this.state.createNew
    });
  }

  render() {
    let NewCreate = this.state.createNew ? "*** NEW ***" : "";
    return (
      <div className="container-fluid">
        <div className="row">
          {this.props.HideHalfbread == true ? (            
            <div id="pageHeader" className="col-lg-12">
              <div className="row">
                <div className="col-lg-3 hdg_bredcrump">
                  <h5>{this.props.title}</h5>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#">Home</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {this.props.screenName}
                      </li>
                    </ol>
                  </nav>
                </div>

                <div className="col-lg-9 hdg_actions">
                  <form>
                    <div className="row">
                      <div className="col-lg-2">
                        <div className="form-group">
                          <label>Create New</label>
                          <div>
                            <div className="row">
                              {CREATE_PATIENT.map((data, idx) => {
                                return (
                                  <div
                                    className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
                                    key={"index_value" + idx}
                                  >
                                    <input
                                      type="radio"
                                      name="CREATE_PATIENT"
                                      className="htpl-phase1-radio-btn"
                                      value={data.value}
                                      onChange={this.selectedValue.bind(
                                        this,
                                        data.value
                                      )}
                                      defaultChecked={
                                        data.value === "Y" ? true : false
                                      }
                                    />
                                    <label className="radio-design">
                                      {data.label}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="row">
                          <div className="form-group next_actions">
                            <i className="fas fa-step-backward" />
                            <i className="fas fa-chevron-left" />
                          </div>
                          <div className="form-group col-lg-8">
                            <label>{this.props.ctrlName}</label>
                            <input
                              type="email"
                              className="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              placeholder={NewCreate}
                            />
                          </div>
                          <div className="form-group previous_actions">
                            <i className="fas fa-chevron-right" />
                            <i className="fas fa-step-forward" />
                          </div>
                          <div className="form-group print_actions">
                            <i className="fas fa-search fa-2x" />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div className="form-group">
                          <label>{this.props.dateLabel} Date</label>
                          <p>
                            <small>19/04/2018</small>
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-1">
                        <div className="form-group print_actions">
                          <i className="fas fa-print fa-2x" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>            
          ) : (
            <div id="pageHeader1" className="col-lg-12">
              <div className="row">
                <div className="col-lg-3 hdg_bredcrump">
                  <h5>{this.props.title}</h5>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="#">Home</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {this.props.screenName}
                      </li>
                    </ol>
                  </nav>
                </div>

                <div className="col-lg-9 hdg_actions1">
                  <form>
                    <div className="row">
                      <div className="col-lg-11">
                        &nbsp;
                      </div>
                      <div className="col-lg-1">
                        <div className="form-group print_actions">
                          <i className="fas fa-print fa-2x" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default BreadCrumb;
