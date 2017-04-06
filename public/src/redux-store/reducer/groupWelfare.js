import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    list_year: []
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
        default:
            return state
    }

}

export function groupWelfareAction(store) {

    return [commonAction(),
    {
        LIST_WELFARE: function (year) {
            // console.log(year);
            axios.get('/group/welfare/year/' + year)
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'LIST_WELFARE', payload: result.data })
                })
                .catch(err => {

                })
        },
        LIST_WELFARE_ID: function (data) {
            axios.get('/group/welfare/' + data)
                .then(function (result) {
                    // console.log(result);
                    store.dispatch({ type: 'LIST_WELFARE_ID', payload: result.data })
                })
                .catch(err => {

                })
        },
        INSERT_WELFARE: function (data) {
            // console.log(data);
            let {year, start_date, end_date, group_welfare_name, admin_use, description, onetime, status_approve} = data;
            let newData = {year, start_date, end_date, group_welfare_name, admin_use, description, onetime, status_approve};
            newData.start_date = new Date(newData.start_date).toISOString();
            newData.end_date = new Date(newData.end_date).toISOString();
            // console.log(newData);
            this.fire('toast', { status: 'load' });
            axios.post(`./group/welfare/insert`, newData)
                .then((result) => {
                    console.log(result);
                    this.LIST_WELFARE(data.year-543);
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            console.log('success');
                            this.clearData();
                            this.GET_YEAR();
                            this.fire('closePanel');
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        DELETE_WELFARE: function (data) {
            // console.log(data);
            var year = new Date().getFullYear();
            axios.delete(`./group/welfare/delete/id/` + data.id)
                .then((result) => {
                    console.log(result);
                    this.fire('toast', {
                        status: 'success', text: 'ลบสำเร็จ', callback: () => {
                            console.log('success');
                            this.$$('panel-right').close();
                            this.LIST_WELFARE(year);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        EDIT_WELFARE: function (data) {
            // console.log(data);
            let {id, year, start_date, end_date, group_welfare_name, admin_use, description, onetime} = data;
            let newData = {id, year, start_date, end_date, group_welfare_name, admin_use, description, onetime};
            newData.start_date = new Date(newData.start_date).toISOString();
            newData.end_date = new Date(newData.end_date).toISOString();
            // console.log(newData);
            this.fire('toast', { status: 'load' });
            axios.put(`./group/welfare/update`, newData)
                .then((result) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            this.LIST_WELFARE(newData.year-543);
                            console.log('success');
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        SELECT_DATA: function (val) {
            // console.log(val);
            axios.get('/group/welfare/' + val)
                .then(function (result) {
                    // console.log(result.data);
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
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                            this.LIST_WELFARE_ID(data.id);
                            console.log('success');
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        CLEAR_WELFARE:function(data){
            // console.log(data);
            store.dispatch({ type: 'CLEAR_WELFARE', payload: data })
        },
        CLEAR_WELFARE_ID:function(data){
            // console.log(data);
            store.dispatch({ type: 'CLEAR_WELFARE_ID', payload: [] })
        }
    }
    ]

}
