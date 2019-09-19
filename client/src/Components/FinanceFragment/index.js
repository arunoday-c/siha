import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FinanceFragment(props) {
  // const { hostname, protocol } = window.location;
  const [Component, setComp] = useState(null);
  const [err, setErr] = useState(null);
  const PREFIX = "/finance";

  useEffect(() => {
    function loadManifest() {
      return axios.get(`${PREFIX}/manifest.micro.json`);
    }

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
          setComp(window[componentName]);
        };
        document.body.appendChild(script);
      })
      .catch(err => setErr(err));
  }, []);

  if (Component) {
    return <Component {...props} />;
  }
  if (err) {
    return <div>Error occured</div>;
  }

  return null;
}
