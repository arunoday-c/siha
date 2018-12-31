import React, { Component } from "react";
import LeaveMaster from "./LeaveMaster/LeaveMaster";

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
      open: false
    };
  }

  render() {
    return (
      <div className="row leave_master_index">
        <LeaveMaster open={this.state.open} />

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
                        fieldName: "Column_1",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Column 1" }} />
                        )
                      },
                      {
                        fieldName: "Column_2",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Column 2" }} />
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
      </div>
    );
  }
}
