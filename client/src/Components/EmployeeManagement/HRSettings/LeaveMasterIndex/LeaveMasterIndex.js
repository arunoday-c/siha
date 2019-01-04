import React, { Component } from "react";
import LeaveMaster from "./LeaveMaster/LeaveMaster";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
export default class LeaveMasterIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      leaves: []
    };

    this.getLeaveMaster();
  }

  editLeaveMaster() {
    this.setState({
      open: true
    });
  }

  getLeaveMaster() {
    algaehApiCall({
      uri: "/selfService/getLeaveMaster",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            leaves: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  closeModal() {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div className="row leave_master_index">
        <LeaveMaster
          open={this.state.open}
          onClose={this.closeModal.bind(this)}
        />

        <div className="col-12">
          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Leave Master List</h3>
              </div>
              <div className="actions">
                <a
                  className="btn btn-primary btn-circle active"
                  onClick={() => {
                    this.setState({
                      open: true
                    });
                  }}
                >
                  <i className="fas fa-plus" />
                </a>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LeaveMasterList_Cntr">
                  <AlgaehDataGrid
                    id="LeaveMasterList"
                    datavalidate="LeaveMasterList"
                    columns={[
                      {
                        fieldName: "action",

                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                className="fas fa-pen"
                                onClick={this.editLeaveMaster.bind(this)}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 65,
                          resizable: false,
                          filterable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "leave_code",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Code" }} />
                        )
                      },
                      {
                        fieldName: "leave_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "leave_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "leave_type",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        )
                      }
                    ]}
                    keyId="hims_d_leave_id"
                    dataSource={{ data: this.state.leaves }}
                    isEditable={false}
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
    );
  }
}
