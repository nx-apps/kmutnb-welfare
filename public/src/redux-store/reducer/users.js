import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    lists:[],
    select:{}
}

export function usersReducer(state = initialState,action){

    switch (action.type) {
        case 'USERS_LIST':
        // console.log(1)
            return Object.assign({},state,{lists:action.payload});
        case 'USER_SELECT':
            return Object.assign({},state,{select:action.payload});
        default:
            return state
    }

}

export function usersAction(store){

    return [commonAction(),
        {
            USERS_LIST:function(){
                // console.log(1)
                axios.get('./user/list')
                .then(res=>{
                    console.log(res.data)
                    store.dispatch({type:'USERS_LIST',payload:res.data})
                })
                .catch(err=>{

                })
            },
            USER_INSERT(data){
                // his.insert('./user/insert',data, () => {
                //     this.fire('get-user-list');
                //     this.fire('_close-panel')
                //     console.log(1)
                // },(data) => {
                //     console.log(data)
                    
                //  });
                 this.fire('toast',{status:'load'});
                    axios.post(`./user/insert`,data)
                    .then(res=>{
                        this.USERS_LIST();
                        console.log(res)
                        this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                            callback:()=>{
                                this.$$('panel-right').close();
                            }
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            },
            USER_SELECT:function(data){
                
               store.dispatch({type:'USER_SELECT',payload:data})
                // console.log(id);
            }
        }
    ]

}