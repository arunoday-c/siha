import React, { Component } from "react";
import "./Eye.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehModalPopUp,
  AlgaehDateHandler,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
export default class Eye extends Component {
  render() {
    return (
      <div className="EyeScreen">
        <div className="row margin-top-15">
          <div className="col-12 margin-top-15">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-6">
                    {" "}
                    <table class="table table-sm table-bordered customTable">
                      <thead>
                        <tr>
                          {" "}
                          <th scope="col" width="60" />
                          <th scope="col" colSpan="4" className="text-center">
                            Right Eye
                          </th>
                        </tr>
                        <tr>
                          <th scope="col" />
                          <th scope="col" className="text-center">
                            Sph
                          </th>
                          <th scope="col" className="text-center">
                            Cyl
                          </th>
                          <th scope="col" className="text-center">
                            Axis
                          </th>
                          <th scope="col" className="text-center">
                            V.A.
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">DV</th>
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <th scope="row">NV ADD</th>
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-6">
                    <table class="table table-sm table-bordered customTable">
                      <thead>
                        <tr>
                          {" "}
                          <th scope="col" width="60" />
                          <th scope="col" colSpan="4" className="text-center">
                            Left Eye
                          </th>
                        </tr>
                        <tr>
                          <th scope="col" />
                          <th scope="col" className="text-center">
                            Sph
                          </th>
                          <th scope="col" className="text-center">
                            Cyl
                          </th>
                          <th scope="col" className="text-center">
                            Axis
                          </th>
                          <th scope="col" className="text-center">
                            V.A.
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">DV</th>
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                        <tr>
                          <th scope="row">NV ADD</th>
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-12">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-2 form-group" }}
                        label={{ forceLabel: "BVD", isImp: false }}
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          others: {}
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-2 form-group" }}
                        label={{ forceLabel: "Type of Glasses", isImp: false }}
                        selector={{
                          name: "",
                          className: "select-fld",
                          dataSource: {},
                          others: {}
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col-2 form-group" }}
                        label={{
                          forceLabel: "IPD",
                          isImp: false
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
                      <AlagehFormGroup
                        div={{ className: "col form-group" }}
                        label={{
                          forceLabel: "Remarks",
                          isImp: false
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
                      <div className="col-2">
                        {" "}
                        <button
                          className="btn btn-primary"
                          style={{ float: "right", marginTop: 19 }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
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
