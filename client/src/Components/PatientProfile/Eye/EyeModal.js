import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./Eye.css";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import { Checkbox } from "semantic-ui-react";

class EyeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose(e) {
    this.props.onClose && this.props.onClose(e);
  }

  render() {
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openRefraction}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <td rowspan="3">Subjective Correction</td>
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>VN</td>
                    <td>ADD</td>
                    <td>NV</td>
                  </tr>
                  <tr>
                    <td>OD</td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>OS</td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openCyclo}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <td rowspan="3">Subjective Correction</td>
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>VN</td>
                    <td>ADD</td>
                    <td>NV</td>
                  </tr>
                  <tr>
                    <td>OD</td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>OS</td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openPMT}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <td rowspan="3">Subjective Correction</td>
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>VN</td>
                    <td>ADD</td>
                    <td>NV</td>
                  </tr>
                  <tr>
                    <td>OD</td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>OS</td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openAddVision}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th colspan="2" />
                    <th colspan="4">Right Eye</th>
                    <th colspan="4">Left Eye</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowspan="2">Pinhole Vision</td>
                    <td>OD</td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4" />
                  </tr>
                  <tr>
                    <td>OS</td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4" />
                  </tr>
                  <tr>
                    <td rowspan="2">UCVA</td>
                    <td>DV</td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>NV</td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openAddIOP}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th />
                    <th>Right Eye</th>
                    <th colspan="4">Right Eye</th>
                    <th>Methods</th>
                    <th colspan="4">Methods</th>
                  </tr>
                </thead>
                <tbody>
                  {" "}
                  <tr>
                    <td>IOP</td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4">
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      {" "}
                      <AlagehAutoComplete
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          thers: {}
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlgaehDateHandler
                        textBox={{
                          className: "txt-fld",
                          name: ""
                        }}
                        maxDate={new Date()}
                        events={{}}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>

        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title={this.props.HeaderCaption}
          openPopup={this.props.openGlassPres}
        >
          <div className="popupInner">
            <div className="popRightDiv table-responsive">
              <table className="table table-bordered table-sm">
                <thead>
                  {" "}
                  <tr>
                    <th />
                    <th />
                    <th colspan="4">Right Eye</th>
                    <th colspan="4">Left Eye</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="trHighlight">
                    <td />
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>ADD</td>
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>ADD</td>
                  </tr>
                  <tr>
                    <td rowspan="2">PGP Power</td>
                    <td>OD</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-30.00", value: "-30.00" },
                              { text: "-29.75", value: "-29.75" },
                              { text: "-29.50", value: "-29.50" },
                              { text: "-29.25", value: "-29.25" },
                              { text: "-29.00", value: "-29.00" },
                              { text: "-28.75", value: "-28.75" },
                              { text: "-28.50", value: "-28.50" },
                              { text: "-28.25", value: "-28.25" },
                              { text: "-28.00", value: "-28.00" },
                              { text: "-27.75", value: "-27.75" },
                              { text: "-27.50", value: "-27.50" },
                              { text: "-27.25", value: "-27.25" },
                              { text: "-27.00", value: "-27.00" },
                              { text: "-26.75", value: "-26.75" },
                              { text: "-26.50", value: "-26.50" },
                              { text: "-26.25", value: "-26.25" },
                              { text: "-26.00", value: "-26.00" },
                              { text: "-25.75", value: "-25.75" },
                              { text: "-25.50", value: "-25.50" },
                              { text: "-25.25", value: "-25.25" },
                              { text: "-25.00", value: "-25.00" },
                              { text: "-24.75", value: "-24.75" },
                              { text: "-24.50", value: "-24.50" },
                              { text: "-24.25", value: "-24.25" },
                              { text: "-24.00", value: "-24.00" },
                              { text: "-23.75", value: "-23.75" },
                              { text: "-23.50", value: "-23.50" },
                              { text: "-23.25", value: "-23.25" },
                              { text: "-23.00", value: "-23.00" },
                              { text: "-22.75", value: "-22.75" },
                              { text: "-22.50", value: "-22.50" },
                              { text: "-22.25", value: "-22.25" },
                              { text: "-22.00", value: "-22.00" },
                              { text: "-21.75", value: "-21.75" },
                              { text: "-21.50", value: "-21.50" },
                              { text: "-21.25", value: "-21.25" },
                              { text: "-21.00", value: "-21.00" },
                              { text: "-20.75", value: "-20.75" },
                              { text: "-20.50", value: "-20.50" },
                              { text: "-20.25", value: "-20.25" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-18.00", value: "-18.00" },
                              { text: "-17.75", value: "-17.75" },
                              { text: "-17.50", value: "-17.50" },
                              { text: "-17.25", value: "-17.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-30.00", value: "-30.00" },
                              { text: "-29.75", value: "-29.75" },
                              { text: "-29.50", value: "-29.50" },
                              { text: "-29.25", value: "-29.25" },
                              { text: "-29.00", value: "-29.00" },
                              { text: "-28.75", value: "-28.75" },
                              { text: "-28.50", value: "-28.50" },
                              { text: "-28.25", value: "-28.25" },
                              { text: "-28.00", value: "-28.00" },
                              { text: "-27.75", value: "-27.75" },
                              { text: "-27.50", value: "-27.50" },
                              { text: "-27.25", value: "-27.25" },
                              { text: "-27.00", value: "-27.00" },
                              { text: "-26.75", value: "-26.75" },
                              { text: "-26.50", value: "-26.50" },
                              { text: "-26.25", value: "-26.25" },
                              { text: "-26.00", value: "-26.00" },
                              { text: "-25.75", value: "-25.75" },
                              { text: "-25.50", value: "-25.50" },
                              { text: "-25.25", value: "-25.25" },
                              { text: "-25.00", value: "-25.00" },
                              { text: "-24.75", value: "-24.75" },
                              { text: "-24.50", value: "-24.50" },
                              { text: "-24.25", value: "-24.25" },
                              { text: "-24.00", value: "-24.00" },
                              { text: "-23.75", value: "-23.75" },
                              { text: "-23.50", value: "-23.50" },
                              { text: "-23.25", value: "-23.25" },
                              { text: "-23.00", value: "-23.00" },
                              { text: "-22.75", value: "-22.75" },
                              { text: "-22.50", value: "-22.50" },
                              { text: "-22.25", value: "-22.25" },
                              { text: "-22.00", value: "-22.00" },
                              { text: "-21.75", value: "-21.75" },
                              { text: "-21.50", value: "-21.50" },
                              { text: "-21.25", value: "-21.25" },
                              { text: "-21.00", value: "-21.00" },
                              { text: "-20.75", value: "-20.75" },
                              { text: "-20.50", value: "-20.50" },
                              { text: "-20.25", value: "-20.25" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-18.00", value: "-18.00" },
                              { text: "-17.75", value: "-17.75" },
                              { text: "-17.50", value: "-17.50" },
                              { text: "-17.25", value: "-17.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-30.00", value: "-30.00" },
                              { text: "-29.75", value: "-29.75" },
                              { text: "-29.50", value: "-29.50" },
                              { text: "-29.25", value: "-29.25" },
                              { text: "-29.00", value: "-29.00" },
                              { text: "-28.75", value: "-28.75" },
                              { text: "-28.50", value: "-28.50" },
                              { text: "-28.25", value: "-28.25" },
                              { text: "-28.00", value: "-28.00" },
                              { text: "-27.75", value: "-27.75" },
                              { text: "-27.50", value: "-27.50" },
                              { text: "-27.25", value: "-27.25" },
                              { text: "-27.00", value: "-27.00" },
                              { text: "-26.75", value: "-26.75" },
                              { text: "-26.50", value: "-26.50" },
                              { text: "-26.25", value: "-26.25" },
                              { text: "-26.00", value: "-26.00" },
                              { text: "-25.75", value: "-25.75" },
                              { text: "-25.50", value: "-25.50" },
                              { text: "-25.25", value: "-25.25" },
                              { text: "-25.00", value: "-25.00" },
                              { text: "-24.75", value: "-24.75" },
                              { text: "-24.50", value: "-24.50" },
                              { text: "-24.25", value: "-24.25" },
                              { text: "-24.00", value: "-24.00" },
                              { text: "-23.75", value: "-23.75" },
                              { text: "-23.50", value: "-23.50" },
                              { text: "-23.25", value: "-23.25" },
                              { text: "-23.00", value: "-23.00" },
                              { text: "-22.75", value: "-22.75" },
                              { text: "-22.50", value: "-22.50" },
                              { text: "-22.25", value: "-22.25" },
                              { text: "-22.00", value: "-22.00" },
                              { text: "-21.75", value: "-21.75" },
                              { text: "-21.50", value: "-21.50" },
                              { text: "-21.25", value: "-21.25" },
                              { text: "-21.00", value: "-21.00" },
                              { text: "-20.75", value: "-20.75" },
                              { text: "-20.50", value: "-20.50" },
                              { text: "-20.25", value: "-20.25" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-18.00", value: "-18.00" },
                              { text: "-17.75", value: "-17.75" },
                              { text: "-17.50", value: "-17.50" },
                              { text: "-17.25", value: "-17.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-30.00", value: "-30.00" },
                              { text: "-29.75", value: "-29.75" },
                              { text: "-29.50", value: "-29.50" },
                              { text: "-29.25", value: "-29.25" },
                              { text: "-29.00", value: "-29.00" },
                              { text: "-28.75", value: "-28.75" },
                              { text: "-28.50", value: "-28.50" },
                              { text: "-28.25", value: "-28.25" },
                              { text: "-28.00", value: "-28.00" },
                              { text: "-27.75", value: "-27.75" },
                              { text: "-27.50", value: "-27.50" },
                              { text: "-27.25", value: "-27.25" },
                              { text: "-27.00", value: "-27.00" },
                              { text: "-26.75", value: "-26.75" },
                              { text: "-26.50", value: "-26.50" },
                              { text: "-26.25", value: "-26.25" },
                              { text: "-26.00", value: "-26.00" },
                              { text: "-25.75", value: "-25.75" },
                              { text: "-25.50", value: "-25.50" },
                              { text: "-25.25", value: "-25.25" },
                              { text: "-25.00", value: "-25.00" },
                              { text: "-24.75", value: "-24.75" },
                              { text: "-24.50", value: "-24.50" },
                              { text: "-24.25", value: "-24.25" },
                              { text: "-24.00", value: "-24.00" },
                              { text: "-23.75", value: "-23.75" },
                              { text: "-23.50", value: "-23.50" },
                              { text: "-23.25", value: "-23.25" },
                              { text: "-23.00", value: "-23.00" },
                              { text: "-22.75", value: "-22.75" },
                              { text: "-22.50", value: "-22.50" },
                              { text: "-22.25", value: "-22.25" },
                              { text: "-22.00", value: "-22.00" },
                              { text: "-21.75", value: "-21.75" },
                              { text: "-21.50", value: "-21.50" },
                              { text: "-21.25", value: "-21.25" },
                              { text: "-21.00", value: "-21.00" },
                              { text: "-20.75", value: "-20.75" },
                              { text: "-20.50", value: "-20.50" },
                              { text: "-20.25", value: "-20.25" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-18.00", value: "-18.00" },
                              { text: "-17.75", value: "-17.75" },
                              { text: "-17.50", value: "-17.50" },
                              { text: "-17.25", value: "-17.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>

                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>OS</td>

                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-30.00", value: "-30.00" },
                              { text: "-29.75", value: "-29.75" },
                              { text: "-29.50", value: "-29.50" },
                              { text: "-29.25", value: "-29.25" },
                              { text: "-29.00", value: "-29.00" },
                              { text: "-28.75", value: "-28.75" },
                              { text: "-28.50", value: "-28.50" },
                              { text: "-28.25", value: "-28.25" },
                              { text: "-28.00", value: "-28.00" },
                              { text: "-27.75", value: "-27.75" },
                              { text: "-27.50", value: "-27.50" },
                              { text: "-27.25", value: "-27.25" },
                              { text: "-27.00", value: "-27.00" },
                              { text: "-26.75", value: "-26.75" },
                              { text: "-26.50", value: "-26.50" },
                              { text: "-26.25", value: "-26.25" },
                              { text: "-26.00", value: "-26.00" },
                              { text: "-25.75", value: "-25.75" },
                              { text: "-25.50", value: "-25.50" },
                              { text: "-25.25", value: "-25.25" },
                              { text: "-25.00", value: "-25.00" },
                              { text: "-24.75", value: "-24.75" },
                              { text: "-24.50", value: "-24.50" },
                              { text: "-24.25", value: "-24.25" },
                              { text: "-24.00", value: "-24.00" },
                              { text: "-23.75", value: "-23.75" },
                              { text: "-23.50", value: "-23.50" },
                              { text: "-23.25", value: "-23.25" },
                              { text: "-23.00", value: "-23.00" },
                              { text: "-22.75", value: "-22.75" },
                              { text: "-22.50", value: "-22.50" },
                              { text: "-22.25", value: "-22.25" },
                              { text: "-22.00", value: "-22.00" },
                              { text: "-21.75", value: "-21.75" },
                              { text: "-21.50", value: "-21.50" },
                              { text: "-21.25", value: "-21.25" },
                              { text: "-21.00", value: "-21.00" },
                              { text: "-20.75", value: "-20.75" },
                              { text: "-20.50", value: "-20.50" },
                              { text: "-20.25", value: "-20.25" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-18.00", value: "-18.00" },
                              { text: "-17.75", value: "-17.75" },
                              { text: "-17.50", value: "-17.50" },
                              { text: "-17.25", value: "-17.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-30.00", value: "-30.00" },
                              { text: "-29.75", value: "-29.75" },
                              { text: "-29.50", value: "-29.50" },
                              { text: "-29.25", value: "-29.25" },
                              { text: "-29.00", value: "-29.00" },
                              { text: "-28.75", value: "-28.75" },
                              { text: "-28.50", value: "-28.50" },
                              { text: "-28.25", value: "-28.25" },
                              { text: "-28.00", value: "-28.00" },
                              { text: "-27.75", value: "-27.75" },
                              { text: "-27.50", value: "-27.50" },
                              { text: "-27.25", value: "-27.25" },
                              { text: "-27.00", value: "-27.00" },
                              { text: "-26.75", value: "-26.75" },
                              { text: "-26.50", value: "-26.50" },
                              { text: "-26.25", value: "-26.25" },
                              { text: "-26.00", value: "-26.00" },
                              { text: "-25.75", value: "-25.75" },
                              { text: "-25.50", value: "-25.50" },
                              { text: "-25.25", value: "-25.25" },
                              { text: "-25.00", value: "-25.00" },
                              { text: "-24.75", value: "-24.75" },
                              { text: "-24.50", value: "-24.50" },
                              { text: "-24.25", value: "-24.25" },
                              { text: "-24.00", value: "-24.00" },
                              { text: "-23.75", value: "-23.75" },
                              { text: "-23.50", value: "-23.50" },
                              { text: "-23.25", value: "-23.25" },
                              { text: "-23.00", value: "-23.00" },
                              { text: "-22.75", value: "-22.75" },
                              { text: "-22.50", value: "-22.50" },
                              { text: "-22.25", value: "-22.25" },
                              { text: "-22.00", value: "-22.00" },
                              { text: "-21.75", value: "-21.75" },
                              { text: "-21.50", value: "-21.50" },
                              { text: "-21.25", value: "-21.25" },
                              { text: "-21.00", value: "-21.00" },
                              { text: "-20.75", value: "-20.75" },
                              { text: "-20.50", value: "-20.50" },
                              { text: "-20.25", value: "-20.25" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-18.00", value: "-18.00" },
                              { text: "-17.75", value: "-17.75" },
                              { text: "-17.50", value: "-17.50" },
                              { text: "-17.25", value: "-17.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-30.00", value: "-30.00" },
                              { text: "-29.75", value: "-29.75" },
                              { text: "-29.50", value: "-29.50" },
                              { text: "-29.25", value: "-29.25" },
                              { text: "-29.00", value: "-29.00" },
                              { text: "-28.75", value: "-28.75" },
                              { text: "-28.50", value: "-28.50" },
                              { text: "-28.25", value: "-28.25" },
                              { text: "-28.00", value: "-28.00" },
                              { text: "-27.75", value: "-27.75" },
                              { text: "-27.50", value: "-27.50" },
                              { text: "-27.25", value: "-27.25" },
                              { text: "-27.00", value: "-27.00" },
                              { text: "-26.75", value: "-26.75" },
                              { text: "-26.50", value: "-26.50" },
                              { text: "-26.25", value: "-26.25" },
                              { text: "-26.00", value: "-26.00" },
                              { text: "-25.75", value: "-25.75" },
                              { text: "-25.50", value: "-25.50" },
                              { text: "-25.25", value: "-25.25" },
                              { text: "-25.00", value: "-25.00" },
                              { text: "-24.75", value: "-24.75" },
                              { text: "-24.50", value: "-24.50" },
                              { text: "-24.25", value: "-24.25" },
                              { text: "-24.00", value: "-24.00" },
                              { text: "-23.75", value: "-23.75" },
                              { text: "-23.50", value: "-23.50" },
                              { text: "-23.25", value: "-23.25" },
                              { text: "-23.00", value: "-23.00" },
                              { text: "-22.75", value: "-22.75" },
                              { text: "-22.50", value: "-22.50" },
                              { text: "-22.25", value: "-22.25" },
                              { text: "-22.00", value: "-22.00" },
                              { text: "-21.75", value: "-21.75" },
                              { text: "-21.50", value: "-21.50" },
                              { text: "-21.25", value: "-21.25" },
                              { text: "-21.00", value: "-21.00" },
                              { text: "-20.75", value: "-20.75" },
                              { text: "-20.50", value: "-20.50" },
                              { text: "-20.25", value: "-20.25" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-18.00", value: "-18.00" },
                              { text: "-17.75", value: "-17.75" },
                              { text: "-17.50", value: "-17.50" },
                              { text: "-17.25", value: "-17.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-30.00", value: "-30.00" },
                              { text: "-29.75", value: "-29.75" },
                              { text: "-29.50", value: "-29.50" },
                              { text: "-29.25", value: "-29.25" },
                              { text: "-29.00", value: "-29.00" },
                              { text: "-28.75", value: "-28.75" },
                              { text: "-28.50", value: "-28.50" },
                              { text: "-28.25", value: "-28.25" },
                              { text: "-28.00", value: "-28.00" },
                              { text: "-27.75", value: "-27.75" },
                              { text: "-27.50", value: "-27.50" },
                              { text: "-27.25", value: "-27.25" },
                              { text: "-27.00", value: "-27.00" },
                              { text: "-26.75", value: "-26.75" },
                              { text: "-26.50", value: "-26.50" },
                              { text: "-26.25", value: "-26.25" },
                              { text: "-26.00", value: "-26.00" },
                              { text: "-25.75", value: "-25.75" },
                              { text: "-25.50", value: "-25.50" },
                              { text: "-25.25", value: "-25.25" },
                              { text: "-25.00", value: "-25.00" },
                              { text: "-24.75", value: "-24.75" },
                              { text: "-24.50", value: "-24.50" },
                              { text: "-24.25", value: "-24.25" },
                              { text: "-24.00", value: "-24.00" },
                              { text: "-23.75", value: "-23.75" },
                              { text: "-23.50", value: "-23.50" },
                              { text: "-23.25", value: "-23.25" },
                              { text: "-23.00", value: "-23.00" },
                              { text: "-22.75", value: "-22.75" },
                              { text: "-22.50", value: "-22.50" },
                              { text: "-22.25", value: "-22.25" },
                              { text: "-22.00", value: "-22.00" },
                              { text: "-21.75", value: "-21.75" },
                              { text: "-21.50", value: "-21.50" },
                              { text: "-21.25", value: "-21.25" },
                              { text: "-21.00", value: "-21.00" },
                              { text: "-20.75", value: "-20.75" },
                              { text: "-20.50", value: "-20.50" },
                              { text: "-20.25", value: "-20.25" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-18.00", value: "-18.00" },
                              { text: "-17.75", value: "-17.75" },
                              { text: "-17.50", value: "-17.50" },
                              { text: "-17.25", value: "-17.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>

                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" },
                              { text: "+20.25", value: "+20.25" },
                              { text: "+20.50", value: "+20.50" },
                              { text: "+20.75", value: "+20.75" },
                              { text: "+21.00", value: "+21.00" },
                              { text: "+21.25", value: "+21.25" },
                              { text: "+21.50", value: "+21.50" },
                              { text: "+21.75", value: "+21.75" },
                              { text: "+22.00", value: "+22.00" },
                              { text: "+22.25", value: "+22.25" },
                              { text: "+22.50", value: "+22.50" },
                              { text: "+22.75", value: "+22.75" },
                              { text: "+23.00", value: "+23.00" },
                              { text: "+23.25", value: "+23.25" },
                              { text: "+23.50", value: "+23.50" },
                              { text: "+23.75", value: "+23.75" },
                              { text: "+24.00", value: "+24.00" },
                              { text: "+24.25", value: "+24.25" },
                              { text: "+24.50", value: "+24.50" },
                              { text: "+24.75", value: "+24.75" },
                              { text: "+25.00", value: "+25.00" },
                              { text: "+25.25", value: "+25.25" },
                              { text: "+25.50", value: "+25.50" },
                              { text: "+25.75", value: "+25.75" },
                              { text: "+26.00", value: "+26.00" },
                              { text: "+26.25", value: "+26.25" },
                              { text: "+26.50", value: "+26.50" },
                              { text: "+26.75", value: "+26.75" },
                              { text: "+27.00", value: "+27.00" },
                              { text: "+28.25", value: "+28.25" },
                              { text: "+28.50", value: "+28.50" },
                              { text: "+28.75", value: "+28.75" },
                              { text: "+29.00", value: "+29.00" },
                              { text: "+29.25", value: "+29.25" },
                              { text: "+29.50", value: "+29.50" },
                              { text: "+29.75", value: "+29.75" },
                              { text: "+30.00", value: "+30.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td rowspan="2">
                      CVA
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="All" />
                          <span>Specs</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>CL</span>
                        </label>{" "}
                      </div>
                    </td>
                    <td>DV</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: {
                            type: "text"
                          }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: {
                            type: "text"
                          }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>NV</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: {
                            type: "text"
                          }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: {
                            type: "text"
                          }
                        }}
                      />
                    </td>
                  </tr>
                  <tr className="trHighlight">
                    <td />
                    <td />
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>Vision</td>
                    <td>SPH</td>
                    <td>CYL</td>
                    <td>AXIS</td>
                    <td>Vision</td>
                  </tr>
                  <tr>
                    <td>Auto Ref.</td>
                    <td />
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td />
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td rowspan="2">BCVA</td>
                    <td>DV</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "6/6", value: "6/6" },
                              { text: "6/6p", value: "6/6p" },
                              { text: "6/9", value: "6/9" },
                              { text: "6/9p", value: "6/9p" },
                              { text: "6/12", value: "6/12" },
                              { text: "6/12p", value: "6/12p" },
                              { text: "6/18", value: "6/18" },
                              { text: "6/18p", value: "6/18p" },
                              { text: "6/24", value: "6/24" },
                              { text: "6/24p", value: "6/24p" },
                              { text: "6/36", value: "6/36" },
                              { text: "6/36p", value: "6/36p" },
                              { text: "6/60", value: "6/60" },
                              { text: "6/75", value: "6/75" },
                              { text: "6/95", value: "6/95" },
                              { text: "6/120", value: "6/120" },
                              { text: "20/20", value: "20/20" },
                              { text: "20/25", value: "20/25" },
                              { text: "20/30", value: "20/30" },
                              { text: "20/40", value: "20/40" },
                              { text: "20/50", value: "20/50" },
                              { text: "20/60", value: "20/60" },
                              { text: "20/80", value: "20/80" },
                              { text: "20/100", value: "20/100" },
                              { text: "20/125", value: "20/125" },
                              { text: "20/160", value: "20/160" },
                              { text: "20/180", value: "20/180" },
                              { text: "20/200", value: "20/200" },
                              { text: "20/220", value: "20/220" },
                              { text: "20/240", value: "20/240" },
                              { text: "20/260", value: "20/260" },
                              { text: "20/280", value: "20/280" },
                              { text: "20/300", value: "20/300" },
                              { text: "20/320", value: "20/320" },
                              { text: "20/340", value: "20/340" },
                              { text: "20/360", value: "20/360" },
                              { text: "20/380", value: "20/380" },
                              { text: "20/400", value: "20/400" },
                              { text: "CF@3m", value: "CF@3m" },
                              { text: "CF@2m", value: "CF@2m" },
                              { text: "CF@1m", value: "CF@1m" },
                              { text: "CF@1/2m", value: "CF@1/2m" },
                              { text: "CFCF", value: "CFCF" },
                              { text: "HM+", value: "HM+" },
                              { text: "PL+", value: "PL+" },
                              { text: "No PL", value: "No PL" },
                              { text: "PR Temp", value: "PR Temp" },
                              { text: "PR Nas", value: "PR Nas" },
                              { text: "PR Sup", value: "PR Sup" },
                              { text: "PR Inf", value: "PR Inf" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "6/6", value: "6/6" },
                              { text: "6/6p", value: "6/6p" },
                              { text: "6/9", value: "6/9" },
                              { text: "6/9p", value: "6/9p" },
                              { text: "6/12", value: "6/12" },
                              { text: "6/12p", value: "6/12p" },
                              { text: "6/18", value: "6/18" },
                              { text: "6/18p", value: "6/18p" },
                              { text: "6/24", value: "6/24" },
                              { text: "6/24p", value: "6/24p" },
                              { text: "6/36", value: "6/36" },
                              { text: "6/36p", value: "6/36p" },
                              { text: "6/60", value: "6/60" },
                              { text: "6/75", value: "6/75" },
                              { text: "6/95", value: "6/95" },
                              { text: "6/120", value: "6/120" },
                              { text: "20/20", value: "20/20" },
                              { text: "20/25", value: "20/25" },
                              { text: "20/30", value: "20/30" },
                              { text: "20/40", value: "20/40" },
                              { text: "20/50", value: "20/50" },
                              { text: "20/60", value: "20/60" },
                              { text: "20/80", value: "20/80" },
                              { text: "20/100", value: "20/100" },
                              { text: "20/125", value: "20/125" },
                              { text: "20/160", value: "20/160" },
                              { text: "20/180", value: "20/180" },
                              { text: "20/200", value: "20/200" },
                              { text: "20/220", value: "20/220" },
                              { text: "20/240", value: "20/240" },
                              { text: "20/260", value: "20/260" },
                              { text: "20/280", value: "20/280" },
                              { text: "20/300", value: "20/300" },
                              { text: "20/320", value: "20/320" },
                              { text: "20/340", value: "20/340" },
                              { text: "20/360", value: "20/360" },
                              { text: "20/380", value: "20/380" },
                              { text: "20/400", value: "20/400" },
                              { text: "CF@3m", value: "CF@3m" },
                              { text: "CF@2m", value: "CF@2m" },
                              { text: "CF@1m", value: "CF@1m" },
                              { text: "CF@1/2m", value: "CF@1/2m" },
                              { text: "CFCF", value: "CFCF" },
                              { text: "HM+", value: "HM+" },
                              { text: "PL+", value: "PL+" },
                              { text: "No PL", value: "No PL" },
                              { text: "PR Temp", value: "PR Temp" },
                              { text: "PR Nas", value: "PR Nas" },
                              { text: "PR Sup", value: "PR Sup" },
                              { text: "PR Inf", value: "PR Inf" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>NV</td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "N5", value: "N5" },
                              { text: "N6", value: "N6" },
                              { text: "N7", value: "N7" },
                              { text: "N8", value: "N8" },
                              { text: "N10", value: "N10" },
                              { text: "N12", value: "N12" },
                              { text: "N15", value: "N15" },
                              { text: "N18", value: "N18" },
                              { text: "N20", value: "N20" },
                              { text: "N24", value: "N24" },
                              { text: "N36", value: "N36" },
                              { text: "N60", value: "N60" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-20.00", value: "-20.00" },
                              { text: "-19.75", value: "-19.75" },
                              { text: "-19.50", value: "-19.50" },
                              { text: "-19.25", value: "-19.25" },
                              { text: "-19.00", value: "-19.00" },
                              { text: "-18.75", value: "-18.75" },
                              { text: "-18.50", value: "-18.50" },
                              { text: "-18.25", value: "-18.25" },
                              { text: "-17.00", value: "-17.00" },
                              { text: "-16.75", value: "-16.75" },
                              { text: "-16.50", value: "-16.50" },
                              { text: "-16.25", value: "-16.25" },
                              { text: "-16.00", value: "-16.00" },
                              { text: "-15.75", value: "-15.75" },
                              { text: "-15.50", value: "-15.50" },
                              { text: "-15.25", value: "-15.25" },
                              { text: "-15.00", value: "-15.00" },
                              { text: "-14.75", value: "-14.75" },
                              { text: "-14.50", value: "-14.50" },
                              { text: "-14.25", value: "-14.25" },
                              { text: "-14.00", value: "-14.00" },
                              { text: "-13.75", value: "-13.75" },
                              { text: "-13.50", value: "-13.50" },
                              { text: "-13.25", value: "-13.25" },
                              { text: "-13.00", value: "-13.00" },
                              { text: "-12.75", value: "-12.75" },
                              { text: "-12.50", value: "-12.50" },
                              { text: "-12.25", value: "-12.25" },
                              { text: "-12.00", value: "-12.00" },
                              { text: "-11.75", value: "-11.75" },
                              { text: "-11.50", value: "-11.50" },
                              { text: "-11.25", value: "-11.25" },
                              { text: "-11.00", value: "-11.00" },
                              { text: "-10.75", value: "-10.75" },
                              { text: "-10.50", value: "-10.50" },
                              { text: "-10.25", value: "-10.25" },
                              { text: "-10.00", value: "-10.00" },
                              { text: "-9.75", value: "-9.75" },
                              { text: "-9.50", value: "-9.50" },
                              { text: "-9.25", value: "-9.25" },
                              { text: "-9.00", value: "-9.00" },
                              { text: "-8.75", value: "-8.75" },
                              { text: "-8.50", value: "-8.50" },
                              { text: "-8.25", value: "-8.25" },
                              { text: "-8.00", value: "-8.00" },
                              { text: "-7.75", value: "-7.75" },
                              { text: "-7.50", value: "-7.50" },
                              { text: "-7.25", value: "-7.25" },
                              { text: "-7.00", value: "-7.00" },
                              { text: "-6.75", value: "-6.75" },
                              { text: "-6.50", value: "-6.50" },
                              { text: "-6.25", value: "-6.25" },
                              { text: "-6.00", value: "-6.00" },
                              { text: "-5.75", value: "-5.75" },
                              { text: "-5.50", value: "-5.50" },
                              { text: "-5.25", value: "-5.25" },
                              { text: "-5.00", value: "-5.00" },
                              { text: "-4.75", value: "-4.75" },
                              { text: "-4.50", value: "-4.50" },
                              { text: "-4.25", value: "-4.25" },
                              { text: "-4.00", value: "-4.00" },
                              { text: "-3.75", value: "-3.75" },
                              { text: "-3.50", value: "-3.50" },
                              { text: "-3.25", value: "-3.25" },
                              { text: "-3.00", value: "-3.00" },
                              { text: "-2.75", value: "-2.75" },
                              { text: "-2.50", value: "-2.50" },
                              { text: "-2.25", value: "-2.25" },
                              { text: "-2.00", value: "-2.00" },
                              { text: "-1.75", value: "-1.75" },
                              { text: "-1.50", value: "-1.50" },
                              { text: "-1.25", value: "-1.25" },
                              { text: "-1.00", value: "-1.00" },
                              { text: "-0.75", value: "-0.75" },
                              { text: "-0.50", value: "-0.50" },
                              { text: "-0.25", value: "-0.25" },
                              { text: "0.00", value: "0.00" },
                              { text: "+0.25", value: "+0.25" },
                              { text: "+0.50", value: "+0.50" },
                              { text: "+0.75", value: "+0.75" },
                              { text: "+1.00", value: "+1.00" },
                              { text: "+1.25", value: "+1.25" },
                              { text: "+1.50", value: "+1.50" },
                              { text: "+1.75", value: "+1.75" },
                              { text: "+2.00", value: "+2.00" },
                              { text: "+2.25", value: "+2.25" },
                              { text: "+2.50", value: "+2.50" },
                              { text: "+2.75", value: "+2.75" },
                              { text: "+3.00", value: "+3.00" },
                              { text: "+3.25", value: "+3.25" },
                              { text: "+3.50", value: "+3.50" },
                              { text: "+3.75", value: "+3.75" },
                              { text: "+4.00", value: "+4.00" },
                              { text: "+4.25", value: "+4.25" },
                              { text: "+4.50", value: "+4.50" },
                              { text: "+4.75", value: "+4.75" },
                              { text: "+5.00", value: "+5.00" },
                              { text: "+5.25", value: "+5.25" },
                              { text: "+5.50", value: "+5.50" },
                              { text: "+5.75", value: "+5.75" },
                              { text: "+6.00", value: "+6.00" },
                              { text: "+6.25", value: "+6.25" },
                              { text: "+6.50", value: "+6.50" },
                              { text: "+6.75", value: "+6.75" },
                              { text: "+7.00", value: "+7.00" },
                              { text: "+7.25", value: "+7.25" },
                              { text: "+7.50", value: "+7.50" },
                              { text: "+7.75", value: "+7.75" },
                              { text: "+8.00", value: "+8.00" },
                              { text: "+8.25", value: "+8.25" },
                              { text: "+8.50", value: "+8.50" },
                              { text: "+8.75", value: "+8.75" },
                              { text: "+9.00", value: "+9.00" },
                              { text: "+9.25", value: "+9.25" },
                              { text: "+9.50", value: "+9.50" },
                              { text: "+9.75", value: "+9.75" },
                              { text: "+10.00", value: "+10.00" },
                              { text: "+10.25", value: "+10.25" },
                              { text: "+10.50", value: "+10.50" },
                              { text: "+10.75", value: "+10.75" },
                              { text: "+11.00", value: "+11.00" },
                              { text: "+11.25", value: "+11.25" },
                              { text: "+11.50", value: "+11.50" },
                              { text: "+11.75", value: "+11.75" },
                              { text: "+12.00", value: "+12.00" },
                              { text: "+12.25", value: "+12.25" },
                              { text: "+12.50", value: "+12.50" },
                              { text: "+12.75", value: "+12.75" },
                              { text: "+13.00", value: "+13.00" },
                              { text: "+13.25", value: "+13.25" },
                              { text: "+13.50", value: "+13.50" },
                              { text: "+13.75", value: "+13.75" },
                              { text: "+14.00", value: "+14.00" },
                              { text: "+14.25", value: "+14.25" },
                              { text: "+14.50", value: "+14.50" },
                              { text: "+14.75", value: "+14.75" },
                              { text: "+15.00", value: "+15.00" },
                              { text: "+15.25", value: "+15.25" },
                              { text: "+15.50", value: "+15.50" },
                              { text: "+15.75", value: "+15.75" },
                              { text: "+16.00", value: "+16.00" },
                              { text: "+16.25", value: "+16.25" },
                              { text: "+16.50", value: "+16.50" },
                              { text: "+16.75", value: "+16.75" },
                              { text: "+17.00", value: "+17.00" },
                              { text: "+18.25", value: "+18.25" },
                              { text: "+18.50", value: "+18.50" },
                              { text: "+18.75", value: "+18.75" },
                              { text: "+19.00", value: "+19.00" },
                              { text: "+19.25", value: "+19.25" },
                              { text: "+19.50", value: "+19.50" },
                              { text: "+19.75", value: "+19.75" },
                              { text: "+20.00", value: "+20.00" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "-", value: "-" },
                              { text: "5", value: "5" },
                              { text: "10", value: "10" },
                              { text: "15", value: "15" },
                              { text: "20", value: "20" },
                              { text: "25", value: "25" },
                              { text: "30", value: "30" },
                              { text: "35", value: "35" },
                              { text: "40", value: "40" },
                              { text: "45", value: "45" },
                              { text: "50", value: "50" },
                              { text: "55", value: "55" },
                              { text: "60", value: "60" },
                              { text: "65", value: "65" },
                              { text: "70", value: "70" },
                              { text: "75", value: "75" },
                              { text: "80", value: "80" },
                              { text: "85", value: "85" },
                              { text: "90", value: "90" },
                              { text: "95", value: "95" },
                              { text: "100", value: "100" },
                              { text: "105", value: "105" },
                              { text: "110", value: "110" },
                              { text: "115", value: "115" },
                              { text: "120", value: "120" },
                              { text: "125", value: "125" },
                              { text: "130", value: "130" },
                              { text: "135", value: "135" },
                              { text: "140", value: "140" },
                              { text: "145", value: "145" },
                              { text: "150", value: "150" },
                              { text: "155", value: "155" },
                              { text: "160", value: "160" },
                              { text: "165", value: "165" },
                              { text: "170", value: "170" },
                              { text: "175", value: "175" },
                              { text: "180", value: "180" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                    <td>
                      <AlagehAutoComplete
                        selector={{
                          sort: "off",
                          name: "",
                          className: "select-fld",
                          dataSource: {
                            textField: "text",
                            valueField: "value",
                            data: [
                              { text: "", value: "" },
                              { text: "N5", value: "N5" },
                              { text: "N6", value: "N6" },
                              { text: "N7", value: "N7" },
                              { text: "N8", value: "N8" },
                              { text: "N10", value: "N10" },
                              { text: "N12", value: "N12" },
                              { text: "N15", value: "N15" },
                              { text: "N18", value: "N18" },
                              { text: "N20", value: "N20" },
                              { text: "N24", value: "N24" },
                              { text: "N36", value: "N36" },
                              { text: "N60", value: "N60" }
                            ]
                          },
                          thers: {}
                        }}
                      />
                    </td>
                  </tr>

                  <tr className="trHighlight">
                    <td rowspan="2">K Reading</td>
                    <td />
                    <td>K1</td>
                    <td>K2</td>
                    <td colspan="2">AXIS</td>
                    <td>K1</td>
                    <td>K2</td>
                    <td colspan="2">AXIS</td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>

                  <tr className="trHighlight">
                    <td />
                    <td />
                    <td>Prism</td>
                    <td>BC</td>
                    <td colspan="2">DIA</td>
                    <td>Prism</td>
                    <td>BC</td>
                    <td colspan="2">DIA</td>
                  </tr>
                  <tr>
                    <td rowspan="2">BCVA</td>
                    <td>DV</td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>NV</td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td>
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="2">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Pachy</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>W. to W (C.S)</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>AC. Depth</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>IPD</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Color Vision (SC/CC)</td>
                    <td>WNL</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Confrontation Fields</td>
                    <td>Full</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>PUPILS</td>
                    <td>ERRL</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Cover Test (SC/CC)</td>
                    <td>Ortho</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Covergence</td>
                    <td />
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td colspan="4" />
                  </tr>
                  <tr>
                    <td>SAFE</td>
                    <td>FESA</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td rowspan="2">Advice</td>
                    <td />
                    <td colspan="8">
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="All" />
                          <span>Glass</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>Polycarbonate</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>CR 39</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>Unifocal</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>"D" Bifocal</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>Kryptok</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>Progressive</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td colspan="8">
                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" name="All" />
                          <span>Office Lense</span>
                        </label>
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>Tint</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>Photochromic</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>ARC</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>SRC</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>Polarised</span>
                        </label>{" "}
                        <label className="checkbox inline">
                          <input type="checkbox" name="sunday" />
                          <span>CSL</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">CL Type</td>
                    <td colspan="4">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        textBox={{
                          className: "txt-fld",
                          name: "",
                          value: "",
                          events: {},
                          option: { type: "text" }
                        }}
                      />
                    </td>
                    <td />
                    <td />
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <td colspan="2" rowspan="2">
                      Remarks
                    </td>
                    <td colspan="8" rowspan="2">
                      <textarea className="textArea" />
                    </td>
                  </tr>
                  <tr />
                </tbody>
              </table>
            </div>
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    //   onClick={this.SaveAdvance.bind(this, context)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    allallergies: state.allallergies,
    patient_allergies: state.patient_allergies
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAllAllergies: AlgaehActions,
      getPatientAllergies: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EyeModal)
);
