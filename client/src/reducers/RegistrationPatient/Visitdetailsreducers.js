
export function VisitDetails (state = { visitdetls:[] } , action) {    
    switch(action.type) {
    
    case "PREVIST_GET_DATA":
        return Object.assign({}, { visitdetls: [action.payload]} );
        break;
    }

    return state;
}