export function Billreducers(state = { genbill: [] }, action) {
  switch (action.type) {
    case "BILL_GEN_GET_DATA":
      return Object.assign({}, { genbill: action.payload });
      break;

    case "BILL_GEN_INIT_DATA":
      return [];
      break;
  }

  return state;
}
