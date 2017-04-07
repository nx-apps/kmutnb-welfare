import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    module:[],
    date:{}
}

export function dateDbReducer(state = initialState,action){
    switch (action.type) {
        case 'GET_DATE':
            return Object.assign({},state,{date:action.payload});
        default:
            return state;
    }
}

export function dateDbAction(store){
    return [
        commonAction(),{
            GET_DATE:function(data){
                // var user = store.getState().auth.user;
                axios.get('/date/currentdate')
                .then(res=>{
                    store.dispatch({type:'GET_DATE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    ]
}