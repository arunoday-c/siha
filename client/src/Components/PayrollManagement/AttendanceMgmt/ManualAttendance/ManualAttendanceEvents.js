export default function ManualAttendanceEvents() {
  return {
    texthandle: ($this, e) => {
      debugger;
      let name = e.name || e.target.name;
      let value = e.value || e.target.value;

      $this.setState({
        [name]: value
      });
    }
  };
}
