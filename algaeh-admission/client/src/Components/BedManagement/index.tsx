import React from "react";
import "./BedManagement.scss";
import { AlgaehAutoComplete } from "algaeh-react-components";

export default function BedManagement(props: any) {
  return (
    <div className="BedManagementScreen">
      <div className="row inner-top-search">
        <AlgaehAutoComplete
          div={{ className: "col-3 form-group mandatory" }}
          label={{
            forceLabel: "Filter By Ward",
            isImp: true,
          }}
          selector={{
            name: "services_id",

            dataSource: {
              textField: "service_name",
              valueField: "hims_d_services_id",
              data: "",
            },
          }}
        />
      </div>
      <div className="portlet portlet-bordered margin-bottom-15">
        <div className="portlet-title">
          <div className="caption">
            <h3 className="caption-subject">Ward and Bed List</h3>
          </div>
          <div className="actions">
            <ul className="ul-legend">
              <li>
                <span style={{ backgroundColor: "red" }}></span>Legend 1
              </li>
              <li>
                <span style={{ backgroundColor: "red" }}></span>Legend 1
              </li>
              <li>
                <span style={{ backgroundColor: "red" }}></span>Legend 1
              </li>
              <li>
                <span style={{ backgroundColor: "red" }}></span>Legend 1
              </li>
            </ul>
          </div>
        </div>
        <div className="portlet-body">
          <div className="col-12">
            <div className="row">
              <div className="col WardCol">
                <div className="row">
                  <div className="col-12">
                    <h3>Ward No.1</h3>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 bedCol">
                    <div className="row">
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col WardCol">
                <div className="row">
                  <div className="col-12">
                    <h3>Ward No.1</h3>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 bedCol">
                    <div className="row">
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col WardCol">
                <div className="row">
                  <div className="col-12">
                    <h3>Ward No.1</h3>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 bedCol">
                    <div className="row">
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col WardCol">
                <div className="row">
                  <div className="col-12">
                    <h3>Ward No.1</h3>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 bedCol">
                    <div className="row">
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col WardCol">
                <div className="row">
                  <div className="col-12">
                    <h3>Ward No.1</h3>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 bedCol">
                    <div className="row">
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col WardCol">
                <div className="row">
                  <div className="col-12">
                    <h3>Ward No.1</h3>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 bedCol">
                    <div className="row">
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col WardCol">
                <div className="row">
                  <div className="col-12">
                    <h3>Ward No.1</h3>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 bedCol">
                    <div className="row">
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col WardCol">
                <div className="row">
                  <div className="col-12">
                    <h3>Ward No.1</h3>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 bedCol">
                    <div className="row">
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>

                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col WardCol">
                <div className="row">
                  <div className="col-12">
                    <h3>Ward No.1</h3>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 bedCol">
                    <div className="row">
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
                      <div className="col-12 bedBox">
                        <span>
                          <b>Bed No.</b>
                        </span>
                        <span>Bed Type</span>
                      </div>
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
