export function PatVisitDetails(state = { visits: [] }, action) {
  switch (action.type) {
    case "VISIT_POST_DATA":
      if (state.visits.length) {
        return Object.assign({}, { visits: [...state.visits, action.payload] });
      } else {
        return Object.assign({}, { visits: [action.payload] });
      }
      break;
  }

  return state;
}
