import FormGroup from "../Wrapper/formGroup";
import Label from "../Wrapper/label";
import Selector from "../Wrapper/selector";
import DateHandler from "../Wrapper/datePicker";
import Options from "../Wrapper/optionButton";
import AutoComplete from "../Wrapper/autoComplete";
import DataGrid from "../Wrapper/grid";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "@material-ui/core/Modal";

import "hijri-date";

const AlgaehLabel = Label;
const AlagehFormGroup = FormGroup;
const AlgaehSelector = Selector;
const AlgaehDateHandler = DateHandler;
const AlgaehOptions = Options;
const AlagehAutoComplete = AutoComplete;
const AlgaehDataGrid = DataGrid;
const AlgaehConvertToHijri = date => {
  if (date != null && date != "") {
    let nowGreg = new Date(date);
    return nowGreg.toHijri();
  }
};
export {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehSelector,
  AlgaehDateHandler,
  AlgaehConvertToHijri,
  AlgaehOptions,
  AlagehAutoComplete,
  AlgaehDataGrid,
  Button,
  Tooltip,
  Modal
};
