import moment from "moment";
import Options from "../../../Options.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import { persistStateOnBack } from "algaeh-react-components";

const changeTexts = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const dateFormater = (value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d,
  });
};
const ProcessItemMoment = ($this) => {
  persistStateOnBack($this.state, true);
  if ($this.state.from_date === null) {
    swalMessage({
      title: "Please Enter From Date",
      type: "warning",
    });
    return;
  } else if ($this.state.to_date === null) {
    swalMessage({
      title: "Please Enter To Date",
      type: "warning",
    });
    return;
  }
  AlgaehLoader({ show: true });
  let inputObj = {};
  if ($this.state.location_id !== null) {
    inputObj.from_location_id = $this.state.location_id;
  }
  if ($this.state.item_code_id !== null) {
    inputObj.item_code_id = $this.state.item_code_id;
  }
  if (
    $this.state.vendor_batchno !== null &&
    $this.state.vendor_batchno !== ""
  ) {
    inputObj.vendor_batchno = $this.state.vendor_batchno;
  }
  if ($this.state.transaction_type !== null) {
    inputObj.transaction_type = $this.state.transaction_type;
  }
  if ($this.state.from_date !== null) {
    inputObj.from_date = moment($this.state.from_date).format(
      Options.dateFormatYear
    );
  }
  if ($this.state.to_date !== null) {
    inputObj.to_date = moment($this.state.to_date).format(
      Options.dateFormatYear
    );
  }

  algaehApiCall({
    uri: "/pharmacyGlobal/getItemMoment",
    module: "pharmacy",
    method: "GET",
    printInput: true,
    data: inputObj,
    onSuccess: (response) => {
      if (response.data.success) {
        let data = response.data.records;

        $this.setState(
          {
            itemmoment: data,
          },
          () => {
            AlgaehLoader({ show: false });
          }
        );
        return $this.props.history?.push(
          `${$this.props.location?.pathname}?from_date=${$this.state.from_date}&to_date=${$this.state.to_date}&item_code_id=${$this.state.item_code_id}&vendor_batchno=${$this.state.vendor_batchno}&transaction_type=${this.state.transaction_type}&from_location_id=${this.state.from_location_id}`
        );
      }
    },
    onFailure: (error) => {
      AlgaehLoader({ show: false });
      swalMessage({
        title: error.message,
        type: "error",
      });
    },
  });
};

const dateValidate = ($this, value, e) => {
  let inRange = false;
  if (e.target.name === "from_date") {
    inRange = moment(value).isAfter(
      moment($this.state.to_date).format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "From Date cannot be grater than To Date.",
        type: "warning",
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null,
      });
    }

    inRange = moment(value).isAfter(moment().format("YYYY-MM-DD"));
    if (inRange) {
      swalMessage({
        title: "From Date cannot be Future Date.",
        type: "warning",
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null,
      });
    }
  } else if (e.target.name === "to_date") {
    inRange = moment(value).isBefore(
      moment($this.state.from_date).format("YYYY-MM-DD")
    );
    if (inRange) {
      swalMessage({
        title: "To Date cannot be less than From Date.",
        type: "warning",
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null,
      });
    }
    inRange = moment(value).isAfter(moment().format("YYYY-MM-DD"));
    if (inRange) {
      swalMessage({
        title: "To Date cannot be Future Date.",
        type: "warning",
      });
      e.target.focus();
      $this.setState({
        [e.target.name]: null,
      });
    }
  }
};
const generateReports = ($this) => {
  let inputObj = {};
  if ($this.state.location_id !== null) {
    inputObj.from_location_id = $this.state.location_id;
  }
  if ($this.state.item_code_id !== null) {
    inputObj.item_code_id = $this.state.item_code_id;
  }
  if (
    $this.state.vendor_batchno !== null &&
    $this.state.vendor_batchno !== ""
  ) {
    inputObj.vendor_batchno = $this.state.vendor_batchno;
  }
  if ($this.state.transaction_type !== null) {
    inputObj.transaction_type = $this.state.transaction_type;
  }
  if ($this.state.from_date !== null) {
    inputObj.from_date = moment($this.state.from_date).format(
      Options.dateFormatYear
    );
  }
  if ($this.state.to_date !== null) {
    inputObj.to_date = moment($this.state.to_date).format(
      Options.dateFormatYear
    );
  }
  // console.log("abcd");
  algaehApiCall({
    uri: $this.state.exportAsPdf === "Y" ? "/report" : "/excelReport",
    // uri: "/excelReport",
    method: "GET",
    module: "reports",
    headers: {
      Accept: "blob",
    },
    others: { responseType: "blob" },
    data: {
      report: {
        reportName: "pharmItemMomentEnquiryReport",
        pageOrentation: "landscape",
        // excelTabName: ,
        excelHeader: false,
        reportParams: [inputObj],
        // outputFileType: "EXCEL", //"EXCEL", //"PDF",
      },
    },
    onSuccess: (res) => {
      if ($this.state.exportAsPdf === "Y") {
        const urlBlob = URL.createObjectURL(res.data);
        const origin = `${window.location.origin}/reportviewer/web/viewer.html?file=${urlBlob}&filename=Inventory Item Master`;
        window.open(origin);
      } else {
        const urlBlob = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = urlBlob;
        a.download = `Inventory Item Master.${"xlsx"}`;
        a.click();
      }
    },
  });
};
const DrillDownScree = (row, $this) => {
  if (row.transaction_type === "ST") {
    $this.props.history.push(
      `/TransferEntry?transaction_id=${row.transaction_id}`
    );
  } else if (row.transaction_type === "POS") {
    $this.props.history.push(
      `/PointOfSale?transaction_id=${row.transaction_id}`
    );
  } else if (row.transaction_type === "SRT") {
    $this.props.history.push(
      `/SalesReturn?transaction_id=${row.transaction_id}`
    );
  } else if (row.transaction_type === "INT") {
    $this.props.history.push(
      `/InitialStock?transaction_id=${row.transaction_id}`
    );
  } else if (row.transaction_type === "CS") {
    $this.props.history.push(
      `/ConsumptionEntry?transaction_id=${row.transaction_id}`
    );
  } else if (row.transaction_type === "DNA") {
    $this.props.history.push(
      `/DeliveryNoteEntry?transaction_id=${row.transaction_id}`
    );
  } else if (row.transaction_type === "ACK") {
    $this.props.history.push(
      `/TransferEntry?transaction_id=${row.transaction_id}`
    );
  } else if (row.transaction_type === "PR") {
    $this.props.history.push(
      `/PurchaseReturnEntry?transaction_id=${row.transaction_id}`
    );
  } else if (row.transaction_type === "AD") {
    $this.props.history.push(
      `/StockAdjustment?transaction_id=${row.transaction_id}`
    );
  }
};

export {
  changeTexts,
  dateFormater,
  datehandle,
  ProcessItemMoment,
  dateValidate,
  DrillDownScree,
  generateReports,
};
