import React, { Component } from "react";
import "./physician_list.css";
class PhysicianList extends Component {
  render() {
    return (
      <div className="physician_list">
        <div className="col-lg-12">
          <div className="row">
            <div className="col portlet portlet-bordered box-shadow-normal">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Physician List</h3>
                </div>
                <div className="actions">
                  <a
                    className="btn btn-primary btn-circle active"
                    //onClick={this.addAllergies}
                  >
                    <i className="fas fa-trash" />
                  </a>
                  <a
                    className="btn btn-primary btn-circle active"
                    //onClick={this.addAllergies}
                  >
                    <i className="fas fa-edit" />
                  </a>
                </div>
              </div>

              <div className="portlet-body">
                <table className="table table-striped table-bordered table-hover table-sm">
                  <thead>
                    <tr>
                      <th scope="col">
                        <input type="checkbox" />
                      </th>
                      <th scope="col">Physician Name</th>
                      <th scope="col">Selected Dates</th>
                      <th scope="col">Work Hours</th>
                      <th scope="col">Working Break 1</th>
                      <th scope="col">Working Break 2</th>
                      <th scope="col">Working Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">
                        {" "}
                        <input type="checkbox" />{" "}
                      </th>
                      <td>Mark</td>
                      <td>29-09-2018 - 29-10-2018</td>
                      <td>08:00 AM to 5:00 AM</td>
                      <td>08:00 AM to 5:00 AM</td>
                      <td>08:00 AM to 5:00 AM</td>
                      <td>Sun , Mon , Fri</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        {" "}
                        <input type="checkbox" />
                      </th>
                      <td>Jacob</td>
                      <td>29-09-2018 - 29-10-2018</td>
                      <td>08:00 AM to 5:00 AM</td>
                      <td>08:00 AM to 5:00 AM</td>
                      <td>08:00 AM to 5:00 AM</td>
                      <td>Sun , Mon , Fri</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        {" "}
                        <input type="checkbox" />
                      </th>
                      <td>Larry</td>
                      <td>29-09-2018 - 29-10-2018</td>
                      <td>08:00 AM to 5:00 AM</td>
                      <td>08:00 AM to 5:00 AM</td>
                      <td>08:00 AM to 5:00 AM</td>
                      <td>Sun , Mon , Fri</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhysicianList;
