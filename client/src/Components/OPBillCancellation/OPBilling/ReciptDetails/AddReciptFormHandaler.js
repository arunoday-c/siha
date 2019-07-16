import { algaehApiCall, getCookie } from "../../../../utils/algaehApiCall";

const texthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name;
  let value;
  if (e.name != null) {
    name = e.name;
    value = e.value;
  } else {
    name = e.target.name;
    value = e.target.value;
  }

  $this.setState({
    [name]: value
  });

  if (context !== null) {
    context.updateState({ [name]: value });
  }
};

const countertexthandle = ($this, context, ctrl, e) => {
  e = e || ctrl;
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState(
    {
      [name]: value
    },
    () => {
      let _screenName = getCookie("ScreenName").replace("/", "");
      algaehApiCall({
        uri: "/userPreferences/save",
        data: {
          screenName: _screenName,
          identifier: "Counter",
          value: value
        },
        method: "POST"
      });
    }
  );
  if (context !== undefined) {
    context.updateState({ [name]: value });
  }
};

const textAreaEvent = ($this, context, e) => {
  let name = e.name || e.target.name;
  let value = e.value || e.target.value;

  $this.setState({
    [name]: value
  });
  if (context !== undefined) {
    context.updateState({ [name]: value });
  }
};

export { texthandle, countertexthandle, textAreaEvent };
