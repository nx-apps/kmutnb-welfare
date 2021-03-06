import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    lists: [],
    select: {},
    select_personal_id: {},
    select_welefares: {},
    select_use_welefares: { date_use: new Date().toISOString().split('T')[0] },
    disabled: true,
    insert_view: true,
    lisyUserFalse: [],
    lisyUserhistoryWelfare: [],
    listRvpFund: [],
    rvp_fund: []
}
const clearData = (data, callback) => {

    let { prefix_id, firstname, lastname, gender_id, type_employee_id, active_id, position_id, matier_id, academic_id, department_id, faculty_id, emp_no, personal_id,
        academic_name, active_name, gender_name, matier_name, position_name, prefix_name, department_name, type_employee_name, faculty_name, end_work_date, work_age, age } = data;
    let newData = {
        prefix_id, firstname, lastname, gender_id, type_employee_id, active_id, position_id, matier_id, academic_id, department_id, faculty_id, emp_no, personal_id,
        academic_name, active_name, gender_name, matier_name, position_name, prefix_name, department_name, type_employee_name, faculty_name, end_work_date, work_age, age
    };// newData.period = new Array();
    // data.period.map((tag)=>{
    //     newData.period.push({no:tag.no,quality:tag.quality});
    // });
    if (data.start_work_date !== undefined && data.start_work_date !== '') {
        newData.start_work_date = data.start_work_date + 'T00:00:00.000+07:00'
        // 2017-06-09T04:44:06.162+00:00
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
        status, welfare_id, date_use, date_approve,type_group } = data;
    let newData = { budget_balance, budget_cover, budget_use, emp_id, group_id, description_detail, 
        status, welfare_id, date_use, date_approve,type_group };
    // console.log(data.date/use_welfare/update_use == '');

    newData.document_ids = new Array()
    data.document_ids.map((file) => {
        newData.document_ids.push(file)
    })
    // console.log(newData);
    callback(newData)
}
export function usersReducer(state = initialState, action) {

    switch (action.type) {
        case 'USERS_LIST':
            // console.log(1)
            return Object.assign({}, state, { lists: action.payload });
        case 'USER_SELECT':
            return Object.assign({}, state, { select: action.payload });
        case 'USER_SEARCH_PERSONAL_ID':
            return Object.assign({}, state, { select_personal_id: action.payload });
        case 'USER_GET_WELFARES':
            return Object.assign({}, state, { select_welefares: action.payload });
        case 'USER_BTN':
            return Object.assign({}, state, { disabled: action.payload });
        case 'USER_INSERT_VIEW':
            return Object.assign({}, state, { insert_view: action.payload });
        case 'USER_USE_SELETE_WELFARE':
            return Object.assign({}, state, { select_use_welefares: action.payload });
        case 'USERS_FALSE_LIST':
            return Object.assign({}, state, { lisyUserFalse: action.payload });
        case 'USERS_LIST_HISTORY_WELFARE':
            return Object.assign({}, state, { lisyUserhistoryWelfare: action.payload });
        case 'USER_RVP_FUND_LIST':
            return Object.assign({}, state, { listRvpFund: action.payload });
        case 'USER_RVP_FUND':
            return Object.assign({}, state, { rvp_fund: action.payload });
        default:
            return state
    }

}

