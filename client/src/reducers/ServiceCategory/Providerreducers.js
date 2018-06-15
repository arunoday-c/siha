export function ProviderDetails(state = { providers: [] }, action) {
  switch (action.type) {
    case "DOCT_GET_DATA":
      return Object.assign({}, { providers: action.payload });
      break;
  }

  return state;
}
