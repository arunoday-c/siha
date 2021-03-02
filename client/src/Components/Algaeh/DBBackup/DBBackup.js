import React from "react";
import "./DBBackup.scss";
import {
  // AlgaehLabel,
  AlgaehFormGroup,
  // AlgaehMessagePop,
} from "algaeh-react-components";

export default function DBBackup() {
  return (
    <div className="DBBackup">
      <div className="row" style={{ marginTop: 45 }}>
        <div className="col form-group">
          <div className="portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">MySQL Backup</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <AlgaehFormGroup
                  div={{ className: "col-12 mandatory form-group" }}
                  // error={errors}
                  label={{
                    forceLabel: "Host Name",
                    isImp: true,
                  }}
                  textBox={{
                    type: "text",
                    name: "",
                    className: "form-control",
                  }}
                />{" "}
                <AlgaehFormGroup
                  div={{ className: "col-12 mandatory form-group" }}
                  // error={errors}
                  label={{
                    forceLabel: "Username",
                    isImp: true,
                  }}
                  textBox={{
                    type: "text",
                    name: "",
                    className: "form-control",
                  }}
                />
                <AlgaehFormGroup
                  div={{ className: "col-12 mandatory form-group" }}
                  // error={errors}
                  label={{
                    forceLabel: "Password",
                    isImp: true,
                  }}
                  textBox={{
                    type: "password",
                    name: "",
                    className: "form-control",
                  }}
                />
                <div className="col-12">
                  <button className="btn btn-primary btn-sm">Connect</button>
                </div>
                <div className="col-12">
                  <label>DB List</label>
                  <div className="DBList">
                    <ul>
                      <li>
                        <span className="checkBoxDB">
                          <input type="checkbox" checked />
                          <i className="fas fa-check" />
                        </span>
                        <span className="DBListName">DB Name 1</span>
                      </li>{" "}
                      <li>
                        <span className="checkBoxDB">
                          <input type="checkbox" />
                          <i className="fas fa-check" />
                        </span>
                        <span className="DBListName">DB Name 1</span>
                      </li>{" "}
                      <li>
                        <span className="checkBoxDB">
                          <input type="checkbox" />
                          <i className="fas fa-check" />
                        </span>
                        <span className="DBListName">DB Name 1</span>
                      </li>{" "}
                      <li>
                        <span className="checkBoxDB">
                          <input type="checkbox" />
                          <i className="fas fa-check" />
                        </span>
                        <span className="DBListName">DB Name 1</span>
                      </li>{" "}
                      <li>
                        <span className="checkBoxDB">
                          <input type="checkbox" />
                          <i className="fas fa-check" />
                        </span>
                        <span className="DBListName">DB Name 1</span>
                      </li>{" "}
                      <li>
                        <span className="checkBoxDB">
                          <input type="checkbox" />
                          <i className="fas fa-check" />
                        </span>
                        <span className="DBListName">DB Name 1</span>
                      </li>{" "}
                      <li>
                        <span className="checkBoxDB">
                          <input type="checkbox" />
                          <i className="fas fa-check" />
                        </span>
                        <span className="DBListName">DB Name 1</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <AlgaehFormGroup
                  div={{ className: "col-12 mandatory form-group" }}
                  // error={errors}
                  label={{
                    forceLabel: "DB Path",
                    isImp: true,
                  }}
                  textBox={{
                    type: "file",
                    name: "",
                    className: "form-control",
                  }}
                />
                <AlgaehFormGroup
                  div={{ className: "col-12 mandatory form-group" }}
                  // error={errors}
                  label={{
                    forceLabel: "DB Save Path",
                    isImp: true,
                  }}
                  textBox={{
                    type: "file",
                    name: "",
                    className: "form-control",
                  }}
                />
                <AlgaehFormGroup
                  div={{ className: "col-12 mandatory form-group" }}
                  // error={errors}
                  label={{
                    forceLabel: "Auto Backup Interval (Days)",
                    isImp: true,
                  }}
                  textBox={{
                    type: "number",
                    name: "",
                    className: "form-control",
                  }}
                />
                <div className="col-12">
                  <button className="btn btn-primary btn-sm">
                    Start Backup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="col form-group">
          <div className="portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">MongoDB Backup</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">ghfghfgh</div>
            </div>
          </div>
        </div>{" "}
        <div className="col form-group">
          <div className="portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Insurance Folder Backup</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row"></div>
            </div>
          </div>
        </div>{" "}
        <div className="col form-group">
          <div className="portlet portlet-bordered">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Image Upload Folder Backup</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
