import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    dataSelect: {}
}

export function userWelfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'WELFARE_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'WELFARE_LIST_ID':
            return Object.assign({}, state, { list_id: action.payload });
        default:
            return state
    }

}

export function userWelfareAction(store) {

    return [commonAction(),
    {
        WELFARE_LIST: function () {
            axios.get('/user_welfare')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LIST_ID: function (data) {
            axios.get('/user_welfare/' + data)
                .then(function (result) {
                    // console.log(result);
                    store.dispatch({ type: 'WELFARE_LIST_ID', payload: result.data })
                })
                .catch(err => {

                })
        }
    }
    ]

}
