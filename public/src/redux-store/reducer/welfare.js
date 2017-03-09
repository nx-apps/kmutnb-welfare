import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    dataSelect: {},
    list_year: []
}

export function welfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'LIST_WELFARE':
            return Object.assign({}, state, { list: action.payload });
        case 'LIST_WELFARE_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'DATA_WELFARE_SELECT':
            return Object.assign({}, state, { dataSelect: action.payload });
        case 'SELECT_DATA':
            return Object.assign({}, state, { select: action.payload });
        case 'GET_YEAR':
            return Object.assign({}, state, { list_year: action.payload });
        default:
            return state
    }

}

export function welfareAction(store) {

    return [commonAction(),
    {
        LIST_WELFARE: function (year) {
            console.log(year);
            // axios.get('/group_welfare/' + year)
            //     .then(function (result) {
            //         // console.log(result.data);
            //         store.dispatch({ type: 'LIST_WELFARE', payload: result.data })
            //     })
            //     .catch(err => {

            //     })
        },
        LIST_WELFARE_ID: function (data) {
            axios.get('/group_welfare/' + data)
                .then(function (result) {
                    // console.log([result]);
                    store.dispatch({ type: 'LIST_WELFARE_ID', payload: result.data })
                })
                .catch(err => {

                })
        },
        INSERT_WELFARE: function (data) {
            // console.log(data);
            var datas = {
                year: data.year,
                start_date: new Date(data.start_date).toISOString(),
                end_date: new Date(data.end_date).toISOString(),
                group_welfare_name: data.group_welfare_name
            }
            // console.log(datas);
            this.fire('toast', { status: 'load' });
            axios.post(`./group_welfare/insert`, datas)
                .then((result) => {
                    console.log(result);
                    this.LIST_WELFARE();
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            console.log('success');
                            this.clearData();
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        DELETE_WELFARE: function (data) {
            // console.log(data);
            axios.delete(`./group_welfare/delete/id/` + data)
                .then((result) => {
                    console.log(result);
                    this.LIST_WELFARE();
                    this.fire('toast', {
                        status: 'success', text: 'ลบสำเร็จ', callback: () => {
                            console.log('success');
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        EDIT_WELFARE: function (data) {
            // console.log(data);
            var datas = {
                id: data.id,
                year: data.year,
                start_date: new Date(data.start_date).toISOString(),
                end_date: new Date(data.end_date).toISOString(),
                name: data.name
            }
            // console.log(datas);
            this.fire('toast', { status: 'load' });
            axios.put(`./group_welfare/update`, datas)
                .then((result) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            this.LIST_WELFARE();
                            console.log('success');
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        DATA_WELFARE_SELECT: function (val) {
            // console.log(val);
            axios.get('/group_welfare/' + val)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'DATA_WELFARE_SELECT', payload: result.data })
                })
                .catch(err => {

                })
        },
        SELECT_DATA: function (val) {
            // console.log(val);
            axios.get('/group_welfare/' + val)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'SELECT_DATA', payload: result.data })
                })
                .catch(err => {

                })
        },
        GET_YEAR() {
            axios.get('/group_welfare/year')
                .then(function (result) {
                    store.dispatch({ type: 'GET_YEAR', payload: result.data })
                })
                .catch(err => {

                })
        }
    }
    ]

}
