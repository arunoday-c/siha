import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";
import moment from "moment";
import Options from "../../../Options.json";

const LocationchangeTexts = ($this, location, ctrl, e) => {
  e = ctrl || e;

  if (e.value === undefined) {
    $this.setState({ [e]: null });
  } else {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    if (location === "From") {
      if ($this.state.to_location_id === value) {
        swalMessage({
          title: "From Location and To Location Cannot be Same ",
          type: "error"
        });
        $this.setState({ [name]: null });
      } else {
        $this.setState({ [name]: value }, () => {
          getSalesOrderList($this);
        });
      }
    } else if (location === "To") {
      if ($this.state.from_location_id === value) {
        swalMessage({
          title: "From Location and To Location Cannot be Same ",
          type: "error"
        });
        $this.setState({ [name]: null });
      } else if ($this.state.from_location_id === null) {
        swalMessage({
          title: "From Location cannot be blank. ",
          type: "error"
        });
        $this.setState({ [name]: null });
      } else {
        $this.setState({ [name]: value }, () => {
          getSalesOrderList($this);
        });
      }
    }
  }
};

const getSalesOrderList = $this => {
  let inpObj = { status: $this.state.status };

  if ($this.state.from_date !== null) {
    inpObj.from_date = $this.state.from_date;
  }
  if ($this.state.to_date !== null) {
    inpObj.to_date = $this.state.to_date;
  }

  if ($this.state.customer_id) {
    inpObj.customer_id = $this.state.customer_id;
  }

  algaehApiCall({
    uri: "/SalesOrder/getSalesOrderList",
    module: "sales",
    method: "GET",
    data: inpObj,

    onSuccess: response => {
      if (response.data.success) {
        let data = response.data.records;
        $this.setState({ order_list: data });
        return $this.props.history?.push(
          `${$this.props.location?.pathname}?status=${$this.state.status}&from_date=${$this.state.from_date}&to_date=${$this.state.to_date}`
        );
      }
    }
  });
};

const dateFormater = ($this, value) => {
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
        getSalesOrderList($this);
      }
    );
  }
};

const changeEventHandaler = ($this, ctrl, e) => {
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value }, () => {
    getSalesOrderList($this);
  });
};


const dateFormaterTime = ($this, value) => {
  if (value !== null) {
    return moment(value).format(Options.datetimeFormat24);
  }
};

export {
  LocationchangeTexts,
  dateFormater,
  getSalesOrderList,
  datehandle,
  changeEventHandaler,
  dateFormaterTime
};
