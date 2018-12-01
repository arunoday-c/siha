import AlgaehSearch from "../../Wrapper/globalSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";

const BillSearch = ($this, context, e) => {
  AlgaehSearch({
    searchGrid: {
      columns: spotlightSearch.billing.opBilling
    },
    searchName: "billsforCanel",
    uri: "/gloabelSearch/get",
    onContainsChange: (text, serchBy, callBack) => {
      callBack(text);
    },
    onRowSelect: row => {
      $this.setState({ bill_number: row.bill_number });

      if (context != null) {
        context.updateState({ bill_number: row.bill_number });
      }
    }
  });
};

export { BillSearch };
