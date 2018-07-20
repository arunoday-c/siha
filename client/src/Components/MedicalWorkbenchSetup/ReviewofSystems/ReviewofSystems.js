import React, { Component } from "react";
import "./review_of_systems.css";
import Paper from "@material-ui/core/Paper";
class ReviewofSystems extends Component {
  render() {
    return (
      <div className="review_of_systems">
        <Paper>
          <div
            className="row"
            style={{
              padding: 10,
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            REVIEW OF SYSTEMS
          </div>
        </Paper>
      </div>
    );
  }
}

export default ReviewofSystems;
