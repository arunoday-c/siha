export function VisittypeDetails (state = { visittypes:[] } , action) {
	switch(action.type) {
	
	case "VISITTYPE_GET_DATA":
		return Object.assign({}, { visittypes: action.payload} );
		break;
	}
	return state;
}