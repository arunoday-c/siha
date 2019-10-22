import moment from "moment";

const texthandle = ($this, row, context, e) => {
  let services_details = $this.state.services_details;
  let _index = services_details.indexOf(row);

  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  row[name] = value;
  row.requested_date = moment(new Date())._d;
  services_details[_index] = row;
  $this.setState({
    services_details: services_details
  });

  if (context !== null) {
    context.updateState({
      services_details: services_details
    });
  }
};

export { texthandle };
