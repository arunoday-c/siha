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
  $this.setState({ dummy: !$this.state.dummy });
};

const onchangecalculation = ($this, row, ctrl, e) => {
  let netamount = 0;
  // let discountAmt =
  if (e.target.name === "corporate_discount_amt") {
    if (e.target.value !== 0) {
      netamount = row["gross_amt"] - e.target.value;
    } else {
      netamount = row["gross_amt"];
    }
  } else if (e.target.name === "gross_amt") {
    if (row["corporate_discount_amt"] !== 0) {
      netamount = e.target.value - row["corporate_discount_amt"];
    } else {
      netamount = e.target.value;
    }
  }
  row["net_amount"] = parseFloat(netamount);
  row[e.target.name] = parseFloat(e.target.value);
  resetState($this);
};
const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  // row.onChangeFinish(row);
  resetState($this);
};

const updatePriceList = ($this, data) => {
  //data.updated_by = getCookie("UserID");
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

        $this.props.getPriceList({
          uri: "/insurance/getPriceList",
          method: "GET",
          printInput: true,
          data: {
            insurance_id: $this.state.insurance_provider_id
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

const bulkUpdate = ($this, data) => {
  let updateobj = {};

  if (data === "pre_approval") {
    updateobj = {
      update: data,
      pre_approval: $this.state.pre_approval,
     // updated_by: getCookie("UserID"),
      insurance_id: $this.state.insurance_provider_id
    };
  } else if (data === "covered") {
    updateobj = {
      update: data,
      covered: $this.state.covered,
     // updated_by: getCookie("UserID"),
      insurance_id: $this.state.insurance_provider_id
    };
  } else if (data === "corporate_discount") {
    if ($this.state.applicable === null) {
      successfulMessage({
        message: "Records updated successfully . .",
        title: "Warning",
        icon: "warning"
      });
      return;
    } else {
      if ($this.state.applicable === "P") {
        updateobj = {
          discountType: $this.state.applicable,
          update: data,
          corporate_discount: $this.state.corporate_discount,
         // updated_by: getCookie("UserID"),
          insurance_id: $this.state.insurance_provider_id
        };
      } else if ($this.state.applicable === "A") {
        updateobj = {
          discountType: $this.state.applicable,
          update: data,
          corporate_discount: $this.state.corporate_discount,
         // updated_by: getCookie("UserID"),
          insurance_id: $this.state.insurance_provider_id
        };
      }
    }
  }
  algaehApiCall({
    uri: "/insurance/updatePriceListBulk",
    data: updateobj,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        successfulMessage({
          message: "Records updated successfully . .",
          title: "Success",
          icon: "success"
        });

        $this.props.getPriceList({
          uri: "/insurance/getPriceList",
          method: "GET",
          printInput: true,
          data: {
            insurance_id: $this.state.insurance_provider_id
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

export {
  texthandle,
  onchangegridcol,
  resetState,
  updatePriceList,
  onchangecalculation,
  bulkUpdate
};
