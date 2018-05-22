export function IDTypeDetails(state = { idtypes: [] }, action) {
  switch (action.type) {
      
    case "IDTYPE_GET_DATA":
    debugger;
      return Object.assign({}, { idtypes: action.payload });
      break;


  }

  return state;
}
