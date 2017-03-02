import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    select:{}
}

export function welfareReducer(state = initialState,action){

    switch (action.type) {
        case 'WELFARE_LIST':
            return Object.assign({},state,{list:action.payload});
        default:
            return state
    }

}

export function welfareAction(store){

    return [commonAction(),
        {
            WELFARE_LIST:function(){
                axios.get('/welfare')
                .then(function(result){
                    store.dispatch({type:'WELFARE_LIST',payload:result.data})
                })
                .catch(err=>{

                })
            }
        }
    ]

}