export function ServiceTypeDetails(state = { servicetype: [] }, action) {
  switch (action.type) {
    case "SERVIES_TYPES_GET_DATA":
      return Object.assign({}, { servicetype: action.payload });
      break;
  }

  return state;
}
