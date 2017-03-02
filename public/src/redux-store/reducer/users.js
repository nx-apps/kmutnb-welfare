import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    lists:[],
    select:{},
    disabled:false
}
const clearData = (data,callback)=>{

    let {prefixname_id,name,surname,gender_id,start_work_date,birthday,type_employee_id,active_id,position_id,matier_id,academic_id,department_id,faculty_id,relation_id}=data;
    let newData={prefixname_id,name,surname,gender_id,start_work_date,birthday,type_employee_id,active_id,position_id,matier_id,academic_id,department_id,faculty_id,relation_id};
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
        case 'USER_BTN' :
            return Object.assign({},state,{disabled:action.payload});
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
                console.log(data)
                store.dispatch({type:'USER_BTN',payload:data})
            }
        }
    ]

}