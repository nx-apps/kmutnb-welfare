import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    module:[],
    date:{},
    listYear:{}
}

export function dateDbReducer(state = initialState,action){
    switch (action.type) {
        case 'GET_DATE':
            return Object.assign({},state,{date:action.payload});
        case 'GET_LIST_YEAR':
            return Object.assign({},state,{listYear:action.payload});
        default:
            return state;
    }
}

export function dateDbAction(store){
    return [
        commonAction(),{
            GET_DATE:function(data){
                // var user = store.getState().auth.user;
                axios.defaults.headers.common['Authorization'] = localStorage.token
                axios.get('/date/currentdate')
                .then(res=>{
                    store.dispatch({type:'GET_DATE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            },
            GET_LIST_YEAR:function(data){
                // var user = store.getState().auth.user;
                axios.defaults.headers.common['Authorization'] = localStorage.token
                axios.get('/date/listyear')
                .then(res=>{
                    store.dispatch({type:'GET_LIST_YEAR',payload:res.data})
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
    ]
}