export function CitiesDetails (state = { cities:[] } , action) {
	switch(action.type) {
	
	case "CITYGET_DATA":
	debugger;
		return Object.assign({}, state, { cities: action.payload} );
		break;		
	}
	
	return state;   
}