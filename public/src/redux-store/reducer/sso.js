import axios from '../axios'
import { commonAction } from '../config'

const initialState = {

}

export function ssoReducer(state = initialState, action) {
    switch (action.type) {
        case 'SSO_LIST':
            return Object.assign({}, state, { list: action.payload });
        default:
            return state
    }
}

export function ssoAction(store){
    return [commonAction(),{
        SSO_UPLOADFILE:function(data){
            console.log(data);

            // return axios.post('./api/sso/upload',data)
        }
    }]
}