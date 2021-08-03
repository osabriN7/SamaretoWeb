import { GET_USER, UPLOAD_MODEL} from "../actions/user.actions";
const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USER:
            return action.payload
        case UPLOAD_MODEL:
            console.log("ok")
            return {
                ...state,
                modelsName: action.payload,
            }
        default:
            return state;
    }
}