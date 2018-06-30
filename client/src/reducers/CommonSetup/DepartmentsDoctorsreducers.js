export function DepartmentsandDoctors(state = { deptanddoctors: [] }, action) {
  switch (action.type) {
    case "DEPT_DOCTOR_GET_DATA":
      return Object.assign({}, { deptanddoctors: action.payload });
      break;
  }

  return state;
}
