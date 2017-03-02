import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    select:{}
}

export function usersReducer(state = initialState,action){

    switch (action.type) {
        case 'USERS_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'USERS_SELECT':
            return Object.assign({},state,{select:action.payload});
        default:
            return state
    }

}

export function usersAction(store){

    return [commonAction(),
        {
            USERS_LIST:function(){
                console.log(1)
                // axios.get('/providers')
                // .then(res=>{
                //     store.dispatch({type:'COMMONDATA_LIST',payload:res.data})
                // })
                // .catch(err=>{

                // })
            },
            // COMMONDATA_SELECT:function(id){
            //     axios.get(`/providers/provider/${id}`)
            //     .then(res=>{
            //         store.dispatch({type:'COMMONDATA_SELECT',payload:res.data})
            //     })
            //     .catch(err=>{

            //     })
            //     console.log(id);
            // }
        }
    ]

}