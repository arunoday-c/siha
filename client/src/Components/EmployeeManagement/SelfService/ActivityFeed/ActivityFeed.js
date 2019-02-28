import React, { Component } from "react";
import "./ActivityFeed.css";
export default class ActivityFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "ActivityFeed"
    };
  }
  skipTab(e) {
    debugger;
    e.preventDefault();

    this.props.empData.ChangeRenderTabs({
      pageDisplay: "AttendanceRegularization"
    });
  }

  componentDidMount() {
    debugger;
    let InputOutput = this.props.empData;
    this.setState({ ...this.state, ...InputOutput });
  }
  render() {
    return (
      <div className="ActivityFeedScreen">
        <div className="row">
          <div className="col-8">
            <div className="activity-feed">
              <div className="feed-item">
                <div className="feedCntr">
                  <div className="dateUser">
                    Feb 06, 11:45 AM by <i>Shwetha - HR Administrator</i>
                  </div>
                  <div className="text">
                    Request to Regularize Attendance for
                    <a href="#" onClick={this.skipTab.bind(this)}>
                      05 Feb 2019
                    </a>
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
