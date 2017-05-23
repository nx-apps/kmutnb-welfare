import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    module: [],
    config: {}
}

export function systemConfigsReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_SYSTEM_CONFIG':
            return Object.assign({}, state, { config: action.payload });
        default:
            return state;
    }
}

export function systemConfigsAction(store) {
    return [
        commonAction(), {
            GET_SYSTEM_CONFIG: function () {
                // var user = store.getState().auth.user;
                axios.get('/system/config')
                    .then(res => {
                        // console.log(res.data);
                        store.dispatch({ type: 'GET_SYSTEM_CONFIG', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            UPDATE_SYSTEM_CONFIG: function (data) {
                // var user = store.getState().auth.user;
                this.fire('toast', { status: 'load' });
                this.fire('toast', {
                    status: 'openDialog',
                    text: 'ต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
                    confirmed: (result) => {
                        if (result == true) {
                            this.fire('toast', { status: 'load' })
                            axios.post('/system/config/update', data)
                                .then(res => {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ',
                                        callback: () => {
                                            this.GET_SYSTEM_CONFIG()
                                        }
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }
                    }
                })
                // axios.post('/system/config/update',data)
                //     .then(res => {
                //         // console.log(res.data)
                //         // this.fire('toast', {
                //         // status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                //         //     console.log('success');
                //         //     this.GET_SYSTEM_CONFIG()
                //         // }
                //     // });
                //         // store.dispatch({ type: 'GET_SYSTEM_CONFIG', payload: res.data })
                //     })
                //     .catch(err => {
                //         console.log(err);
                //     })
            }
        }
    ]
}