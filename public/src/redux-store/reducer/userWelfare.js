import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    list_user: [],
    listSearch: [],
    welfare_employee: []
}

const clearDatawelfare = (data,callback)=>{
    
    let {emp_id,welfare_id,use_budget,status,year,group_id}=data;
    let newData={emp_id,welfare_id,use_budget,status,year,group_id};
    // console.log(data.date/use_welfare/update_use == '');
   
    newData.document_ids = new Array()    
    data.document_ids.map((file)=>{
        newData.document_ids.push(file)
    })
    
    if (data.date_use == '' || data.date_use == undefined) {
        newData.date_use = new Date().toISOString();
    } else {
        // console.log(data.date_use);
        newData.date_use = new Date (data.date_use).toISOString();
    }
    // console.log(newData);
        callback(newData)
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
        case 'LIST_EMPLOYEES_WELFARE':
            return Object.assign({}, state, { welfare_employee: action.payload });
        case 'EMPLOYEE_GET_WELFARES':
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
        LIST_USER_SERARCH: function (id) {
            this.userSearch = id;
            axios.get('./user_welfare/adminEmployee/' + id)
                .then((response) => {
                    //  console.log(JSON.stringify(response.data));
                    var newData = response.data.map((item) => {
                        item.check = false;
                        return item;
                    })
                    store.dispatch({ type: 'LIST_USER_SERARCH', payload: newData })
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        USER_INSERT: function (data) {
            this.fire('toast', { status: 'load' });
            axios.post('./user/use_welfare/', data)
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.LIST_USER_SERARCH(this.userSearch);
                        }
                    });
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        LIST_EMPLOYEE_WELFARE: function (data) {
            // console.log(data);
            axios.get('./user_welfare/welfaresEmployee/' + data)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'LIST_EMPLOYEE_WELFARE', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_EMPLOYEES_WELFARE: function (data) {
            // console.log(data);
            axios.get('./user/welfares/year/' + data.year + '/id/' + data.id)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'LIST_EMPLOYEES_WELFARE', payload: result.data })
                })
                .catch(err => {

                })
        },
        EMPLOYEE_GET_WELFARES(id, year = new Date().getFullYear()) {
            // console.log(id, year);
            // this.fire('toast', { status: 'load' });
            axios.get(`./user/welfares/year/${year}/id/${id}`)
                .then(res => {
                    // console.log(res)
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ',
                        callback: () => {
                            store.dispatch({ type: 'EMPLOYEE_GET_WELFARES', payload: res.data })
                            // if (!otherFunction)
                            //     this.$$('panel-right').open();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
            USER_USE_WELFARE(data){
            console.log(data);
            // clearDatawelfare(data,(newData)=>{
                
            //     this.fire('toast',{status:'load'});
            //     // newData.status = true;
            //         axios.post(`./user/use_welfare/`,newData)
            //         .then(res=>{
            //             this.USER_GET_WELFARES(newData.emp_id,true);
            //             this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
            //                 callback:()=>{
            //                     // this.$$('panel-right').close();
            //                     // this.$$('#welfare_budget').close()
            //                 }
            //             });
            //         })
            //         .catch(err=>{
            //             console.log(err);
            //         })
            //     })
            }
    }
    ]

    // ./user/use_welfare/

}
