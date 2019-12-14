import React, { Component } from "react";
import "./ActivityFeed.scss";
// import moment from "moment";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";

export default class ActivityFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regularization_list: [],
      absent_list: [],
      pageDisplay: "ActivityFeed"
    };

    if (props.empData !== undefined) {
      this.getActivityFeed(props.empData.hims_d_employee_id);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let data = nextProps.empData !== null ? nextProps.empData : {};
    this.setState(data, () => {
      this.getActivityFeed();
    });
  }

  getActivityFeed(id) {
    algaehApiCall({
      uri: "/attendance/getActivityFeed",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: id !== undefined ? id : this.state.hims_d_employee_id
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

  skipTab(type, data, e) {

    e.preventDefault();
    let sendData = {};

    sendData =
      type === "AttendanceRegularization"
        ? {
          pageDisplay: type,
          regularize: data
        }
        : type === "absent"
          ? {
            pageDisplay: "AttendanceRegularization",
            regularize: {
              login_date: data.absent_date,
              logout_date: data.absent_date,
              absent_id: data.hims_f_absent_id
            }
          }
          : {
            pageDisplay: type,
            leave: {
              from_date: data.absent_date,
              to_date: data.absent_date,
              from_session: "FD",
              to_session: "FD",
              absent_id: data.hims_f_absent_id,
              leave_from: "AB"
            }
          };

    this.props.parent.ChangeRenderTabs(sendData);
  }

  componentDidMount() {
    let InputOutput = this.props.parent;
    this.setState({ ...this.state, ...InputOutput });
    this.getActivityFeed();
  }

  render() {
    const regz = this.state.regularization_list;
    const abzs = this.state.absent_list;

    return (
      <div className="ActivityFeedScreen">
        <div className="row">
          <div className="col-8">
            <div className="activity-feed">
              {regz.length > 0 || abzs.length > 0 ? (
                <React.Fragment>
                  {regz.map((data, index) => (
                    <div
                      key={data.hims_f_attendance_regularize_id}
                      className="feed-item"
                    >
                      <div className="feedCntr">
                        <div className="dateUser">
                          {moment(data.updated_date).format("MMM DD , hh:mm a")}
                          by <i>{data.updated_by}</i>
                        </div>
                        <div className="text">
                          Request to
                          <a
                            onClick={this.skipTab.bind(
                              this,
                              "AttendanceRegularization",
                              data
                            )}
                          >
                            Regularize Attendance
                          </a>
                          for
                          <span className="reqDate">
                            {moment(data.attendance_date).format("DD MMM YYYY")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {abzs.map((data, index) => (
                    <div key={data.hims_f_absent_id} className="feed-item">
                      <div className="feedCntr">
                        <div className="dateUser">
                          {moment(data.updated_date).format("MMM DD , hh:mm a")}
                          by <i>{data.updated_by}</i>
                        </div>
                        <div className="text">
                          Request to
                          <a onClick={this.skipTab.bind(this, "absent", data)}>
                            Regularize Attendance
                          </a>
                          or
                          <a
                            onClick={this.skipTab.bind(
                              this,
                              "ApplyLeave",
                              data
                            )}
                          >
                            Apply Leave Attendance
                          </a>
                          for
                          <span className="reqDate">

                            {moment(data.absent_date).format(
                              "DD MMM YYYY"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ) : (
                  <div className="noActivityData">
                    <h1>Relax! You don't have any activity</h1>
                    <i className="fas fa-tasks" />
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="col-4" />
      </div>
    );
  }
}
