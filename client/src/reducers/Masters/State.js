export function StatesDetails (state = { countrystates:[] } , action) {
	switch(action.type) {
	
	case "STATEGET_DATA":
		debugger;
		return Object.assign({}, state, { countrystates: action.payload} );
		break;		
	}
	
	return state;   
}