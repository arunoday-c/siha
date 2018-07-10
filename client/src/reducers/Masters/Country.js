export function CountriesDetails(state = { countries: [] }, action) {
  switch (action.type) {
    case "CTRY_GET_DATA":
      return Object.assign({}, state, { countries: action.payload });
      break;
  }

  return state;
}
