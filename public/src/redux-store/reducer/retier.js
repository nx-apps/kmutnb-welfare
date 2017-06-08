import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    data: {}
}
export function retierReducer(state = initialState, action) {
    switch (action.type) {
        case 'FUND_RVD_GET_LIST':
            return Object.assign({}, state, { data: action.payload });
        default:
            return state
    }
}
export function retierAction(store) {
    return [commonAction(),
    {
        RETIER_SEARCH: function (data) {
            var tz = "T00:00:00+07:00";
            axios.get('/retier/list/date/' + data+tz)
                .then((result) => {
                    console.log(result.data);
                    // this.fire('toast', {
                    //     status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                    //         store.dispatch({ type: 'LIST_WELFARE', payload: result.data })
                    //     }
                    // });
                })
                .catch(err => {

                })
        }
    }
    ]
}