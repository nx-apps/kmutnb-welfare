 import axios from '../axios'
 import { commonAction } from '../config'
 const initialState = {
    data:{},
    dataList:[]
 }
 export function fundTypeReducer(state = initialState, action) {
      switch (action.type) {
        case 'FUND_TYPE_INSERT':
            return Object.assign({},state,{data:action.payload});
        case 'FUND_TYPE_GET_DATA_LIST':
            return Object.assign({},state,{dataList:action.payload});
        case 'FUND_TYPE_SELECT_DATA':
            return Object.assign({},state,{data:action.payload});
        case 'FUND_TYPE_CLEAR_DATA':
            return Object.assign({},state,{data:{
                admin_use: false,
                onetime:false
            }});   
        default:
            return state
    }
}
 export function fundTypeAction(store) {
    return [commonAction(),
        {
            FUND_TYPE_INSERT:function(data) {
                this.fire('toast',{status:'load'});
                axios.post('./fund_type/insert',data)
                .then((response)=>{
                    console.log('success!!');
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          this.FUND_TYPE_GET_DATA_LIST();
                      }
                     });
                    console.log(response.data);
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_TYPE_UPDATE:function(data) {
                this.fire('toast',{status:'load'});
                axios.put('./fund_type/update',data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                        this.$$('fund-manage').reset();
                        this.FUND_TYPE_GET_DATA_LIST();
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
           FUND_TYPE_GET_DATA_LIST:function(){
               axios.get('./fund_type/')
               .then((response)=>{
                   store.dispatch({type:'FUND_TYPE_GET_DATA_LIST',payload: response.data});
               })
               .catch((error)=>{
                    console.log('error');
                    console.log(error);
               });
           },
           FUND_TYPE_SELECT_DATA:function(id){
                axios.get('./fund_type/id/'+id)
                .then((response)=>{
                    this.$$('fund-manage').reset();
                     store.dispatch({type:'FUND_TYPE_SELECT_DATA',payload:response.data});
                })
                .catch((error)=>{
                console.log('error');
                console.log(error);
                });
           },
           FUND_TYPE_DELETE:function(id){
            this.fire('toast',{status:'load'});
            axios.delete('./fund_type/delete/id/'+id)
            .then((response)=>{
               this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                 callback:()=>{
                    this.$$('panel-right').close();
                 }
                });
            })
            .catch((error)=>{
                console.log('error');
                console.log(error);
            });
           },
           FUND_TYPE_CLEAR_DATA:function(){
                // this.$$('fund-manage').reset();
                store.dispatch({type:'FUND_TYPE_CLEAR_DATA'});
           }    
        }
    ]
}