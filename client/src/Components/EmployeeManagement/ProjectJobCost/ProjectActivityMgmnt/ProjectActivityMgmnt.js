import React, { Component } from "react";
import "./ProjectActivityMgmnt.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
export default class ProjectActivityMgmnt extends Component {
  render() {
    return (
      <div className="ProjectActivityMgmntScreen">
        <div className="row  inner-top-search">
          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Enter Main Activity ",
              isImp: true
            }}
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

          <div className="col-2 form-group">
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              <span>Add</span>
            </button>
          </div>
          <div className="col-1" />
          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{ forceLabel: "Select Main Activity", isImp: true }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          />
          <AlagehFormGroup
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Enter Sub Activity ",
              isImp: true
            }}
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
          <div className="col-2 form-group">
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-5">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Main Activity List</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="mainActivityGrid_Cntr">
                    <AlgaehDataGrid
                      id="mainActivityGrid"
                      datavalidate="mainActivityGrid"
                      columns={[
                        {
                          fieldName: "mainActivity",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Main Activity Name" }}
                            />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{ data: [] }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-7">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Sub-Activity List</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="subActivityGrid_Cntr">
                    <AlgaehDataGrid
                      id="subActivityGrid"
                      datavalidate="subActivityGrid"
                      columns={[
                        {
                          fieldName: "mainActivity",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Main Activity Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "subActivity",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Sub Activity Name" }}
                            />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{ data: [] }}
                      isEditable={true}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
