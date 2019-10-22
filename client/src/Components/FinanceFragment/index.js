import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie, getLocalIP, getToken } from "../../utils/algaehApiCall";

export default function FinanceFragment(props) {
  const [Component, setComp] = useState(null);
  const [err, setErr] = useState(null);
  const PREFIX = window.location.port
    ? "http://localhost:3007/finbuild"
    : "/finance/finbuild";

  useEffect(() => {
    function loadManifest() {
      return axios.get(`${PREFIX}/manifest.micro.json`, {});
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
        const script = document.getElementById("finance-script");
        const hashAttr = script.getAttribute("data-hash");
        console.log(hashAttr !== hash, "the truth");
        if (hashAttr !== hash) {
          script.remove();
          const newScript = document.createElement("script");
          newScript.src = `${PREFIX}${js}`;
          newScript.type = "text/javascript";
          newScript.setAttribute("data-hash", hash);
          newScript.id = "finance-script";
          newScript.crossOrigin = "anonymous";
          newScript.onload = () => {
            console.log(window[componentName], componentName);
            setComp(window[componentName]);
          };
          document.body.appendChild(newScript);
        } else {
          setComp(window[componentName]);
        }
      })
      .catch(err => setErr(err));
  }, []);

  if (Component) {
    const ReqComp = Component[props.path];
    console.log(ReqComp);
    return <ReqComp hello="this is from hims" />;
  }
  if (err) {
    return <div>Error occured</div>;
  }

  return null;
}
