import React, { Component } from "react";
import "./ActivityFeed.css";
// import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

export default class ActivityFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regularization_list: [],
      absent_list: [],
      pageDisplay: "ActivityFeed"
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
      uri: "/attendance/getActivityFeed",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: this.state.hims_d_employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            regularization_list: res.data.result.exceptions,
            absent_list: res.data.result.absents
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

  skipTab(type, e) {
    e.preventDefault();
    this.props.parent.ChangeRenderTabs({
      pageDisplay: type,
      regularize: {
        hims_f_attendance_regularize_id: 201,
        login_date: "2019-01-16",
        logout_date: "2019-01-16",
        punch_in_time: null,
        punch_out_time: "15:26:00",
        regularize_in_time: "06:00:06",
        regularize_out_time: "15:26:00"
      },
      leave: {
        from_date: "2019-01-20",
        to_date: "2019-01-20",
        from_session: "FD",
        to_session: "FD"
      }
    });
  }

  componentDidMount() {
    let InputOutput = this.props.parent;
    this.setState({ ...this.state, ...InputOutput });
  }
  render() {
    const regz = this.state.regularization_list;
    const abzs = this.state.absent_list;

    return (
      <div className="ActivityFeedScreen">
        <div className="row">
          <div className="col-8">
            <div className="activity-feed">
              {regz.map((data, index) => (
                <div className="feed-item">
                  <div className="feedCntr">
                    <div className="dateUser">
                      Feb 06, 11:45 AM by <i>Shwetha - HR Administrator</i>
                    </div>
                    <div className="text">
                      Request to{" "}
                      <a
                        href="#"
                        onClick={this.skipTab.bind(
                          this,
                          "AttendanceRegularization"
                        )}
                      >
                        Regularize Attendance{" "}
                      </a>{" "}
                      for
                      <span className="reqDate">05 Feb 2019</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="feed-item">
                <div className="feedCntr">
                  <div className="dateUser">
                    Feb 06, 11:45 AM by <i>Shwetha - HR Administrator</i>
                  </div>
                  <div className="text">
                    Request to
                    <a
                      onClick={this.skipTab.bind(
                        this,
                        "AttendanceRegularization"
                      )}
                    >
                      Regularize Attendance
                    </a>
                    or
                    <a onClick={this.skipTab.bind(this, "ApplyLeave")}>
                      Apply Leave Attendance
                    </a>
                    for
                    <span className="reqDate"> 05 Feb 2019</span>
                  </div>
                </div>
              </div>

              <div className="feed-item">
                <div className="feedCntr">
                  <div className="dateUser">
                    Sep 27, 03:48 PM by <i>Aboobacker Sidhiqe - Manager</i>
                  </div>
                  <div className="text">
                    Sick Leave Approved for
                    <a
                      onClick={this.skipTab.bind(
                        this,
                        "AttendanceRegularization"
                      )}
                    >
                      16 Jan 2018
                    </a>
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
        </div>
        <div className="col-4" />
      </div>
    );
  }
}
