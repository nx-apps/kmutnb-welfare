import axios from '../axios'
import { commonAction } from '../config'

const initialState = {
    list: [],
    data: {},
    list_sheet: []
}

export function ssoReducer(state = initialState, action) {
    switch (action.type) {
        case 'SSO_SELECT_UPLOAD':
            return Object.assign({}, state, { data: action.payload });
        case 'SSO_PREVIEW_DATA':
            return Object.assign({}, state, { list: action.payload });
        case 'SSO_GET_SHEET':
            return Object.assign({}, state, { list_sheet: action.payload});
        default:
            return state
    }
}

export function ssoAction(store) {
    return [commonAction(), {
        SSO_UPLOADFILE: function (file) {
            // console.log(file[0]);
            var data = new FormData();
            data.append('file', file[0]);
            var config = {
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                },
                headers: { 'ref-path': 'sso.file' }
            };
            // axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.post('./sso/upload', data, config)
                .then((response) => {
                    // console.log(response.data);
                    var id = response.data.generated_keys[0];
                    axios.get('./sso/download/id/' + id)
                        .then((result) => {
                            // console.log(result);
                            store.dispatch({ type: 'SSO_SELECT_UPLOAD', payload: result.data[0] })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        SSO_PREVIEW_DATA: function (data) {
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('./sso/getfile/name/' + data.name + '/sheet/' + data.sheet)
                .then((result) => {
                    // console.log(result);
                    for (var i = 0; i <= result.data.length; i++) {
                        if (result.data[i]) {
                            // console.log(result.data[i]);
                            var data = result.data[i];
                            if(data.issued_date === null){
                                console.log(data);
                            }
                            // data.issued_date = data.issued_date.split('T')[0];
                            // data.expired_date = data.expired_date.split('T')[0];
                        }
                    }
                    this.fire('toast', {
                        status: 'success', text: 'โหลดข้อมูลสำเร็จ', callback: () => {
                            store.dispatch({ type: 'SSO_PREVIEW_DATA', payload: result.data })
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        SSO_INSERT: function (data) {
            this.fire('toast', { status: 'load' });
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.post('./sso/insert', data)
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
        SSO_GET_SHEET: function (nameFile) {
            axios.defaults.headers.common['Authorization'] = localStorage.token
            axios.get('./sso/sheet/' + nameFile)
                .then((result) => {
                    store.dispatch({ type: 'SSO_GET_SHEET', payload: result.data });
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }]
}