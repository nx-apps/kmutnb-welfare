import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    data: {},
    list_sheet: []
}

export function fundReducer(state = initialState, action) {
    switch (action.type) {
        case 'FUND_SELECT_UPLOAD':
            return Object.assign({}, state, { data: action.payload });
        case 'FUND_PREVIEW_DATA':
            return Object.assign({}, state, { list: action.payload });
        case 'FUND_GET_SHEET':
            return Object.assign({}, state, { list_sheet: action.payload });
        default:
            return state
    }
}

export function fundAction(store) {
    return [commonAction(), {
        FUND_UPLOADFILE: function (file) {
            // console.log(file[0]);
            var data = new FormData();
            data.append('file', file[0]);
            var config = {
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                },
                headers: { 'ref-path': 'fund.file' }
            };
            // axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.post('./fund/upload', data, config)
                .then((response) => {
                    // console.log(response.data);
                    var id = response.data.generated_keys[0];
                    axios.get('./fund/download/id/' + id)
                        .then((result) => {
                            // console.log(result);
                            store.dispatch({ type: 'FUND_SELECT_UPLOAD', payload: result.data[0] })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        FUND_PREVIEW_DATA: function (data) {
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('./fund/getfile/name/' + data.name + '/sheet/' + data.sheet)
                .then((result) => {
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'FUND_PREVIEW_DATA', payload: result.data })
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        FUND_INSERT: function (data) {
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.post('./fund/insert', data)
                .then((response) => {
                    this.fire('toast', { 
                        status: 'success', text: 'เก็บข้อมูลลงฐานข้อมูลสำเร็จ', callback: () => {
                            // console.log(response);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        FUND_GET_SHEET: function (nameFile) {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('./fund/sheet/' + nameFile)
                .then((result) => {
                    store.dispatch({ type: 'FUND_GET_SHEET', payload: result.data })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }]
}