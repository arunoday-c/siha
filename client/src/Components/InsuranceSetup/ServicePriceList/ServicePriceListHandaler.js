import { getCookie } from "../../../utils/algaehApiCall.js";
import { algaehApiCall } from "../../../utils/algaehApiCall";
import { successfulMessage } from "../../../utils/GlobalFunctions";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const resetState = $this => {
  $this.setState($this.baseState);
};

const onchangegridcol = ($this, row, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.onChangeFinish(row);
  // resetState($this);
};

const updatePriceList = ($this, data) => {
  debugger;
  data.updated_by = getCookie("UserID");
  algaehApiCall({
    uri: "/insurance/updatePriceList",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        successfulMessage({
          message: "Record updated successfully . .",
          title: "Success",
          icon: "success"
        });

        this.props.getPriceList({
          uri: "/insurance/getPriceList",
          method: "GET",
          printInput: true,
          data: {
            insurance_id: this.state.insurance_provider_id
          },
          redux: {
            type: "PRICE_LIST_GET_DATA",
            mappingName: "pricelist"
          }
        });
      }
    },
    onFailure: error => {}
  });
};

export { texthandle, onchangegridcol, resetState, updatePriceList };
