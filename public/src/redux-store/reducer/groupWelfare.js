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
            axios.get('/group/welfare/' + data)
                .then((result) => {
                    console.log(result);
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
            // console.log(data);
            let { year, start_date, end_date, cal_date, group_welfare_name, admin_use, description, onetime, status_approve } = data;
            let newData = { year, group_welfare_name, admin_use, description, onetime, status_approve };
            var tz = "T00:00:00+07:00";
            newData.start_date = data.start_date + tz;
            newData.end_date = data.end_date + tz;
            newData.cal_date = data.cal_date + tz;
            // console.log(newData);
            this.fire('toast', { status: 'load' });
            axios.post(`./group/welfare/insert`, newData)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this.LIST_WELFARE(data.year - 543);
                            this.selectYear = data.year;
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
            // var year = new Date().getFullYear();
            axios.delete(`./group/welfare/delete/id/` + data.id)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'ลบสำเร็จ', callback: () => {
                            // console.log('success');
                            this.$$('panel-right').close();
                            this.LIST_WELFARE(data.year - 543);
                            this.selectYear = data.year;
                            this.GET_YEAR();
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        EDIT_WELFARE: function (data) {
            // console.log(data);
            let { id, year, start_date, end_date, cal_date, group_welfare_name, admin_use, description, onetime } = data;
            let newData = { id, year, group_welfare_name, admin_use, description, onetime };
            var tz = "T00:00:00+07:00";
            newData.start_date = data.start_date + tz;
            newData.end_date = data.end_date + tz;
            newData.cal_date = data.cal_date + tz;
            // console.log(newData);
            this.fire('toast', { status: 'load' });
            axios.put(`./group/welfare/update`, newData)
            .then((result) => {
                this.fire('toast', {
                    status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                        this.LIST_WELFARE(newData.year - 543);
                        this.LIST_WELFARE_ID(data.id);
                        // console.log('success');
                    }
                });
            })
            .catch((err) => {
                // console.log(err);
            })

            axios.get('/group/welfare/' + newData.id)
                .then((result) => {
                    // console.log(result.data);
                    var data = result.data.welfare;
                    for(var i = 0; i < data.length; i++){
                        // console.log(data[i].condition);
                        var condition = data[i].condition;
                        var arr = [];
                        // var tz = "T00:00:00+07:00";
                        for(var j = 0; j < condition.length; j++){
                            var data2 = condition[j];
                            // console.log(data2);
                            var search = data2.field_name.search('date')
                            if (search != -1) {
                                if (data2.logic_show.search(">") >= 0) {
                                    var d = newData.cal_date.split("-");
                                    data2.value = (parseInt(d[0]) - parseInt(data2.value_show)) + "-" + d[1] + "-" + d[2].split("T")[0] + tz;
                                    data2.logic = data2.logic_show.replace(">", "<");
                                } else if (data2.logic_show.search("<") >= 0) {
                                    var d = newData.cal_date.split("-");
                                    data2.value = (parseInt(d[0]) - parseInt(data2.value_show)) + "-" + d[1] + "-" + d[2].split("T")[0] + tz;
                                    data2.logic = data2.logic_show.replace("<", ">");
                                }
                            }
                            else{
                                data2.value = data2.value_show;
                                data2.logic = data2.logic_show;
                            }
                            arr.push(data2);
                            // console.log(arr);
                        }
                        data[i].condition = arr;
                    }
                    var setWelfare = data.map((item) => {
                                        let {budget, condition, group_id, id, status, welfare_name} = item;
                                        let newitem = { budget, condition, group_id, id, status, welfare_name }
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
            axios.get('/group/welfare/' + val)
                .then(function (result) {
                    console.log(result.data);
                    store.dispatch({ type: 'SELECT_DATA', payload: result.data })
                })
                .catch(err => {

                })
        },
        GET_YEAR() {
            axios.get('/group/welfare/year')
                .then(function (result) {
                    store.dispatch({ type: 'GET_YEAR', payload: result.data })
                })
                .catch(err => {

                })
        },
        APPROVE_WELFARE: function (data) {
            // console.log(data);
            this.fire('toast', { status: 'load' });
            axios.put(`./group/welfare/approve`, data)
                .then((result) => {
                    // this.fire('toast', {
                    //     status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            this.LIST_WELFARE_ID(data.id);
                            this.SELECT_DATA(data.id);
                            this.LIST_WELFARE(data.year);
                            // console.log('success');
                    //     }
                    // });
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
        CLONE_DATA:function (year){
            // console.log(year);
            axios.get('/group/welfare/year/' + (year-543))
            .then((result) => {
                // console.log(result.data);
                result.data.map((val) => {
                    return val.check = false
                })
                var data = result.data.filter((item) => {
                    return item.status_approve == true
                })
                store.dispatch({ type: 'CLONE_DATA', payload: data })
            })
        },
        INSERT_CLONE_DATA:function(data){
            // console.log(data);
            this.fire('toast', { status: 'load' });
            axios.post(`./group/welfare/clone`, data)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this._closeDialog();
                            this.LIST_WELFARE(data.year);
                            this.selectYear = data.year+543;
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
