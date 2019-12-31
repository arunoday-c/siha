import React, { Component } from "react";
import ReactDOM from "react-dom";
export default function asyncComponent({ prefix, loadManifest }) {
  loadManifest()
    .then(res => res.data)
    .then(manifest => {
      const {
        micro: { js, css },
        metadata: { componentName }
      } = manifest;
      const script = document.createElement("script");
      const rootEl = document.createElement("div");
      rootEl.id = "app2";
      document.body.appendChild(rootEl);
      script.src = `${prefix}${js}`;
      script.type = "text/javascript";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        const Component = window[componentName];
        // console.log(Component);
        ReactDOM.render(<Component />, document.getElementById("app2"));
      };
      document.body.appendChild(script);
    });
}
