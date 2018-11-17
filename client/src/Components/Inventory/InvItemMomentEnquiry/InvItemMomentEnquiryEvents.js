import moment from "moment";
import Options from "../../../Options.json";
import AlgaehLoader from "../../Wrapper/fullPageLoader";
import { AlgaehValidation } from "../../../utils/GlobalFunctions";

const changeTexts = ($this, ctrl, e) => {
  
  e = ctrl || e;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  $this.setState({ [name]: value });
};

const dateFormater = ({ value }) => {
  if (value !== null) {
    return moment(value).format(Options.dateFormat);
  }
};

const datehandle = ($this, ctrl, e) => {
  $this.setState({
    [e]: moment(ctrl)._d
  });
};
const ProcessItemMoment = $this => {
  AlgaehValidation({
    alertTypeIcon: "warning",
    querySelector: "data-validate='itemMoment'",
    onSuccess: () => {
      AlgaehLoader({ show: true });
      $this.props.getItemMoment({
        uri: "/inventoryGlobal/getItemMoment",
        method: "GET",
        printInput: true,
        data: {
          from_location_id: $this.state.location_id,
          item_code_id: $this.state.item_id,
          from_date: moment($this.state.from_date).format(
            Options.dateFormatYear
          ),
          to_date: moment($this.state.to_date).format(Options.dateFormatYear)
        },
        redux: {
          type: "ITEM_MOMENT_DATA",
          mappingName: "insuranceitemmoment"
        },
        afterSuccess: data => {
          AlgaehLoader({ show: false });
        }
      });
    }
  });
};

export { changeTexts, dateFormater, datehandle, ProcessItemMoment };
