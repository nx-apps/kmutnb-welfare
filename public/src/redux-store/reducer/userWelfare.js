import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    list_user: [],
    list_history_welfare: [],
    list_history_fund: [],
    list_history_sso:[],
    listSearch: [],
    welfare_employee: [],
    select_use_welefares: {},
    faculty_list: []
}
const clearData = (data, callback) => {

    let { prefix_id, firstname, lastname, gender_id, type_employee_id, active_id, position_id, matier_id, academic_id, department_id, faculty_id, emp_no, personal_id,
        academic_name, active_name, gender_name, matier_name, position_name, prefix_name, department_name, type_employee_name, faculty_name, end_work_date, work_age, age,
        hospital,email,tel } = data;
    let newData = {
        prefix_id, firstname, lastname, gender_id, type_employee_id, active_id, position_id, matier_id, academic_id, department_id, faculty_id, emp_no, personal_id,
        academic_name, active_name, gender_name, matier_name, position_name, prefix_name, department_name, type_employee_name, faculty_name, end_work_date, work_age, age,
        hospital,email,tel
    };
    // newData.period = new Array();
    // data.period.map((tag)=>{
    //     newData.period.push({no:tag.no,quality:tag.quality});
    // });
    if (data.start_work_date !== undefined && data.start_work_date !== '') {
        // 2017-06-09T11:52:18.157+07:00
        newData.start_work_date = data.start_work_date + 'T00:00:00.000+07:00'
    } else {
        newData.start_work_date = data.start_work_date
    }
    if (data.end_work_date !== null && data.end_work_date !== '') {
        // log
        newData.end_work_date = data.end_work_date + 'T00:00:00.000+07:00'
    } else {
        newData.end_work_date = data.end_work_date
    }
    // console.log();
    newData.birthdate = data.birthdate + 'T00:00:00.000+07:00'
    callback(newData)
    // callback(data)
}
const clearDatawelfare = (data, callback) => {

    let { budget_balance, budget_cover, budget_use, emp_id, group_id, description_detail, 
        status, welfare_id, date_use, date_approve, personal_id,budget_emp,type_group } = data;
    let newData = { budget_balance, budget_cover, budget_use, emp_id, group_id, description_detail, 
        status, welfare_id, date_use, date_approve, personal_id,budget_emp,type_group };
    // console.log(data.date/use_welfare/update_use == '');

    newData.document_ids = new Array()
    data.document_ids.map((file) => {
        newData.document_ids.push(file)
    })
    // console.log(newData);
    callback(newData)
}
const changeTime = (data, timeZone, callback) => {
    let time
    data.map((item, index) => {
        for (var prop in item) {
            if (prop.indexOf('date') >= 0 && prop !== 'updater') {
                time = new Date(item[prop])
                // console.log(data[index][prop]);
                data[index][prop] = new Date(time.setHours(time.getHours() + timeZone)).toISOString()
                // console.log(new Date(data[index][prop]).toISOString());
            }
            // console.log(typeof item[prop] === 'object');
            if (typeof item[prop] === 'object')
                changeTime(item[prop], timeZone)
        }
    })
    callback(data)
}
export function userWelfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'WELFARE_LIST_YEAR':
            return Object.assign({}, state, { list: action.payload });
        case 'WELFARE_LIST':
            return Object.assign({}, state, { list_id: action.payload });
        case 'LIST_USER':
            return Object.assign({}, state, { list_user: action.payload });
        case 'EMPLOYEE_HISTORY_WELFARE':
            return Object.assign({}, state, { list_history_welfare: action.payload });
        case 'EMPLOYEE_HISTORY_FUND':
             return Object.assign({}, state, { list_history_fund: action.payload });
        case 'EMPLOYEE_HISTORY_SSO':
             return Object.assign({}, state, { list_history_sso: action.payload });
        case 'LIST_USER_SERARCH':
            return Object.assign({}, state, { listSearch: action.payload });
        case 'LIST_EMPLOYEE_WELFARE':
            return Object.assign({}, state, { welfare_employee: action.payload });
        case 'LIST_EMPLOYEES_WELFARE':
            return Object.assign({}, state, { welfare_employee: action.payload });
        case 'EMPLOYEE_GET_WELFARES':
            return Object.assign({}, state, { welfare_employee: action.payload });
        case 'EMPLOYEE_USE_SELETE_WELFARE':
            return Object.assign({}, state, { select_use_welefares: action.payload });
        case 'FACULTY_LIST':
            return Object.assign({}, state, { faculty_list: action.payload });
        case 'CLEAR_INSERT':
            return Object.assign({}, state, { welfare_employee: action.payload });
        default:
            return state
    }

}

