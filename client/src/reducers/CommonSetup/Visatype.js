export function VisatypeDetails(state = { visatypes: [] }, action) {
  switch (action.type) {
    case "VISA_GET_DATA":
      return Object.assign({}, { visatypes: action.payload });
      break;
  }

  return state;
}
