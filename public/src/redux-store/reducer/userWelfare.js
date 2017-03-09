import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {},
    list_id: [],
    list_user: []
}

export function userWelfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'WELFARE_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'WELFARE_LIST_ID':
            return Object.assign({}, state, { list_id: action.payload });
        case 'LIST_USER':
            return Object.assign({}, state, { list_user: action.payload });
        default:
            return state
    }

}

export function userWelfareAction(store) {

    return [commonAction(),
    {
        WELFARE_LIST: function () {
            axios.get('/group_welfare')
                .then(function (result) {
                    // console.log(result.data);
                    store.dispatch({ type: 'WELFARE_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_LIST_ID: function (data) {
            // console.log(data);
            axios.get('/group_welfare/' + data)
                .then(function (result) {
                    // console.log(result);
                    store.dispatch({ type: 'WELFARE_LIST_ID', payload: [result.data] })
                })
                .catch(err => {

                })
        },
        LIST_USER: function (id) {
            // console.log(id);
            axios.get('/user_welfare/' + id)
                .then(function (result) {
                    // console.log(result);
                    store.dispatch({ type: 'LIST_USER', payload: result.data })
                })
                .catch(err => {

                })
        }
    }
    ]

}
