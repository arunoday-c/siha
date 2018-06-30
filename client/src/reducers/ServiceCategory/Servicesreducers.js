export function ServicesDetails(state = { services: [] }, action) {
  switch (action.type) {
    case "SERVICES_GET_DATA":
      return Object.assign({}, { services: action.payload });
      break;
  }

  return state;
}
