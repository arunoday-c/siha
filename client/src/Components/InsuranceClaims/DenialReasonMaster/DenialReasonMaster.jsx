import React from "react";
import "./DenialReasonMaster.scss";
import { AlgaehFormGroup, AlgaehDataGrid } from "algaeh-react-components";
import ButtonType from "../../Wrapper/algaehButton";
export default function DenialReasonMaster() {
  return (
    <div className="row DenialReasonMasterScreen">
      <div className="col-12">
        <div className="row inner-top-search">
          <AlgaehFormGroup
            div={{ className: "col-3 mandatory form-group" }}
            label={{
              forceLabel: "Denial Reason Code",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "",
              type: "text",
              value: "",
              placeholder: "DRC0001",
            }}
          />
          <AlgaehFormGroup
            div={{ className: "col-7 mandatory form-group" }}
            label={{
              forceLabel: "Denial Reason",
              isImp: true,
            }}
            textBox={{
              className: "txt-fld",
              name: "",
              type: "text",
              value: "",
              // onChange: (e) => {},
              placeholder: "Denial Reason",
            }}
          />
          <div className="col-2" style={{ marginTop: 21 }}>
            {" "}
            <ButtonType
              className="btn btn-primary"
              label={{
                forceLabel: "Add to List",
                returnText: true,
              }}
              // loading={loading_request_list}
            />
          </div>
        </div>{" "}
        <div className="row">
          <div className="col-12 margin-top-15">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Denial Reason List</h3>
                </div>
                <div className="actions"></div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="DenialFormGrid_Cntr">
                    <AlgaehDataGrid
                      className="DenialFormGrid"
                      columns={[
                        {
                          fieldName: "action",
                          label: "Actions",

                          others: {
                            maxWidth: 80,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "",
                          label: "DENIAL REASON CODE",
                          others: {
                            maxWidth: 180,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "",
                          label: "DENIAL REASON",
                        },
                      ]}
                      loading={false}
                      data={[]}
                      pagination={true}
                      events={
                        {
                          // onSave: updatePrePayReq,
                          // onEdit:
                          // onEditShow:
                        }
                      }
                      others={{}}
                    />
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
