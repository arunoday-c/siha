export function PatientTypeDetails(state = { patienttype: [] }, action) {
  switch (action.type) {
    case "PATTYPE_GET_DATA":
      return Object.assign({}, { patienttype: action.payload });
      break;
  }

  return state;
}