export function usersAction(store) {

    return [commonAction(),
    {
        USERS_LIST: function () {
            // console.log(1)
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('./employee/list')
                .then(res => {
                    console.log(res.data)
                    store.dispatch({ type: 'USERS_LIST', payload: res.data })
                })
                .catch(err => {

                })
        },
        USER_INSERT(data) {
            clearData(data, (newData) => {
                this.fire('toast', { status: 'load' });
                axios.defaults.headers.common['Authorization'] = localStorage.token
                axios.post(`./employee/insert`, newData)
                    .then(res => {
                        this.USERS_LIST();
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                this.$$('panel-right').close();
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        },
        USER_SEARCH_PERSONAL_ID: function (pid) {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get(`./employee/search/${pid}`)
                .then(res => {
                    // console.log(res.data)
                    // console.log(res.data.length);
                    // console.log(res.data.length > 0);
                    let newData = {}
                    if (res.data) {
                        // newData = res.data[0]
                        store.dispatch({ type: 'USER_SEARCH_PERSONAL_ID', payload: res.data })
                    } else {
                        this.fire('toast', {
                            status: 'error', text: 'ไม่พบข้อมล',
                            callback: () => {
                                // this.$$('panel-right').close();
                                store.dispatch({ type: 'USER_SEARCH_PERSONAL_ID', payload: {} })
                            }
                        });
                    }

                    
                })
                .catch(err => {

                })
        },
        USER_SELECT: function (data) {
            store.dispatch({ type: 'USER_SELECT', payload: data })
        },
        USER_EDIT: function (data) {
            // console.log(data)
            this.fire('toast', { status: 'load' })
            clearData(data, (newData) => {
                this.fire('toast', { status: 'load' });
                newData.id = data.id
                // console.log(newData);
                axios.defaults.headers.common['Authorization'] = localStorage.token
                axios.put(`/employee/update`, newData)
                    .then(res => {
                        this.USER_GET_WELFARES(newData.id, true);
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                this.$$('panel-right').close();
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })


        },
        USER_DELETED: function (id) {
            // console.log(id)
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการลบข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        axios.defaults.headers.common['Authorization'] = localStorage.token
                        axios.delete(`./employee/delete/${id}`)
                            .then(res => {
                                this.USERS_LIST();
                                this.fire('toast', {
                                    status: 'success', text: 'ลบข้อมูลสำเร็จ',
                                    callback: () => {
                                        this.$$('panel-right').close();
                                    }
                                });
                            })
                    }
                }
            })

        },
        USER_BTN(data) {
            // console.log(data)
            store.dispatch({ type: 'USER_BTN', payload: data })
        },
        USER_INSERT_VIEW(data) {
            // console.log(data)
            store.dispatch({ type: 'USER_INSERT_VIEW', payload: data })
        },
        USER_GET_WELFARES(id, otherFunction = false) {
            // console.log('otherFunctioncdddd', year)
            // console.log(typeof id );
            if (typeof id !== 'undefined' && id !== 'undefined' && id !== '') {
                this.fire('toast', { status: 'load' });
                axios.defaults.headers.common['Authorization'] = localStorage.token
                axios.get(`./employee/${id}`)
                    .then(res => {
                        // console.log(res)
                        this.fire('toast', {
                            status: 'success', text: 'โหลดข้อมูลสำเร็จ',
                            callback: () => {
                                store.dispatch({ type: 'USER_GET_WELFARES', payload: res.data })
                                if (!otherFunction)
                                    this.$$('panel-right').open();
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }

        },
        USER_USE_WELFARE(data) {
            // console.log(data);
            clearDatawelfare(data, (newData) => {

                this.fire('toast', { status: 'load' });
                // newData.status = true;
                axios.defaults.headers.common['Authorization'] = localStorage.token
                axios.post(`./history/request/`, newData)
                    .then(res => {
                        this.USER_GET_WELFARES(newData.emp_id, true);
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
        USER_USE_WELFARE_APPROVE(data, url = () => { }) {
            // console.log(data);
            this.fire('toast', { status: 'load' });
            // let myFirstPromise = new Promise((resolve, reject) => {
            //     let newData = data.map((item) => {
            clearDatawelfare(data, (newData) => {
                //             item = newData
                //         })
                //         return item
                //     })
                //     resolve(newData)
                // });
                // myFirstPromise.then((data) => {
                //     // console.log(el);
                axios.defaults.headers.common['Authorization'] = localStorage.token
                axios.put(`./history/update/approve`, data)
                    .then(res => {
                        console.log(res.data);
                        // this.dispatchAction('USERS_FALSE_LIST');
                        this.fire('toast', {
                            status: 'success', text: 'บันทึกสำเร็จ',
                            callback: () => {
                                // console.log(url);
                                // url()
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })

        },
        USER_REJECT_USE_WELFARE(data, url = () => { }) {
            // clearDatawelfare(data, (newData) => {
            //     newData.id = data.id;
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            return axios.put(`./history/update/reject`, data)
                .then(res => {
                    // this.dispatchAction('USERS_FALSE_LIST');
                    // console.log(11111);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            url()
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
            // })
            // console.log(data);
            //  this.fire('toast',{
            //     status:'openDialog',
            //     text:'ต้องการลบข้อมูลใช่หรือไม่ ?',
            //     confirmed:(result)=>{
            //         if(result == true){
            //             axios.delete(`./employee/use_welfare/delete/id/${id}`)
            //             .then(res=>{
            //                 this.dispatchAction('USERS_FALSE_LIST');
            //                 this.fire('toast',{status:'success',text:'ลบข้อมูลสำเร็จ',
            //                     callback:()=>{
            //                         // this.$$('panel-right').close();
            //                     }
            //                 });
            //             })
            //         }
            //     }
            // })
        },
        USER_CANCEL_USE_WELFARE(data, url = () => { }) {
            // clearDatawelfare(data, (newData) => {
            //     newData.id = data.id;
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            return axios.put(`./history/update/cancel`, data)
                .then(res => {
                    // this.dispatchAction('USERS_FALSE_LIST');
                    // console.log(11111);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            // url()
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_USE_SELETE_WELFARE(data) {
            store.dispatch({ type: 'USER_USE_SELETE_WELFARE', payload: data })
        },
        USERS_FALSE_LIST(data = '') {
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get(`./history/unapprove?` + data)
                .then(res => {
                    // console.log(res)
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ',
                        callback: () => {
                            store.dispatch({ type: 'USERS_FALSE_LIST', payload: res.data })
                            // if(!otherFunction)
                            //     this.$$('panel-right').open();
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USERS_LIST_HISTORY_WELFARE(data = '') {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get(`./history/search?` + data)
                .then(res => {
                    // console.log(res)

                    store.dispatch({ type: 'USERS_LIST_HISTORY_WELFARE', payload: res.data })
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_RVP_FUND(pid) {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get(`./rvd/signup/pid/${pid}`)
                .then(res => {
                    // console.log(res)
                    store.dispatch({ type: 'USER_RVP_FUND', payload: res.data })
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_RVP_SIGNUP(data, pid) {
            this.fire('toast', { status: 'load' })
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.post(`./rvd/signup/`, data)
                .then(res => {
                    if (res.data.insert_status) {
                        // console.log(1);
                        this.fire('toast', {
                            status: 'success', text: 'สมัครสำเร็จ',
                            callback: () => {
                                this.dispatchAction('USER_RVP_FUND', pid);
                            }
                        });
                    } else {
                        // console.log(2);
                        this.fire('toast', {
                            status: 'error', text: 'ไม่สามารถสมัครได้',
                            callback: () => {
                            }
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                })

        },
        USER_RVP_LEAVE_FUND(fid, pid) {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.put(`./rvd/signup/leave/`, fid)
                .then(res => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.dispatchAction('USER_RVP_FUND', pid);
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        },
        USER_RVP_FUND_OUT(fid, pid) {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.put(`./rvd/signup/fund/out/`, fid)
                .then(res => {
                    console.log(res)
                    this.dispatchAction('USER_RVP_FUND', pid);
                })
                .catch(err => {
                    console.log(err);
                })

        },
    },

    ]

}