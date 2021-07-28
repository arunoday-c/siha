import React from "react";
// import { useForm, Controller } from "react-hook-form";
// import { useMutation, useQuery } from "react-query";
// import moment from "moment";
import "./PortalSetup.scss";
import { AlgaehDataGrid, AlgaehLabel } from "algaeh-react-components";

export function PortalSetup() {
  return (
    // <Spin spinning={isLoading || addLoading}>
    <div className="PortalSetup">
      <div className="row inner-top-search">
        <div className="col-3 form-group">
          <label>Portal Active</label>
          <div className="customRadio">
            <label className="radio inline">
              <input type="radio" value="M" name="portal_exists" />
              <span>Yes</span>
            </label>{" "}
            <label className="radio inline">
              <input type="radio" value="M" name="portal_exists" />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>
      <div className="row ">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Portal Corporate Lists</h3>
              </div>
              <div className="actions"></div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12">
                  <div id="CardMasterGrid_Cntr">
                    <AlgaehDataGrid
                      id="CardMasterGrid"
                      datavalidate="data-validate='cardDiv'"
                      columns={[
                        {
                          fieldName: "corporate_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Corporate Code" }}
                            />
                          ),
                        },
                        {
                          fieldName: "offer_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Corporate Company Name" }}
                            />
                          ),
                        },
                        {
                          fieldName: "valid_to_from",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Username" }} />
                          ),
                        },
                        {
                          fieldName: "valid_to_date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Valid Upto" }} />
                          ),
                        },
                        {
                          fieldName: "cons_service",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Consultation" }}
                            />
                          ),
                          displayTemplate: (row) =>
                            row?.avail_type === "M" ? "Yes" : "No",
                        },
                        {
                          fieldName: "lab_service",
                          label: <AlgaehLabel label={{ forceLabel: "Lab" }} />,
                          displayTemplate: (row) =>
                            row?.avail_type === "M" ? "Yes" : "No",
                        },
                        {
                          fieldName: "rad_service",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Radiology" }} />
                          ),
                          displayTemplate: (row) =>
                            row?.avail_type === "M" ? "Yes" : "No",
                        },
                      ]}
                      rowUniqueId="hims_d_promotion_id"
                      data={[
                        {
                          hims_d_promotion_id: 1,
                          code: "PROM-2010",
                          name: "some",
                        },
                        {
                          hims_d_promotion_id: 2,
                          code: "PROM-2011",
                          name: "another",
                        },
                        {
                          hims_d_promotion_id: 3,
                          code: "PROM-2012",
                          name: "spam",
                        },
                      ]}
                      // data={data}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              className="btn btn-primary"

              // onClick={}
            >
              Publish to Portal
            </button>
          </div>
        </div>
      </div>
    </div>
    // </Spin>
  );
}
