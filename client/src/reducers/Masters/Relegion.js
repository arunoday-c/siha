
export function RelegionDetails (state = { relegions:[] } , action) {
	switch(action.type) {		
	case "RELGE_GET_DATA":
		
		return Object.assign({}, state, { relegions: action.payload} );
		break;		
	}
	
	return state;   
}