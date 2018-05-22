
export function CountriesDetails (state = { countries:[] } , action) {
	switch(action.type) {
		
	
	case "CTRYGET_DATA":
		debugger;
		return Object.assign({}, state, { countries: action.payload} );
		break;		
	}
	
	return state;   
}