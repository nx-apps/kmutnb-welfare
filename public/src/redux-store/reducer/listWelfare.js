import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    dataSelect: {}
}

export function listWelfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'LIST_WELFARE':
            return Object.assign({}, state, { list: action.payload });
        case 'LIST_WELFARE_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'CLEAR_DATA':
            return Object.assign({}, state, { select: {} });
        case 'DATA_WELFARE_SELECT':
            return Object.assign({}, state, { dataSelect: action.payload });
        default:
            return state
    }

}

export function listWelfareAction(store) {

    return [commonAction(),
    {
        LIST_WELFARE: function () {
            axios.get('/list_welfare')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'LIST_WELFARE', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_WELFARE_ID: function (data) {
            axios.get('/list_welfare/' + data)
                .then(function (result) {
                    // console.log(result);
                    store.dispatch({ type: 'LIST_WELFARE_ID', payload: result.data })
                })
                .catch(err => {

                })
        },
        INSERT_WELFARE: function (data) {
            // console.log(data);
            var datas = {
                budget: data.budget,
                year: data.year,
                condition: data.condition,
                start_date: new Date(data.start_date).toISOString(),
                end_date: new Date(data.end_date).toISOString(),
                name: data.name
            }
            // console.log(datas);
            this.fire('toast', { status: 'load' });
            axios.post(`./list_welfare/insert`, datas)
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
            axios.delete(`./list_welfare/delete/id/` + data)
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
                budget: data.budget,
                year: data.year,
                condition: data.condition,
                start_date: new Date(data.start_date).toISOString(),
                end_date: new Date(data.end_date).toISOString(),
                name: data.name
            }
            // console.log(datas);
            this.fire('toast', { status: 'load' });
            axios.put(`./list_welfare/update`, datas)
                .then((result) => {
                    console.log(result);
                    this.LIST_WELFARE();
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: function () {
                            console.log('success');
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        CLEAR_DATA: function () {
            store.dispatch({ type: 'CLEAR_DATA' });
        },
        DATA_WELFARE_SELECT: function (val) {
            // console.log(val);
            axios.get('/list_welfare/' + val)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'DATA_WELFARE_SELECT', payload: result.data })
                })
                .catch(err => {

                })
        }
    }
    ]

}
