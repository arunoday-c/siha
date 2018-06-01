export function TitlesDetails (state = { titles:[] } , action) {
	
	switch(action.type) {
	
	case "TITLE_GET_DATA":
		
		return Object.assign({}, state, { titles: action.payload} );
		break;
	}
	
	return state;   
}