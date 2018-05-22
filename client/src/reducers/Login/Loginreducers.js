
export function TokenDetails (state = { tokensDtl:[] } , action) {
	switch(action.type) {
	
	case "GET_DATA":
		return Object.assign({}, { tokensDtl: action.payload} );
		break;		
	}
	
	return state;   
}