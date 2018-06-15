export function DepartmentDetails(state = { departments: [] }, action) {
  switch (action.type) {
    case "DEPTGET_DATA":
      return Object.assign({}, { departments: action.payload });
      break;
  }

  return state;
}

export function SubDepartmentDetails(state = { subdepartments: [] }, action) {
  switch (action.type) {
    case "SUBDEPGET_DATA":
      return Object.assign({}, { subdepartments: action.payload });
      break;
  }

  return state;
}

export function DepartmentsClinicalNon(state = { clndepartments: [] }, action) {
  switch (action.type) {
    case "SUBDEP_NCL_GET_DATA":
      return Object.assign({}, { clndepartments: action.payload });
      break;
  }

  return state;
}
