 import axios from '../axios'
 import { commonAction } from '../config'
 const initialState = {
     data:{},
     dataList: [],
     userList:[]
 }
 export function fundRvdReducer(state = initialState, action) {
      switch (action.type) {
        case 'FUND_RVD_GET_LIST' :
            return Object.assign({},state,{dataList:action.payload});
        case 'FUND_RVD_SELECT':
            return Object.assign({},state,{data:action.payload});
        case 'FUND_RVD_CLEAR_DATA':
            return Object.assign({},state,{data:{}});
        case 'FUND_RVD_GET_USER_LIST':
            return Object.assign({},state,{userList:action.payload});
        default:
            return state
    }
}
 export function fundRvdAction(store) {
    return [commonAction(),
        {
            FUND_RVD_GET_LIST:function(otheruser=false){
                this.fire('toast',{status:'load'});
                axios.get('rvd')
                .then((response)=>{
                   this.fire('toast',{status:'success',
                     callback:()=>{
                         if (!otheruser) 
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
            },
            FUND_RVD_GET_USER_LIST:function(){
                axios.get('./rvd/signup/list')
                .then((response)=>{
                    console.log(response.data);
                    var newData = response.data;
                    newData.map((item)=>{
                        if (item.academic_name == "") {
                            item.fullName = item.prefix_name + " " + item.firstname + " " + item.lastname
                        }
                        else {
                            item.fullName = item.academic_name + " " + item.firstname + " " + item.lastname
                        }
                        item.check = false;
                        return item;
                    })
                    store.dispatch({type:'FUND_RVD_GET_USER_LIST',payload:newData})
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_UPDATE_USER:function(id){
                this.fire('toast',{status:'load'});
                axios.put('./rvd/signup/update',id)
                .then((response)=>{
                   this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                     callback:()=>{
                          this.FUND_RVD_GET_USER_LIST()
                     }
                    });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_DELETE_USER:function(id){
                this.fire('toast',{status:'load'});
                axios.delete('./rvd/signup/delete/id/'+id)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          this.FUND_RVD_GET_USER_LIST()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            FUND_RVD_EXIT_FUND:function(data){
                this.fire('toast',{status:'load'});
                axios.put('./rvd/signup/leave/',data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          this.FUND_RVD_GET_USER_LIST()
                      }
                     });
                })
                .catch((error)=>{
                console.log('error');
                console.log(error);
                });
            },
            FUND_RVD_EXIT_WORK:function(data){
                this.fire('toast',{status:'load'});
                axios.put('rvd/signup/fund/out',data)
                .then((response)=>{
                     this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          this.FUND_RVD_GET_USER_LIST()
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            }
        }
    ]
}