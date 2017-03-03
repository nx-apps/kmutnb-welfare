import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    select: {}
}

export function welfareReducer(state = initialState, action) {

    switch (action.type) {
        case 'WELFARE_LIST':
            return Object.assign({}, state, { list: action.payload });
        default:
            return state
    }

}

export function welfareAction(store) {

    return [commonAction(),
    {
        WELFARE_LIST: function () {
            axios.get('/welfare')
                .then(function (result) {
                    store.dispatch({ type: 'WELFARE_LIST', payload: result.data })
                })
                .catch(err => {

                })
        },
        WELFARE_INSERT: function (data) {
            // console.log(data);
            var datas = {
                bugget: parseFloat(data.bugget),
                year: parseInt(data.year),
                condition: data.condition,
                start_date: new Date(data.start_date).toISOString(),
                end_date: new Date(data.end_date).toISOString(),
                name: data.name
            }
            // console.log(datas);
            this.fire('toast', { status: 'load' });
            axios.post(`./welfare/insert`, datas)
                .then((result) => {
                    console.log(result);
                    this.WELFARE_LIST();
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
        WELFARE_DELETE: function (data) {
            // console.log(data);
            axios.delete(`./welfare/delete/id/` + data)
                .then((result) => {
                    console.log(result);
                    this.WELFARE_LIST();
                    this.fire('toast', {
                        status: 'success', text: 'ลบสำเร็จ', callback: ()=> {
                            console.log('success');
                            this.$$('panel-right').close();
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        WELFARE_EDIT: function (data) {
            // console.log(data);
            var datas = {
                bugget: parseFloat(data.bugget),
                year: parseInt(data.year),
                condition: data.condition,
                start_date: new Date(data.start_date).toISOString(),
                end_date: new Date(data.end_date).toISOString(),
                name: data.name
            }
            console.log(datas);
            // this.fire('toast', { status: 'load' });
            // axios.post(`./welfare/insert`, datas)
            //     .then((result) => {
            //         console.log(result);
            //         this.WELFARE_LIST();
            //         this.fire('toast', {
            //             status: 'success', text: 'บันทึกสำเร็จ', callback: function () {
            //                 console.log('success');
            //             }
            //         });
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     })
        }
    }
    ]

}