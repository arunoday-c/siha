import React, { Component } from "react";

class algaehErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null
    };
  }

  componentDidCatch(error, info) {
    console.error("Crash Reason", error + "Info:" + info);

    if (error) {
      this.setState({
        error: error,
        info: info
      });
    }
  }

  render() {
    if (this.state.info) {
      return (
        <div>
          {this.props.errorMessage !== undefined &&
          this.props.errorMessage !== null &&
          this.props.errorMessage.length > 0
            ? this.props.errorMessage
            : "OOPS!. . There is posibbly an error here"}
        </div>
      );
    }
    return this.props.children;
  }
}

export default algaehErrorBoundary;
