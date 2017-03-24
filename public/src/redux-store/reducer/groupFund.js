 import axios from '../axios'
 import { commonAction } from '../config'
 const initialState = {
    year:[],
    data:{},
    dataList:[],
 }
 export function groupFundReducer(state = initialState, action) {
      switch (action.type) {
        case 'GROUP_FUND_GET_YEAR':
            return Object.assign({},state,{year:action.payload});
        case 'GROUP_FUND_INSERT':
            return Object.assign({},state,{data:action.payload});
        case 'GROUP_FUND_GET_DATA_LIST':
            return Object.assign({},state,{dataList:action.payload});
        case 'GROUP_FUND_SELECT_DATA':
            return Object.assign({},state,{data:action.payload});
        case 'GROUP_FUND_CLEAR_DATA':
            return Object.assign({},state,{data:{
                admin_use: false,
                onetime:false
            }});   
        default:
            return state
    }
}
 export function groupFundAction(store) {
    return [commonAction(),
        {
            GROUP_FUND_INSERT:function(data) {
                this.fire('toast',{status:'load'});
                axios.post('./group/fund/insert',data)
                .then((response)=>{
                    console.log('success!!');
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                          this.GROUP_FUND_GET_DATA_LIST(this.selectYear);
                      }
                     });
                    console.log(response.data);
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            GROUP_FUND_UPDATE:function(data) {
                this.fire('toast',{status:'load'});
                axios.put('./group/fund/update',data)
                .then((response)=>{
                    this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                      callback:()=>{
                        this.$$('fund-manage').reset();
                        this.GROUP_FUND_GET_DATA_LIST(this.selectYear);
                      }
                     });
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
            GROUP_FUND_GET_YEAR:function() {
                axios.get('./group/fund/year')
                .then((response)=>{
                   this.selectYear = response.data[0].year;
                   store.dispatch({type:'GROUP_FUND_GET_YEAR',payload: response.data});
                })
                .catch((error)=>{
                    console.log('error');
                    console.log(error);
                });
            },
           GROUP_FUND_GET_DATA_LIST:function(year){
               console.log(year);
               if(typeof year == 'undefined' || year == ''){
                    year = this.selectYear;
               }    
               axios.get('./group/fund/year/'+year)
               .then((response)=>{
                   store.dispatch({type:'GROUP_FUND_GET_DATA_LIST',payload: response.data});
               })
               .catch((error)=>{
                    console.log('error');
                    console.log(error);
               });
           },
           GROUP_FUND_SELECT_DATA:function(id){
                axios.get('./group/fund/id/'+id)
                .then((response)=>{
                    this.$$('fund-manage').reset();
                     store.dispatch({type:'GROUP_FUND_SELECT_DATA',payload:response.data});
                })
                .catch((error)=>{
                console.log('error');
                console.log(error);
                });
           },
           GROUP_FUND_DELETE:function(id){
            this.fire('toast',{status:'load'});
            axios.delete('./group/fund/delete/id/'+id)
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
           GROUP_FUND_CLEAR_DATA:function(){
                // this.$$('fund-manage').reset();
                store.dispatch({type:'GROUP_FUND_CLEAR_DATA'});
           }    
        }
    ]
}