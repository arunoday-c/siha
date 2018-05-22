
export function NationalityDetails (state = { nationalities:[] } , action) {
	switch(action.type) {		
	case "NAT_GET_DATA":
		debugger;
		return Object.assign({}, state, { nationalities: action.payload} );
		break;		
	}
	
	return state;   
}