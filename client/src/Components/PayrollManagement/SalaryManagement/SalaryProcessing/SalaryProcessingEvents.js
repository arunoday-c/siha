import Enumerable from "linq";
// import { swalMessage, algaehApiCall } from "../../../../utils/algaehApiCall.js";
// import AlgaehSearch from "../../../Wrapper/globalSearch";
// import spotlightSearch from "../../../../Search/spotlightSearch.json";
// import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
// import EmployeePaymentIOputs from "../../../../Models/EmployeePayment";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const DeptselectedHandeler = ($this, e) => {
  let dept = Enumerable.from($this.props.deptanddoctors.departmets)
    .where(w => w.sub_department_id === e.value)
    .firstOrDefault();

  $this.setState({
    [e.name]: e.value,
    department_id: e.selected.department_id,
    department_type: e.selected.department_type,
    doctors: dept.doctors
  });
};

export { texthandle, DeptselectedHandeler };
