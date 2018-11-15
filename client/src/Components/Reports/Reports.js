import React, { Component } from "react";
import "./reports.css";
import { AlagehAutoComplete, AlagehFormGroup } from "../Wrapper/algaehWrapper";
import data from "./reports_data";
import AlgaehReport from "../Wrapper/printReports";
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
  //       type: "warning "
  //     });
  //   } else {
  //   }
  // }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value,
      itemList: value.selected.submenu
    });
  }

  handleClose() {
    this.setState({ showSelector: false });
  }

  render() {
    return (
      <div className="reports">
        <div className="row inner-top-search">
          <form action="none" style={{ width: "100%" }}>
            <div className="row padding-10">
              <AlagehAutoComplete
                div={{ className: "col" }}
                selector={{
                  name: "module",
                  className: "select-fld",
                  value: this.state.module,
                  dataSource: {
                    textField: "name",
                    valueField: "name",
                    data: data
                  },
                  others: {
                    style: { padding: 10 }
                  },
                  onChange: this.dropDownHandler.bind(this)
                }}
              />
              <AlagehFormGroup
                div={{ className: "col" }}
                textBox={{
                  className: "txt-fld",
                  name: "",
                  value: "",
                  others: {
                    style: { padding: 10 },
                    placeholder: "Search for reports"
                  },
                  events: {
                    onChange: () => {}
                  }
                }}
              />
            </div>
          </form>
        </div>

        <div className="portlet portlet-bordered box-shadow-normal ">
          {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Report List</h3>
            </div>
          </div> */}
          <div
            className="portlet-body"
            style={{ height: "75vh", overflow: "auto" }}
          >
            <div className="col-lg-12">
              <div className="row">
                {this.state.itemList.map((item, index) => (
                  <div
                    key={index}
                    className="col-lg-2 reportList"
                    onClick={() => {
                      AlgaehReport({
                        report: {
                          fileName: item.template_name
                        },
                        plotUI: {
                          paramters: item.reportParameters
                        }
                      });
                    }}
                  >
                    <div>
                      <i className="fas fa-file-medical-alt" />
                      <p>{item.subitem}</p>
                    </div>
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
