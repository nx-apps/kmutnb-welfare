 import axios from '../axios'
 import { commonAction } from '../config'
 const initialState = {
     data:{},
     dataList: []
 }
 export function fundRvdReducer(state = initialState, action) {
      switch (action.type) {
        case 'FUND_RVD_GET_LIST' :
            return Object.assign({},state,{dataList:action.payload});
        case 'FUND_RVD_SELECT':
            return Object.assign({},state,{data:action.payload});
        case 'FUND_RVD_CLEAR_DATA':
            return Object.assign({},state,{data:{}});
        default:
            return state
    }
}
 export function fundRvdAction(store) {
    return [commonAction(),
        {
            FUND_RVD_GET_LIST:function(){
                this.fire('toast',{status:'load'});
                axios.get('rvd')
                .then((response)=>{
                   this.fire('toast',{status:'success',
                     callback:()=>{
                         this.fundForm.resetComponents();
                         store.dispatch({ type: 'FUND_RVD_GET_LIST', payload: response.data })
                     }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_INSERT:function (data) {
                axios.post('./rvd/insert',data)
                .then((response)=>{
                    this.FUND_RVD_GET_LIST();
                    this.fundForm.editForm = false;
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_SELECT:function(id){
                axios.get('./rvd/id/'+id)
                .then((response)=>{
                    this.panelRight.open();
                    this.fundForm.resetComponents();
                    this.fundForm.editForm = true;
                    store.dispatch({ type: 'FUND_RVD_SELECT', payload: response.data })
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_DELETE:function(id) {
                axios.delete('/rvd/delete/id/'+id)
                .then((response)=>{
                    this.FUND_RVD_GET_LIST();
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_UPDATE:function (data) {
                axios.put('./rvd/update',data)
                .then((response)=>{
                    this.FUND_RVD_GET_LIST();
                    this.fundForm.editForm = true;
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_CLEAR_DATA:function(data){
                store.dispatch({ type: 'FUND_RVD_CLEAR_DATA' })
            }
        }
    ]
}