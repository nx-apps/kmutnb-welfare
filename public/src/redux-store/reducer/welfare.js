import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    dataSelect: {
        condition: []
    },
    condition: [],
    employees: []
}

export function welfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'WELFARE_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'WELFARE_LIST_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'WELFARE_DATA_SELECT':
            return Object.assign({}, state, { dataSelect: action.payload });
        case 'CONDITION_LIST':
            return Object.assign({}, state, { condition: action.payload });
        case 'WELFARE_LIST_EMPLOYEE':
            return Object.assign({}, state, { employees: action.payload });
        default:
            return state
    }

}

export function welfareAction(store) {

    return [commonAction(),
    {
        WELFARE_LIST: function () {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/welfare')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        // WELFARE_LIST_ID: function (data) {
        //     axios.get('/welfare/' + data)
        //         .then(function (result) {
        //             // console.log('*', result.data);
        //             store.dispatch({ type: 'WELFARE_LIST_ID', payload: result.data })
        //         })
        //         .catch(err => {

        //         })
        // },
        WELFARE_INSERT: function (data) {
            // console.log(data);
            var year = new Date().getFullYear();
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.post(`./welfare/insert`, data)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this.LIST_WELFARE_ID(data.group_id);
                            this.fire('refresh_group', year);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        WELFARE_DELETE: function (data) {
            // console.log(data);
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.delete(`./welfare/delete/id/` + data.id)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'ลบสำเร็จ', callback: () => {
                            // console.log('success');
                            this.LIST_WELFARE_ID(data.group_id);
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        WELFARE_EDIT: function (data) {
            // console.log(data);
            var year = new Date().getFullYear();
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.put(`./welfare/update`, data)
                .then((result) => {
                    // console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            // console.log('success');
                            this.WELFARE_DATA_SELECT(data.id);
                            this.LIST_WELFARE_ID(data.group_id);
                            this.fire('refresh_group', year);
                        }
                    });
                })
                .catch((err) => {
                    // console.log(err);
                })
        },
        WELFARE_DATA_SELECT: function (val) {
            this.WELFARE_DATA_SELECT_CLEAR();
            // this.id = val
            // console.log(store.getState().welfare.condition);
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/welfare/' + val)
                .then(function (result) {
                    // console.log(result.data);
                    // console.log("*",result.data);
                    var data = result.data.condition;
                    var condition = store.getState().welfare.condition;

                    var use = data.map((item) => {
                        return item.field
                    })
                    // console.log(use);

                    var diff = condition.filter((item) => {
                        return use.indexOf(item.id) < 0;
                    })
                    // console.log(diff);

                    for (var i in data) {
                        for (var j in condition) {
                            if (condition[j].id == data[i].field) {
                                data[i].field = condition[j]
                            }
                        }
                        var a = [];
                        for (var j in diff) {
                            a.push(diff[j]);
                        }
                        a.push(data[i].field);
                        // console.log(a);
                        data[i].itemField = a;
                        // this.set('data.condition.' + i + '.itemField', a);
                    }
                    // console.log(result.data);

                    store.dispatch({ type: 'WELFARE_DATA_SELECT', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_DATA_SELECT_CLEAR: function () {
            store.dispatch({ type: 'WELFARE_DATA_SELECT', payload: { condition: [] } })
        },
        CONDITION_LIST: function () {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/conditions/list')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'CONDITION_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LIST_EMPLOYEE: function (id) {
            // console.log(id);
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/welfare/employee/' + id)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST_EMPLOYEE', payload: result.data })
                })
                .catch(err => {

                })
        }
    }
    ]

}
