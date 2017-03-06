import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    lists:[],
    select:{},
    select_welefares:{},
    disabled:true,
    insert_view:true
}
const clearData = (data,callback)=>{

    let {prefixname_id,name,surname,gender_id,start_work_date,birthday,type_employee_id,active_id,position_id,matier_id,academic_id,department_id,faculty_id,relation_id,emp_id,personal_id}=data;
    let newData={prefixname_id,name,surname,gender_id,start_work_date,birthday,type_employee_id,active_id,position_id,matier_id,academic_id,department_id,faculty_id,relation_id,emp_id,personal_id};
    // newData.period = new Array();
    // data.period.map((tag)=>{
    //     newData.period.push({no:tag.no,quality:tag.quality});
    // });
        callback(newData)
    // callback(data)
}
export function usersReducer(state = initialState,action){

    switch (action.type) {
        case 'USERS_LIST':
        // console.log(1)
            return Object.assign({},state,{lists:action.payload});
        case 'USER_SELECT':
            return Object.assign({},state,{select:action.payload});
        case 'USER_GET_WELFARES':
            return Object.assign({},state,{select_welefares:action.payload});
        case 'USER_BTN' :
            return Object.assign({},state,{disabled:action.payload});
        case 'USER_INSERT_VIEW' : 
            return Object.assign({},state,{insert_view:action.payload});
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
                clearData(data,(newData)=>{
                 this.fire('toast',{status:'load'});
                    axios.post(`./user/insert`,newData)
                    .then(res=>{
                        this.USERS_LIST();
                        this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                            callback:()=>{
                                this.$$('panel-right').close();
                            }
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                    })
            },
            USER_SELECT:function(data){
               store.dispatch({type:'USER_SELECT',payload:data})
            },
            USER_EDIT:function(data){
                console.log(data)
                clearData(data,(newData)=>{
                    this.fire('toast',{status:'load'});
                    newData.id = data.id
                    axios.put(`/user/update`,newData)
                    .then(res=>{
                        this.USERS_LIST();
                        this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                            callback:()=>{
                                this.$$('panel-right').close();
                            }
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                })
            
            },
            USER_DELETED:function(id){
                console.log(id)
                axios.delete(`./user/delete/${id}`)
                .then(res=>{
                    this.USERS_LIST();
                    this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
                        callback:()=>{
                            this.$$('panel-right').close();
                        }
                    });
                })
            },
            USER_BTN(data){
                // console.log(data)
                store.dispatch({type:'USER_BTN',payload:data})
            },
            USER_INSERT_VIEW(data){
                // console.log(data)
                store.dispatch({type:'USER_INSERT_VIEW',payload:data})
            },
            USER_GET_WELFARES(id){
                console.log(0)
                 this.fire('toast',{status:'load'});
                    axios.get(`./user/welfares/id/${id}`)
                    .then(res=>{
                        console.log(res)
                        this.fire('toast',{status:'success',text:'โหลดข้อมูลสำเร็จ',
                            callback:()=>{
                                store.dispatch({type:'USER_GET_WELFARES',payload:res.data})
                                this.$$('panel-right').open();
                            }
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                    // })
            },
        }
    ]

}