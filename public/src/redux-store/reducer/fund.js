import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    data: {},
    dataList: []
}
export function fundReducer(state = initialState, action) {
    switch (action.type) {
        case 'FUND_INSERT':
            return Object.assign({}, state, { data: action.payload });
        case 'FUND_GET_DATA_LIST':
            return Object.assign({}, state, { dataList: action.payload });
        case 'FUND_SELECT_DATA':
            return Object.assign({}, state, { data: action.payload });
        case 'FUND_CLEAR_DATA':
            return Object.assign({}, state, {
                data: {
                    admin_use: false,
                    onetime: false
                }
            });
        default:
            return state
    }
}
export function fundAction(store) {
    return [commonAction(),
    {
        FUND_INSERT: function (data) {
            this.fire('toast', { status: 'load' });
            axios.post('./fund/insert', data)
                .then((response) => {
                    console.log('success!!');
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.FUND_GET_DATA_LIST();
                        }
                    });
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        FUND_UPDATE: function (data) {
            this.fire('toast', { status: 'load' });
            axios.put('./fund/update', data)
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: () => {
                            this.$$('fund-manage').reset();
                            this.FUND_GET_DATA_LIST();
                        }
                    });
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        FUND_GET_DATA_LIST: function () {
            axios.get('./fund')
                .then((response) => {
                    store.dispatch({ type: 'FUND_GET_DATA_LIST', payload: response.data });
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        FUND_SELECT_DATA: function (id) {
            axios.get('./fund/id/' + id)
                .then((response) => {
                    this.$$('fund-manage').reset();
                    store.dispatch({ type: 'FUND_SELECT_DATA', payload: response.data });
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        FUND_DELETE: function (id) {
            this.fire('toast', { status: 'load' });
            axios.delete('./fund/delete/id/' + id)
                .then((response) => {
                    this.fire('toast', {
                        status: 'success', text: 'ลบข้อมูลสำเร็จ',
                        callback: () => {
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        FUND_CLEAR_DATA: function () {
            // this.$$('fund-manage').reset();
            store.dispatch({ type: 'FUND_CLEAR_DATA' });
        }
    }
    ]
}