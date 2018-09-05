import moment from "moment";
import Enumerable from "linq";

const texthandle = ($this, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
};

const examhandle = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  let exam_start_date_time = null;
  let exam_end_date_time = null;
  let report_type = "NS";
  if (value === "ST") {
    exam_start_date_time = moment(new Date())._d;
  } else if (value === "CO") {
    exam_start_date_time =
      $this.state.exam_start_date_time || moment(new Date())._d;
    exam_end_date_time = moment(new Date())._d;
    report_type = "PR";
  }
  $this.setState({
    [name]: value,
    exam_start_date_time: exam_start_date_time,
    exam_end_date_time: exam_end_date_time,
    report_type: report_type
  });
};

const templatehandle = ($this, e) => {
  debugger;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;
  debugger;
  $this.setState({
    [name]: value,
    template_html: e.selected.template_html
  });
};

const rtehandle = ($this, template_html) => {
  $this.setState({ template_html });
};

export { texthandle, examhandle, templatehandle, rtehandle };
