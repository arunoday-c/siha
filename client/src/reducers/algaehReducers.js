export function AlagehReducers(state, action) {
  state = state || { [action.mappingName]: [] };
  if (action.type.indexOf("ALGAEH_") > -1) {
    return Object.assign({}, state, { [action.mappingName]: action.payload });
  }
  return state;
}
