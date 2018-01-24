import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    list_year: [],
    data_clone: []
}

export function groupWelfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'LIST_WELFARE':
            return Object.assign({}, state, { list: action.payload });
        case 'LIST_WELFARE_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'SELECT_DATA':
            return Object.assign({}, state, { select: action.payload });
        case 'GET_YEAR':
            return Object.assign({}, state, { list_year: action.payload });
        case 'CLEAR_WELFARE':
            return Object.assign({}, state, { select: action.payload });
        case 'CLEAR_WELFARE_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'CLONE_DATA':
            return Object.assign({}, state, { data_clone: action.payload });
        default:
            return state
    }

}

export function groupWelfareAction(store) {

    return [commonAction(),
    {
        LIST_WELFARE: function (year) {
            // console.log(year);
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/group/welfare/year/' + year)
                .then((result) => {
                    // console.log(result.data);
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'LIST_WELFARE', payload: result.data })
                        }
                    });
                })
                .catch(err => {

                })
        },
        LIST_WELFARE_ID: function (data) {
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/group/welfare/' + data)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'LIST_WELFARE_ID', payload: result.data })
                        }
                    });
                })
                .catch(err => {

                })
        },
        INSERT_WELFARE: function (data) {
            var yearNow = new Date().getFullYear();
            // console.log(data);
            let { year, start_date, end_date, cal_date, group_welfare_name, group_use, description, onetime_use, status_approve, type_continuous, voluntary_status, type_group } = data;
            let newData = { year, group_welfare_name, group_use, description, onetime_use, status_approve, type_continuous, voluntary_status, type_group };
            var tz = "T00:00:00+07:00";
            newData.start_date = data.start_date + tz;
            if (data.cal_date === null) {
                newData.cal_date = data.cal_date;
            } else {
                newData.cal_date = data.cal_date + tz;
            }
            if (data.end_date === null) {
                newData.end_date = data.end_date
            } else {
                newData.end_date = data.end_date + tz;
            }
            // console.log(newData);
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.post(`./group/welfare/insert`, newData)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this.LIST_WELFARE(yearNow);
                            this.selectYear = yearNow;
                            this.clearData();
                            this.GET_YEAR();
                            // this.fire('closePanel');
                            this.$$('welfare-panel').checked_tab('#tab2');
                            this.$$('welfare-panel').getGroupWelfareId(result.data.id[0]);
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        DELETE_WELFARE: function (data) {
            // console.log(data);
            var year = new Date().getFullYear();
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.delete(`./group/welfare/delete/id/` + data.id)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'ลบสำเร็จ', callback: () => {
                            // console.log('success');
                            this.$$('panel-right').close();
                            this.LIST_WELFARE(year);
                            this.selectYear = year;
                            this.GET_YEAR();
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        EDIT_WELFARE: function (data) {
            var yearNow = new Date().getFullYear();
            // console.log(data);
            let { id, year, start_date, end_date, cal_date, group_welfare_name, group_use, description, onetime_use, type_continuous, voluntary_status, type_group } = data;
            let newData = { id, year, group_welfare_name, group_use, description, onetime_use, type_continuous, voluntary_status, type_group };
            var tz = "T00:00:00+07:00";
            newData.start_date = data.start_date + tz;
            if (data.cal_date === null) {
                newData.cal_date = data.cal_date;
            } else {
                newData.cal_date = data.cal_date + tz;
            }
            if (data.end_date === null) {
                newData.end_date = data.end_date
            } else {
                newData.end_date = data.end_date + tz;
            }
            // console.log(newData);
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.put(`./group/welfare/update`, newData)
                .then((result) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            this.LIST_WELFARE(yearNow);
                            this.LIST_WELFARE_ID(data.id);
                            this.SELECT_DATA(data.id);
                            this.UPDATE_WELFARE(newData.id);
                            // console.log('success');
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        UPDATE_WELFARE: function (id) {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/group/welfare/' + id)
                .then((result) => {
                    // console.log(result.data);
                    var calDate = result.data.cal_date;
                    var data = result.data.welfare;
                    var typeGroup = result.data.type_group;
                    var con = result.data.type_continuous;
                    var one = result.data.onetime_use;
                    var tz = "T00:00:00+07:00";
                    for (var i = 0; i < data.length; i++) {
                        // console.log(data[i].condition);
                        if (typeGroup == 'general') {
                            if (con === true && one === true) {
                                data[i].round_use = true;
                            } else if (con === true && one === false) {
                                data[i].round_use = false;
                            } else if (con === false && one === true) {
                                data[i].round_use = true;
                            }
                        } else {
                            data[i].round_use = true;
                        }
                        var condition = data[i].condition;
                        var arr = [];
                        for (var j = 0; j < condition.length; j++) {
                            var data2 = condition[j];
                            var search = data2.field_name.search('date');
                            var search_age = data2.field_name.search('age');
                            if (search != -1) {
                                if (data2.logic_show.search(">") >= 0) {
                                    var d = calDate.split("-");
                                    data2.value = (parseInt(d[0]) - parseInt(data2.value_show)) + "-" + d[1] + "-" + d[2].split("T")[0] + tz;
                                    data2.logic = data2.logic_show.replace(">", "<");
                                } else if (data2.logic_show.search("<") >= 0) {
                                    var d = calDate.split("-");
                                    data2.value = (parseInt(d[0]) - parseInt(data2.value_show)) + "-" + d[1] + "-" + d[2].split("T")[0] + tz;
                                    data2.logic = data2.logic_show.replace("<", ">");
                                }
                            }
                            else if (search_age != -1) {
                                if (data2.logic_show.search(">") >= 0) {
                                    data2.value = parseInt(data2.value_show);
                                    data2.logic = data2.logic_show;
                                } else if (data.logic_show.search("<") >= 0) {
                                    data2.value = parseInt(data2.value_show);
                                    data2.logic = data2.logic_show;
                                }
                            }
                            else {
                                data2.value = data2.value_show;
                                data2.logic = data2.logic_show;
                            }
                            arr.push(data2);
                            // console.log(arr);
                        }
                        data[i].condition = arr;
                    }
                    // console.log(data);
                    var setWelfare = data.map((item) => {
                        let { budget, budget_emp, condition, group_id, id, round_use, welfare_name } = item;
                        let newitem = { budget, condition, group_id, id, round_use, welfare_name }
                        return newitem;
                    })
                    // console.log(setWelfare);
                    axios.put(`./group/welfare/updateGroup`, setWelfare)
                        .then((result) => {
                            // console.log(result);
                        })
                        .catch((err) => {
                            // console.log(err);
                        })
                })
                .catch(err => {

                })
        },
        SELECT_DATA: function (val) {
            // console.log(val);
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/group/welfare/' + val)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'SELECT_DATA', payload: result.data })
                })
                .catch(err => {

                })
        },
        GET_YEAR() {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/group/welfare/year')
                .then(function (result) {
                    // console.log(result.data);
                    result.data.map(el => {
                        el.yearThai = el.year + 543
                        return el
                    })
                    store.dispatch({ type: 'GET_YEAR', payload: result.data })
                })
                .catch(err => {

                })
        },
        APPROVE_WELFARE: function (data) {
            var yearNow = new Date().getFullYear();
            // console.log(data);
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.put(`./group/welfare/approve`, data)
                .then((result) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            this.LIST_WELFARE_ID(data.id);
                            this.SELECT_DATA(data.id);
                            this.LIST_WELFARE(yearNow);
                            // console.log('success');
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        CLEAR_WELFARE: function (data) {
            // console.log(data);
            store.dispatch({ type: 'CLEAR_WELFARE', payload: data })
        },
        CLEAR_WELFARE_ID: function (data) {
            // console.log(data);
            store.dispatch({ type: 'CLEAR_WELFARE_ID', payload: [] })
        },
        CLONE_DATA: function (year) {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/group/welfare/year/' + year)
                .then((result) => {
                    // console.log(result.data);
                    result.data.map((val) => {
                        return val.check = false
                    })
                    var data = result.data.filter((item) => {
                        return item.status_approve == true && item.year !== 9999
                    })
                    store.dispatch({ type: 'CLONE_DATA', payload: data })
                })
        },
        INSERT_CLONE_DATA: function (data) {
            // console.log(data);
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.post(`./group/welfare/clone`, data)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this._closeDialog();
                            this.LIST_WELFARE(data.year);
                            this.selectYear = data.year;
                            this.GET_YEAR();
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        }
    }
    ]

}
