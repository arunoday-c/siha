import React, { Component } from "react";
import "./appointment_rooms.css";

class AppointmentRooms extends Component {
  render() {
    return (
      <div className="appointment_rooms">
        <div className="col-lg-12 divInner">
          <div className="row">
            <div className="col-lg-3 divInnerLeft">
              <div className="row">
                <div className="col-lg-12">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Room No/ Name.."
                    />
                    <span className="input-group-btn">
                      <button
                        className="btn btn-primary"
                        type="button"
                        style={{ margin: 0 }}
                      >
                        Add
                      </button>
                    </span>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="border-layout" />
                </div>
              </div>
            </div>
            <div className="col-lg-9 divInnerRight">
              Right Content comes here
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AppointmentRooms;
