export function PatRegistrationDetails(state = { patients: [] }, action) {
  switch (action.type) {
    case "PAT_GET_DATA":
      return Object.assign({}, { patients: [action.payload] });
      break;

    case "PAT_POST_DATA":
      if (state.patients.length) {
        return Object.assign(
          {},
          { patients: [...state.patients, action.payload] }
        );
      } else {
        return Object.assign({}, { patients: [action.payload] });
      }
      break;

    case "INIT_PAT_DATA":
      return [];
      break;
  }

  return state;
}
