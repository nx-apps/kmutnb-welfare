import axios from '../axios'
import {commonAction} from '../config'

const initialState = {
    list:[],
    select:{},
    academic:{},
    active:{},
    department:{},
    employee:{},
    faculty:{},
    gender:{},
    matier:{},
    position:{},
    prefixname:{},
    relation:{},
    type_employee:{},
}

export function commonDataReducer(state = initialState,action){

    switch (action.type) {
        case 'COMMONDATA_LIST':
            return Object.assign({},state,{list:action.payload});
        case 'COMMONDATA_SELECT':
            return Object.assign({},state,{select:action.payload});
        case  'COMMONDATA_DATA_ACADEMIC':
            return Object.assign({},state,{academic:action.payload});
        case  'COMMONDATA_DATA_DEPARTMENT':
            return Object.assign({},state,{active:action.payload});
        case  'COMMONDATA_DATA_ACTIVE':
            return Object.assign({},state,{department:action.payload});
        case  'COMMONDATA_DATA_EMPLOYEE':
            return Object.assign({},state,{employee:action.payload});
        case  'COMMONDATA_DATA_FACULTY':
            return Object.assign({},state,{faculty:action.payload});
        case  'COMMONDATA_DATA_GENDER':
            return Object.assign({},state,{gender:action.payload});
        case  'COMMONDATA_DATA_MATIER':
            return Object.assign({},state,{matier:action.payload});
        case  'COMMONDATA_DATA_POSITION':
            return Object.assign({},state,{position:action.payload});
        case  'COMMONDATA_DATA_PREFIXNAME':
            return Object.assign({},state,{prefixname:action.payload});
        case  'COMMONDATA_DATA_RELATION':
            return Object.assign({},state,{relation:action.payload});
        case 'COMMONDATA_DATA_TYPE_EMPLOYEE':
            return Object.assign({},state,{type_employee:action.payload});
        default:
            return state
    }

}

export function commonDataAction(store){

    return [commonAction(),
        {
            COMMONDATA_LIST:function(){
                console.log(1)
                // axios.get('/providers')
                // .then(res=>{
                //     store.dispatch({type:'COMMONDATA_LIST',payload:res.data})
                // })
                // .catch(err=>{

                // })
            },
            COMMONDATA_DATA_ACADEMIC:function(){
                // this.read('./common/academic',(data)=>{
                //     this.set('dataSelete.academic',data)
                // });
                axios.get(`/common/academic`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_ACADEMIC',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
                
            },
            COMMONDATA_DATA_ACTIVE:function(id){
                // this.read('./common/active',(data)=>{
                //     this.set('dataSelete.active',data)
                // });
                
                axios.get(`/common/active`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_ACTIVE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_DEPARTMENT:function(id){
                // this.read('./common/department',(data)=>{
                //     this.set('dataSelete.department',data)
                // });
                
                axios.get(`/common/department`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_DEPARTMENT',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_EMPLOYEE:function(id){
                // this.read('./common/employee',(data)=>{
                //     this.set('dataSelete.employee',data)
                // });
                
                axios.get(`/common/employee`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_EMPLOYEE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_FACULTY:function(id){
                // this.read('./common/faculty',(data)=>{
                //     this.set('dataSelete.faculty',data)
                // });
                
                axios.get(`/common/faculty`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_FACULTY',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_GENDER:function(id){
                // this.read('./common/gender',(data)=>{
                //     this.set('dataSelete.gender',data)
                // });
                
                axios.get(`/common/gender`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_GENDER',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_MATIER:function(id){
                // this.read('./common/matier',(data)=>{
                //     this.set('dataSelete.matier',data)
                // });
                
                axios.get(`/common/matier`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_MATIER',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_POSITION:function(id){
                // this.read('./common/position',(data)=>{
                //     this.set('dataSelete.position',data)
                // });
                
                axios.get(`/common/position`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_POSITION',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_PREFIXNAME:function(id){
                // this.read('./common/prefixname',(data)=>{
                //     this.set('dataSelete.prefixname',data)
                // });
                
                axios.get(`/common/prefixname`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_PREFIXNAME',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_RELATION:function(id){
                // this.read('./common/relation',(data)=>{
                //     this.set('dataSelete.relation',data)
                // });
                
                axios.get(`/common/relation`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_RELATION',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
            },
            COMMONDATA_DATA_TYPE_EMPLOYEE:function(id){
                // this.read('./common/type_employee',(data)=>{
                //     this.set('dataSelete.type_employee',data)
                //     // console.log(this.dataSelete)
                // });
                axios.get(`/common/type_employee`)
                .then(res=>{
                    store.dispatch({type:'COMMONDATA_DATA_TYPE_EMPLOYEE',payload:res.data})
                })
                .catch(err=>{
                    console.log(err)
                })
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