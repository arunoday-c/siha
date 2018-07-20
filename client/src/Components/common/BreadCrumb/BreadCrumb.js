import React, { PureComponent } from "react";
import "./breadcrumb.css";
import { AlgaehLabel, AlgaehDateHandler } from "../../Wrapper/algaehWrapper";
import { SearchDetails } from "./BreadCurmbFunctionality";

const CREATE_PATIENT = [
  { name: "No", arabic_name: "لا", value: "N" },
  { name: "Yes", arabic_name: "نعم فعلا", value: "Y" }
];
class BreadCrumb extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createNew: true,
      ctrlCode: "",
      ctrlDate: 0
    };
  }

  selectedValue(e) {
    this.setState({
      createNew: !this.state.createNew
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ctrlCode: nextProps.ctrlCode,
      ctrlDate: nextProps.ctrlDate
    });
  }

  Handle(e) {
    this.props.ControlCode(e.target.value);
    this.setState({
      ctrlCode: e.target.value
    });
  }

  render() {
    let NewCreate = this.state.createNew ? "*** NEW ***" : "";
    return (
      <div className="row">
        {this.props.HideHalfbread == true ? (
          <div id="pageHeader" className="col-lg-12">
            <div
              className="row breadcrumb-fixed"
              style={{ width: this.props.width }}
            >
              <div className="col-lg-3 hdg_bredcrump">
                <h5>{this.props.title}</h5>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">
                        {
                          <AlgaehLabel
                            label={{
                              fieldName: "form_home",
                              align: "ltr"
                            }}
                          />
                        }
                      </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
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
                        {
                          <AlgaehLabel
                            label={{
                              fieldName: "form_create",
                              align: "ltl"
                            }}
                          />
                        }
                        <div>
                          <div className="row">
                            {CREATE_PATIENT.map((data, idx) => {
                              return (
                                <div
                                  className="col-xs-4 col-sm-4 col-md-4 col-lg-4"
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
                                    {data.name}
                                    {/* {data => {
                                        debugger;
                                        return this.props.selectedLang == "en"
                                          ? data.name
                                          : data.arabic_name;
                                      }} */}
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
                          {this.props.ctrlName}
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder={NewCreate}
                            value={this.state.ctrlCode}
                            onChange={this.Handle.bind(this)}
                          />
                        </div>
                        <div className="form-group previous_actions">
                          <i className="fas fa-chevron-right" />
                          <i className="fas fa-step-forward" />
                        </div>
                        <div className="form-group print_actions">
                          <i
                            className="fas fa-search fa-2x"
                            onClick={SearchDetails.bind(this, this)}
                          />
                        </div>
                      </div>
                    </div>

                    <AlgaehDateHandler
                      div={{ className: "col-lg-3" }}
                      label={{ forceLabel: this.props.dateLabel }}
                      textBox={{
                        className: "txt-fld",
                        name: "ctrlDate"
                      }}
                      disabled={true}
                      maxDate={new Date()}
                      minDate={new Date()}
                      events={{
                        onChange: null
                      }}
                      value={this.state.ctrlDate}
                    />

                    {/* <div className="col-lg-3">
                        <div className="form-group">

                          
                          {this.props.dateLabel}
                          <input
                            type="date"
                            className="form-control"
                            value={this.state.ctrlDate}
                            disabled="true"
                          />
                        </div>
                      </div> */}
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
            <div className="row breadcrumb-fixed">
              <div className="col-lg-3 hdg_bredcrump">
                <h5>{this.props.title}</h5>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {this.props.screenName}
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="col-lg-9 hdg_actions1">
                <form>
                  <div className="row">
                    <div className="col-lg-11">&nbsp;</div>
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
    );
  }
}

export default BreadCrumb;
