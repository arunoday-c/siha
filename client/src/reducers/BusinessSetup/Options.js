export function OptionsDetails (state = { options:[] } , action) {
	switch(action.type) {
	
	case "OPTGET_DATA":
		return Object.assign({}, { options: action.payload} );
		break;		
	}
	
	return state;   
}