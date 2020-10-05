import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../../Options.json";


const getSalesInvoiceList = $this => {
  let inpObj = {};

  if ($this.state.from_date !== null) {
    inpObj.from_date = $this.state.from_date;

  }
  if ($this.state.to_date !== null) {
    inpObj.to_date = $this.state.to_date;
  }



  algaehApiCall({
    uri: "/SalesInvoice/getSalesInvoiceList",
    module: "sales",
    method: "GET",
    data: inpObj,

    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        $this.setState({ invoice_list: data });
        debugger
        return $this.props.history?.push(
          `${$this.props.location?.pathname}?from_date=${$this.state.from_date}&to_date=${$this.state.to_date}`
        );
      }

    }
  });
};

const dateFormater = (value) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};
const datehandle = ($this, ctrl, e) => {
  let intFailure = false;
  if (e === "from_date") {
    if (Date.parse($this.state.to_date) < Date.parse(moment(ctrl)._d)) {
      intFailure = true;
      swalMessage({
        title: "From Date cannot be grater than To Date.",
        type: "warning"
      });
    }
  } else if (e === "to_date") {
    if (Date.parse(moment(ctrl)._d) < Date.parse($this.state.from_date)) {
      intFailure = true;
      swalMessage({
        title: "To Date cannot be less than From Date.",
        type: "warning"
      });
    }
  }

  if (intFailure === false) {
    $this.setState(
      {
        [e]: moment(ctrl)._d
      },
      () => {
        getSalesInvoiceList($this);
      }
    );
  }
};

const changeEventHandaler = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value }, () => {
    getSalesInvoiceList($this);
  });
};


const dateFormaterTime = (value) => {
  if (value !== null) {
    return moment(value).format(Options.datetimeFormat24);
  }
};

export {
  dateFormater,
  getSalesInvoiceList,
  datehandle,
  changeEventHandaler,
  dateFormaterTime
};
