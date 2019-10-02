import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FinanceFragment(props) {
  // const { hostname, protocol } = window.location;
  console.log(props);
  const [Component, setComp] = useState(null);
  const [err, setErr] = useState(null);
  const PREFIX = window.location.port ? "http://localhost:3007" : "/finance";

  useEffect(() => {
    function loadManifest() {
      return axios.get(`${PREFIX}/manifest.micro.json`);
    }

    loadManifest()
      .then(res => res.data)
      .then(manifest => {
        const {
          micro: { js },
          metadata: { componentName }
        } = manifest;
        const hash = js.split(".")[1];
        console.log(hash, "hash");
        const existing = document.querySelectorAll(`#${hash}`);
        if (existing) {
          console.log(existing);
        }
        const script = document.createElement("script");
        script.src = `${PREFIX}${js}`;
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        script.onload = () => {
          console.log(window[componentName], componentName);
          setComp(window[componentName]);
        };
        // document.body.appendChild(script1);
        document.body.appendChild(script);
      })
      .catch(err => setErr(err));
  }, []);

  if (Component) {
    const ReqComp = Component[props.path];
    return <ReqComp />;
  }
  if (err) {
    return <div>Error occured</div>;
  }

  return null;
}