export function userWelfareAction(store) {

    return [commonAction(),
    {
        WELFARE_LIST_YEAR: function () {
            axios.get('./group/welfare/year')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST_YEAR', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LISTS: function () {
            // console.log(data);
            axios.get('./welfare/active/')
                .then(function (result) {
                    result.data.map((item) => {
                        // console.log(item.group_use === true);
                        if (item.group_use === true) {
                            item.label = item.group_welfare_name + ' (แบบกลุ่ม)'
                        }else {
                            item.label = item.group_welfare_name
                        }
                    })
                    // console.log(JSON.stringify(result.data));
                    store.dispatch({ type: 'WELFARE_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_USER: function (id) {
            // console.log(id);
            axios.get('./employee/list/work')
                .then(function (result) {
                    // console.log(result.data);
                    var newData = result.data.map((item) => {
                        if (item.academic_name == "") {
                            item.fullName = item.prefix_name + " " + item.firstname + " " + item.lastname
                        }
                        else {
                            item.fullName = item.academic_name + " " + item.firstname + " " + item.lastname
                        }
                    })
                    store.dispatch({ type: 'LIST_USER', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_USER_SERARCH: function (id) {
            // console.log(id);
            this.userSearch = id;
            axios.get('./group/welfare/adminEmployee/' + id)
                .then((response) => {
                    //  console.log(JSON.stringify(response.data));
                    var newData = response.data.map((item) => {
                        if (item.academic_name == "") {
                            item.fullName = item.prefix_name + " " + item.firstname + " " + item.lastname
                        }
                        else {
                            item.fullName = item.academic_name + " " + item.firstname + " " + item.lastname
                        }
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
            axios.post('./history/request/', data)
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
            axios.get('./employee/' + data)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'LIST_EMPLOYEE_WELFARE', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_EMPLOYEES_WELFARE: function (data) {
            // console.log(data);
            axios.get('./employee/' + data)
                .then(function (result) {
                    // console.log(result.data);
                    // changeTime(result.date,+7,(data)=>{
                    //     console.log(data);
                    // })
                    // console.log(result.data);
                    store.dispatch({ type: 'LIST_EMPLOYEES_WELFARE', payload: result.data })
                })
                .catch(err => {

                })
        },
        EMPLOYEE_GET_WELFARES: function (id) {
            // console.log(year);
            axios.get('./employee/' + id)
                .then(res => {
                    console.log(2);
                    // console.log(res.data);
                    // store.dispatch({ type: 'EMPLOYEE_GET_WELFARES', payload: res.data })
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ',
                        callback: () => {
                            store.dispatch({ type: 'EMPLOYEE_GET_WELFARES', payload: res.data })
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        EMPLOYEE_USE_SELETE_WELFARE(data) {
            // console.log(data);
            store.dispatch({ type: 'EMPLOYEE_USE_SELETE_WELFARE', payload: data })
        },
        EMPLOYEE_USE_WELFARE(data) {
            // console.log(data);
            clearDatawelfare(data, (newData) => {
                // console.log(newData);
                this.fire('toast', { status: 'load' });
                axios.post(`./history/approve`, newData)
                    .then(res => {
                        this.EMPLOYEE_GET_WELFARES(newData.emp_id);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        },
        EMPLOYEE_USE_RVD(data) {
            // console.log(data);
            // clearDatawelfare(data, (newData) => {
                // console.log(newData);
                this.fire('toast', { status: 'load' });
                axios.post(`./history/rvd`, data)
                    .then(res => {
                        // this.EMPLOYEE_GET_WELFARES(data.emp_id);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            // })
        },
        EMPLOYEE_USE_REJECT_RVD(data) {
            // console.log(data);
            // clearDatawelfare(data, (newData) => {
                // console.log(newData);
                this.fire('toast', { status: 'load' });
                axios.put(`./history/rejectrvd`, data)
                    .then(res => {
                        console.log(data);
                        this.EMPLOYEE_GET_WELFARES(data.emp_id);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            // })
        },
        EMPLOYEE_USE_WELFARE_GROUP(data) {
            // console.log(data);
                this.fire('toast', { status: 'load' });
                axios.post(`./history/usegroup`, data)
                    .then(res => {
                        // this.EMPLOYEE_GET_WELFARES(newData.emp_id);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // this.$$('panel-right').close();
                                // this.$$('#welfare_budget').close()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
        },
        EMPLOYEE_HISTORY_WELFARE(data) {
                axios.get(`./history/list/welfare?`+ data)
                    .then(res => {
                        store.dispatch({ type: 'EMPLOYEE_HISTORY_WELFARE', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
        },
        EMPLOYEE_HISTORY_FUND(data) {
                axios.get(`./history/list/fund?`+ data)
                    .then(res => {
                        store.dispatch({ type: 'EMPLOYEE_HISTORY_FUND', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
        },
        EMPLOYEE_HISTORY_SSO(data) {
                axios.get(`./history/list/sso?`+ data)
                    .then(res => {
                        store.dispatch({ type: 'EMPLOYEE_HISTORY_SSO', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
        },
        FACULTY_LIST() {
            axios.get('./common/faculty')
                .then((response) => {
                    store.dispatch({ type: 'FACULTY_LIST', payload: response.data })
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        EMPLOYEE_UPDATE(data) {
            // console.log(data);
            this.fire('toast', { status: 'load' })
           return  clearData(data, (newData) => {
                // console.log(newData);
                // this.fire('toast', { status: 'load' });
                newData.id = data.id
                // console.log(newData);
                axios.put(`/employee/update`, newData)
                    .then(res => {
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                this.fire('back-page');
                                this.EMPLOYEE_GET_WELFARES(newData.id);
                                // this.LIST_EMPLOYEE_WELFARE(newData.id);
                                this.EMPLOYEE_USE_SELETE_WELFARE();
                                // this.LIST_USER();
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        },
        EMPLOYEE_UPDATE_RETIREMENT(data) {
            this.fire('toast', { status: 'load' })
            clearData(data, (newData) => {
                // console.log(newData);
                // this.fire('toast', { status: 'load' });
                newData.id = data.id
                // console.log(newData);
                axios.put(`/employee/update`, newData)
                    .then(res => {
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                console.log(111);
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        },
        EMPLOYEE_INSERT(data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการบันทึกข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        clearData(data, (newData) => {
                            console.log(newData);
                            axios.post('./employee/insert', newData)
                                .then(res => {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ',
                                        callback: () => {
                                            this.dispatchAction('USERS_LIST_HISTORY_WELFARE', '')
                                            this.fire('close-panel-right');
                                            // this.LIST_USER();
                                            // this.fire('back_page');
                                        }
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        })
                    }
                    else {
                        this.fire('back_page');
                    }
                }
            })
        },
        CLEAR_INSERT() {
            store.dispatch({ type: 'CLEAR_INSERT', payload: {} })
        }
    }
    ]

    // ./employee/use_welfare/

}
