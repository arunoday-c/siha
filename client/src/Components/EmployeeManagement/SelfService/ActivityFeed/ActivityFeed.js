import React, { Component } from "react";
import "./ActivityFeed.css";
import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class ActivityFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regularization_list: []
    };
  }

  componentWillReceiveProps(nextProps) {
    let data = nextProps.empData !== null ? nextProps.empData : {};
    this.setState(data, () => {
      this.getRegularizationRequests();
    });
  }

  getRegularizationRequests() {
    algaehApiCall({
      uri: "/leave/getEmployeeAttendReg",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            regularization_list: res.data.records
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

  render() {
    const regz = this.state.regularization_list;

    return (
      <div className="ActivityFeedScreen">
        <div className="row">
          <div className="col-8">
            <div className="activity-feed">
              {regz.map((data, index) => (
                <div
                  key={data.hims_f_attendance_regularize_id}
                  className="feed-item"
                >
                  <div className="feedCntr">
                    <div className="dateUser">
                      {moment(new Date(data.created_date)).format(
                        "MMM DD, HH:mm a"
                      )}
                      {/* <i>Shwetha - HR Administrator</i> */}
                    </div>
                    <div className="text">
                      Request to Regularize Attendance for
                      <a onClick={() => {}}>
                        {moment(data.attendance_date).format("DD MMM YYYY")}
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <div className="feed-item">
                <div className="feedCntr">
                  <div className="dateUser">
                    Sep 27, 03:48 PM by <i>Aboobacker Sidhiqe - Manager</i>
                  </div>
                  <div className="text">
                    Sick Leave Approved for<a href="#">26 Dec 2018</a>
                  </div>
                </div>
              </div>

              <div className="feed-item">
                <div className="feedCntr">
                  <div className="dateUser">
                    Sep 25, 10:32 AM by <i>Shwetha - HR Administrator</i>
                  </div>
                  <div className="text">
                    Company Employee Policy Document Uploaded
                    <a href="#">Employee Privacy Policy.pdf</a>
                  </div>
                </div>
              </div>
              <div className="feed-item">
                <div className="feedCntr">
                  <div className="dateUser">
                    Feb 06, 11:45 AM by <i>Shwetha - HR Administrator</i>
                  </div>
                  <div className="text">
                    Request to Regularize Attendance for
                    <a href="#">05 Feb 2019</a>
                  </div>
                </div>
              </div>

              <div className="feed-item">
                <div className="feedCntr">
                  <div className="dateUser">
                    Sep 27, 03:48 PM by <i>Aboobacker Sidhiqe - Manager</i>
                  </div>
                  <div className="text">
                    Sick Leave Approved for<a href="#">26 Dec 2018</a>
                  </div>
                </div>
              </div>

              <div className="feed-item">
                <div className="feedCntr">
                  <div className="dateUser">
                    Sep 25, 10:32 AM by <i>Shwetha - HR Administrator</i>
                  </div>
                  <div className="text">
                    Company Employee Policy Document Uploaded
                    <a href="#">Employee Privacy Policy.pdf</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4" />
        </div>
      </div>
    );
  }
}
