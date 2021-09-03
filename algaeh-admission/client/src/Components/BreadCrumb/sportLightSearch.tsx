import React from "react";
import { AlgaehLabel, AlgaehSearch } from "algaeh-react-components";
export default React.memo(function SpotLightSearch(props: any) {
  const { spotlightSearch } = props;

  function onClickHandler() {
    if (typeof spotlightSearch?.events?.onClick === "function") {
      spotlightSearch?.events?.onClick(onRaise);
    } else {
      onRaise();
    }
  }
  function onRaise() {
    AlgaehSearch({
      //@ts-ignore
      searchName: spotlightSearch?.searchName,
      columns: spotlightSearch.columns ?? [],
      placeHolder: spotlightSearch.placeHolder,
      onRowSelect: spotlightSearch?.events?.onRowSelect,
    });
  }

  return (
    <div className="col-2">
      <div className="row spotlightSearchBox" onClick={onClickHandler}>
        <div className="col">
          <AlgaehLabel label={{ forceLabel: spotlightSearch?.label }} />
          <h6>{spotlightSearch?.value ?? "----------"}</h6>
        </div>
        <div className="col spotlightSearchIconBox">
          <i className="fas fa-search fa-lg" />
        </div>
      </div>
    </div>
  );
});
