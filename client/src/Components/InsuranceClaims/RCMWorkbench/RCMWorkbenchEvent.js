export function texthandle(e) {
  let name = e.target.name;
  let value = e.target.value;
  this.setState({
    [name]: value,
  });
}
