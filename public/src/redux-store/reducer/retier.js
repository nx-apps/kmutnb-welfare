import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    list: []
}
export function retierReducer(state = initialState, action) {
    switch (action.type) {
        case 'RETIER_SEARCH':
            return Object.assign({}, state, { list: action.payload });
        default:
            return state
    }
}
export function retierAction(store) {
    return [commonAction(),
    {
        RETIER_SEARCH: function (data) {
            // var tz = "T00:00:00+07:00";
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('/retier/list?date=' + data)
                .then((result) => {
                    // console.log(result.data);
                    // result.data.map((item) => {
                    //     return item.check = true
                    // })
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'RETIER_SEARCH', payload: result.data })
                        }
                    });
                })
                .catch(err => {

                })
        },
        UPDATE_RETIREMENT_EMP: (emp) => {
            // console.log(emp);
            
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.put('/retier/update', emp)
                .then((result) => {
                    // console.log(result.data);
                    // result.data.map((item) => {
                    //     return item.check = true
                    // })
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            // store.dispatch({ type: 'RETIER_SEARCH', payload: result.data })
                        }
                    });
                })
                .catch(err => {

                })
        }
    }
    ]
}