import FormGroup from "./formGroup";
import Label from "./label";
// import Selector from "./selector";
import DateHandler from "./datePicker";
import AutoComplete from "./autoComplete";
import DataGrid from "./grid";
import AlgaehSearch from "./globalSearch";
import AlgaehModalPopUp from "./modulePopUp";
import algaehErrorBoundary from "./algaehErrorBoundary";
// import "hijri-date";

const AlgaehLabel = Label;
const AlagehFormGroup = FormGroup;
// const AlgaehSelector = Selector;
const AlgaehDateHandler = DateHandler;
const AlagehAutoComplete = AutoComplete;
const AlgaehDataGrid = DataGrid;
const AlgaehGlobalSearch = AlgaehSearch;
const AlgaehErrorBoundary = algaehErrorBoundary;

const AlgaehConvertToHijri = date => {
  if (date !== null && date !== "") {
    let nowGreg = new Date(date);
    return nowGreg.toHijri();
  }
};
export {
  AlgaehLabel,
  AlagehFormGroup,
  // AlgaehSelector,
  AlgaehDateHandler,
  AlgaehConvertToHijri,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehGlobalSearch,
  AlgaehModalPopUp,
  AlgaehErrorBoundary
};
