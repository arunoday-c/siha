import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const networkhandle = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let inputObj = {
    insurance_id: $this.state.insurance_provider_id,
    network_id: value
  };

  $this.props.getPriceList({
    uri: "/insurance/getPolicyPriceList",
    module: "insurance",
    method: "GET",
    data: inputObj,
    redux: {
      type: "PRICE_LIST_GET_DATA",
      mappingName: "pricelist"
    },
    afterSuccess: data => {
      $this.setState({
        [name]: value
      });
    }
  });
};

const onchangecalculation = ($this, row, e) => {
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
  row.update();
};
const onchangegridcol = ($this, row, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  row[name] = value;
  row.update();
};

const updatePriceList = ($this, data) => {
  //data.updated_by = getCookie("UserID");
  algaehApiCall({
    uri: "/insurance/updatePriceList",
    module: "insurance",
    data: data,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        swalMessage({
          title: "Record updated successfully . .",
          type: "success"
        });

        getPriceList($this);
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const bulkUpdate = ($this, data) => {
  let updateobj = {};

  if (data === "pre_approval") {
    updateobj = {
      update: data,
      pre_approval: $this.state.pre_approval,
      insurance_id: $this.state.insurance_provider_id
    };
  } else if (data === "covered") {
    updateobj = {
      update: data,
      covered: $this.state.covered,
      insurance_id: $this.state.insurance_provider_id
    };
  } else if (data === "corporate_discount") {
    if ($this.state.applicable === null) {
      swalMessage({
        title: "Record updated successfully . .",
        type: "success"
      });
      return;
    } else {
      if ($this.state.applicable === "P") {
        updateobj = {
          discountType: $this.state.applicable,
          update: data,
          corporate_discount: $this.state.corporate_discount,
          insurance_id: $this.state.insurance_provider_id
        };
      } else if ($this.state.applicable === "A") {
        updateobj = {
          discountType: $this.state.applicable,
          update: data,
          corporate_discount: $this.state.corporate_discount,
          insurance_id: $this.state.insurance_provider_id
        };
      }
    }
  }
  algaehApiCall({
    uri: "/insurance/updatePriceListBulk",
    module: "insurance",
    data: updateobj,
    method: "PUT",
    onSuccess: response => {
      if (response.data.success) {
        if (data === "pre_approval") {
          $this.setState({
            pre_approval: null
          });
        } else if (data === "covered") {
          $this.setState({
            covered: null
          });
        } else if (data === "corporate_discount") {
          $this.setState({
            corporate_discount: 0,
            applicable: null
          });
        }

        // getPriceList($this);

        let inputObj = { insurance_id: $this.state.insurance_provider_id };
        if ($this.state.service_type_id !== null) {
          inputObj.service_type_id = $this.state.service_type_id;
        }

        $this.props.getPriceList({
          uri: "/insurance/getPriceList",
          module: "insurance",
          method: "GET",
          data: inputObj,
          redux: {
            type: "PRICE_LIST_GET_DATA",
            mappingName: "pricelist"
          },
          afterSuccess: data => {
            swalMessage({
              title: "Record updated successfully . .",
              type: "success"
            });
          }
        });
      }
    },
    onFailure: error => {
      swalMessage({
        title: error.message,
        type: "error"
      });
    }
  });
};

const serviceTypeHandeler = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      getPriceList($this);
    }
  );
};

const getPriceList = $this => {
  let inputObj = { insurance_id: $this.state.insurance_provider_id };
  if ($this.state.service_type_id !== null) {
    inputObj.service_type_id = $this.state.service_type_id;
  }

  $this.props.getPriceList({
    uri: "/insurance/getPriceList",
    module: "insurance",
    method: "GET",
    data: inputObj,
    redux: {
      type: "PRICE_LIST_GET_DATA",
      mappingName: "pricelist"
    }
  });
};

const Refresh = $this => {
  $this.setState(
    {
      service_type_id: null
    },
    () => {
      getPriceList($this);
    }
  );
};

export {
  texthandle,
  onchangegridcol,
  updatePriceList,
  onchangecalculation,
  bulkUpdate,
  serviceTypeHandeler,
  getPriceList,
  Refresh,
  networkhandle
};
