import React, { Component } from "react";
import "./reports.css";
import { AlagehAutoComplete, Modal } from "../Wrapper/algaehWrapper";
import Enumerable from "linq";
import data from "./reports_data";
import { swalMessage } from "../../utils/algaehApiCall";

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemList: [],
      module: "",
      showSelector: false
    };
  }

  // loadItemList(e) {
  //   e.preventDefault();

  //   if (this.state.module.length === 0) {
  //     swalMessage({
  //       title: "Please Select a Category",
  //       type: "warning"
  //     });
  //   } else {
  //   }
  // }

  dropDownHandler(value) {
    this.setState({ [value.name]: value.value }, () => {
      let SelectedItem = Enumerable.from(data)
        .where(w => w.name === this.state.module)
        .firstOrDefault();

      this.setState({
        itemList: SelectedItem !== undefined ? SelectedItem.submenu : []
      });
    });
  }

  handleClose() {
    this.setState({ showSelector: false });
  }

  render() {
    return (
      <div className="reports">
        <Modal open={this.state.showSelector}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Select Range</h4>
                </div>
                <div className="col-lg-4">
                  <button type="button" onClick={this.handleClose.bind(this)}>
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-12 popupInner">Range</div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-8">
                    {/* <button
                      className="btn btn-default"
                      onClick={this.handleClose.bind(this)}
                    >
                      Close
                    </button> */}
                  </div>
                  <div className="col-lg-4" />
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <div className="row inner-top-search">
          <form action="none">
            <div className="row padding-10">
              <AlagehAutoComplete
                div={{ className: "col" }}
                label={{
                  forceLabel: "Filter Report by Categories",
                  isImp: false
                }}
                selector={{
                  name: "module",
                  className: "select-fld",
                  value: this.state.module,
                  dataSource: {
                    textField: "name",
                    valueField: "name",
                    data: data
                  },
                  onChange: this.dropDownHandler.bind(this)
                }}
              />

              {/* <div className="col-lg-1">
                <button
                  style={{
                    cursor: "pointer",
                    fontSize: " 1.4rem",
                    margin: " 24px 0 0",
                    padding: 0,
                    background: "none",
                    border: "none"
                  }}
                  onClick={this.loadItemList.bind(this)}
                  className="fas fa-search fa-2x"
                />
              </div> */}
            </div>
          </form>
        </div>

        <div className="portlet portlet-bordered box-shadow-normal ">
          {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Report List</h3>
            </div>
          </div> */}
          <div className="portlet-body" style={{ minHeight: "70vh" }}>
            <div className="col-lg-12">
              <div className="row">
                {this.state.itemList.map((data, index) => (
                  <div
                    onClick={() => {
                      this.setState({
                        showSelector: true
                      });
                    }}
                    className="col-lg-2 reportList"
                  >
                    <i className="fas fa-file-medical-alt" />
                    <p>{data.subitem}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
