export function DepartmentDetails (state = { departments:[] } , action) {
	switch(action.type) {
	
	case "DEPTGET_DATA":
		return Object.assign({}, { departments: action.payload} );
		break;		
	}
	
	return state;   
}

export function SubDepartmentDetails (state = { subdepartments:[] } , action) {
	switch(action.type) {
	
	case "SUBDEPGET_DATA":
		return Object.assign({}, { subdepartments: action.payload} );
		break;		
	}
	
	return state;   
}