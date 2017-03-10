import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    list_user: [],
    listSearch:[],
    welfare_employee:[]
}

export function userWelfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'WELFARE_LIST_YEAR':
            return Object.assign({}, state, { list: action.payload });
        case 'WELFARE_LIST':
            return Object.assign({}, state, { list_id: action.payload });
        case 'LIST_USER':
            return Object.assign({}, state, { list_user: action.payload });
        case 'LIST_USER_SERARCH':
            return Object.assign({}, state, { listSearch: action.payload });
        case 'LIST_EMPLOYEE_WELFARE':
            return Object.assign({}, state, { welfare_employee: action.payload });
        default:
            return state
    }

}

export function userWelfareAction(store) {

    return [commonAction(),
    {
        WELFARE_LIST_YEAR: function () {
            axios.get('./user_welfare/groupYear')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST_YEAR', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LIST: function (data) {
            // console.log(data);
            axios.get('./user_welfare/groupByYear/year/' + data)
                .then(function (result) {
                    console.log(result.data);
                    // console.log(JSON.stringify(result.data));
                    store.dispatch({ type: 'WELFARE_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_USER: function (id) {
            // console.log(id);
            axios.get('./user/list')
                .then(function (result) {
                    // console.log(result.data);
                    // console.log(JSON.stringify(result.data));'
                    // console.log(JSON.stringify(newData));
                    // console.log(newData);
                    store.dispatch({ type: 'LIST_USER', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_USER_SERARCH:function(id){
            this.userSearch = id;
            axios.get('./user_welfare/adminEmployee/'+id)
            .then((response)=>{
                //  console.log(JSON.stringify(response.data));
                  var newData = response.data.map((item)=>{
                        item.check = false;
                        return item;
                    })
                 store.dispatch({ type:'LIST_USER_SERARCH', payload: newData })
            })
            .catch((error)=>{
                console.log('error');
                console.log(error);
            });
        },
         USER_INSERT:function(data){
            this.fire('toast',{status:'load'});
            axios.post('./user/use_welfare/',data)
            .then((response)=>{
                this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                  callback:()=>{
                       this.LIST_USER_SERARCH(this.userSearch);
                  }
                 });
            })
            .catch((error)=>{
                console.log('error');
                console.log(error);
            });
        },
        LIST_EMPLOYEE_WELFARE: function (data) {
            // console.log(data);
            axios.get('./user/welfares/year/'+data.year+'/id/' + data.id)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'LIST_EMPLOYEE_WELFARE', payload: result.data })
                })
                .catch(err => {

                })
        }   
    }
    ]
   
    // ./user/use_welfare/

}
