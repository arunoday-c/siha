import React, { Component } from "react";
export default function asyncComponent({ prefix, loadManifest }) {
  class AsyncComponent extends Component {
    state = { Component: null };

    componentDidMount() {
      if (!this.state.Component) {
        loadManifest()
          .then(res => res.data)
          .then(manifest => {
            const {
              micro: { js, css },
              metadata: { componentName }
            } = manifest;

            const runtime = manifest["runtime~micro"];
            const runtimeSrc = document.createElement("script");
            runtimeSrc.src = `${runtime["js"]}`;
            runtimeSrc.type = "text/javascript";
            runtimeSrc.crossOrigin = "anonymous";
            document.body.appendChild(runtimeSrc);
            const style = document.createElement("link");
            style.href = `${css}`;
            style.rel = "stylesheet";
            document.head.appendChild(style);
            const script = document.createElement("script");
            script.src = `${js}`;
            script.type = "text/javascript";
            script.crossOrigin = "anonymous";
            script.onload = () => {
              const Component = window[componentName];
              // console.log(Component);
              this.setState({ Component });
            };
            document.body.appendChild(script);
          });
      }
    }
    render() {
      const { Component } = this.state;
      // console.log(this.props);

      if (Component) {
        return <Component {...this.props} />;
      }

      return null;
    }
  }
  return AsyncComponent;
}
