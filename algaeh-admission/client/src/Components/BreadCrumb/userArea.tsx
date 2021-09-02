import React from "react";
export default React.memo(function UserArea(props: any) {
  return <div className="col-6 margin-top-15">{props?.userArea}</div>;
});
