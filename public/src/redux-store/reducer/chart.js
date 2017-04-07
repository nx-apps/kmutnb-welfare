import axios from '../axios'
import { commonAction } from '../config'
// import groupArray from 'group-array'
// var groupArray = require();
const initialState = {
    module: [],
    date: {},
    chart: []

}
// const toThaiDate = (date) => {
//     // console.log(typeof date);
//     try {
//         let year = parseInt(date.split('-')[0]) + 543,
//             month = date.split('-')[1],
//             day = date.split('-')[2];
//         return day + '/' + month + '/' + year
//     } catch (error) {
//         console.log(error);
//     }
// }
// const splitDate = (data) => {
//     // let newData = []
//     data.map((news, index) => {
//         for (let variable in news) {
//             if (variable.search('date') >= 0) {
//                 data[index][variable] = toThaiDate(news[variable].split('T')[0])
//             }
//         }
//     })
//     let newData = groupArray(data, 'date_approve')
//     let datas = []
//     for (let variable2 in newData) {
//         datas.push({
//             id: variable2,
//             data: newData[variable2]
//         })
//     }
//     return datas
// }
// const sumBath = (data) => {
//     // console.log(data);
//     let newDatas = []
//     data.map((bath) => {
//         let sum = []
//         bath.data.map((d) => {
//             sum.push(d.use_budget)
//         })
//        let total=  sum.reduce((acc, val)=> {
//             return acc + val;
//         }, 0);
//         newDatas.push({id:bath.id,bath:total})
//     })
//     return newDatas

// }
export function chartReducer(state = initialState, action) {
    switch (action.type) {
        case 'TEST':
            return Object.assign({}, state, { date: action.payload });
        case 'GET_CHART_DAY_WITHOUT_GROUP':
            return Object.assign({}, state, { chart: action.payload });
        case 'GET_CHART_WEEK_WITHOUT_GROUP':
            return Object.assign({}, state, { chart: action.payload });
        case 'GET_CHART_MONTH_WITHOUT_GROUP':
            return Object.assign({}, state, { chart: action.payload });
        case 'GET_CHART_YEAR_WITHOUT_GROUP' :
            return Object.assign({}, state, { chart: action.payload });
        default:
            return state;
    }
}

export function chartAction(store) {
    return [
        commonAction(), {
            TEST: function (data) {

                // console.log(groupArray(arr, 'tag'));
                store.dispatch({ type: 'TEST', payload: '1111' })

            },
            GET_CHART_DAY_WITHOUT_GROUP(data) {
                axios.get(`/chart/day/?${data}`)
                    .then(res => {
                        store.dispatch({ type: 'GET_CHART_DAY_WITHOUT_GROUP', payload: res.data })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            // 
            GET_CHART_WEEK_WITHOUT_GROUP(data) {
                // console.log(data);
                axios.get(`/chart/week?${data}`)
                    .then(res => {
                        
                        store.dispatch({ type: 'GET_CHART_WEEK_WITHOUT_GROUP', payload: res.data})
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            GET_CHART_MONTH_WITHOUT_GROUP(data) {
                console.log(data);
                axios.get(`/chart/month?${data}`)
                    .then(res => {
                        
                        store.dispatch({ type: 'GET_CHART_MONTH_WITHOUT_GROUP', payload: res.data})
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            GET_CHART_YEAR_WITHOUT_GROUP(data) {
                console.log(data);
                axios.get(`/chart/year?${data}`)
                    .then(res => {
                        
                        store.dispatch({ type: 'GET_CHART_YEAR_WITHOUT_GROUP', payload: res.data})
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
        }
    ]
}