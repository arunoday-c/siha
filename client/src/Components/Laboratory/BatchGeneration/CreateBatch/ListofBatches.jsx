import React, { memo } from "react";
import "./CreateBatch.scss";
// import { AlgaehLabel } from "algaeh-react-components";
import DisplayComponent from "./DisplayComponent";

export default memo(function BatchDetails({ batch_list, deleteState }) {
  return (
    <div className="col-12">
      {/* <div className="customLISearch">
        <input
          type="text"
          placeholder="Search by Name, Primary ID or Lab ID"
        ></input>
      </div> */}

      <div className="CreateBatchList">
        <ul>
          <li>
            <p className="actionSec">
              {/* <i className="fas fa-trash-alt"></i> */}
            </p>
            <p class="valueSec">
              <span>
                <small>Patient Full Name</small>
              </span>
              <span>
                <small>Test Name</small>
              </span>
              <span>
                <small>Lab ID No.</small>
              </span>
              <span>
                <small>Primary ID No.</small>
              </span>
            </p>
          </li>
          {batch_list.map((item) => {
            return (
              <DisplayComponent
                key={item.id_number}
                item={item}
                deleteState={deleteState}
              />
            );
          })}
        </ul>
      </div>
      <div className="portlet">
        <div className="portlet-body">
          <div className="row">
            <div className="col-12" style={{ textAlign: "right" }}>
              <div className="row">
                <div className="col-9"></div>

                <div className="col-3">
                  <label className="style_Label ">No.of Test Added</label>
                  <h6>{batch_list.length}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
