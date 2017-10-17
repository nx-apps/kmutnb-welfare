import axios from '../axios'
import { commonAction } from '../config'
import jwtDecode from 'jwt-decode'

const initialState = {
    user: {}
}

export function authReducer(state = initialState, action) {

    switch (action.type) {
        // case 'AUTH_SET_USER':
        //     var userInfo;
        //     if (action.payload.token) {
        //         userInfo = jwtDecode(action.payload.token)
        //     } else {
        //         userInfo = action.payload;
        //     }
        //     return Object.assign({}, state, { user: userInfo });
        // case 'AUTH_INFO':
        //     return Object.assign({}, state, { user: action.payload });
        case 'authGetUser':
            return Object.assign({}, state, { user: action.payload });
        default:
            return state
    }

}

export function authAction(store) {

    return [commonAction(),
    {
        // AUTH_LOGIN: function (formLogin) {
        //     axios.post('./auth/login', { username: formLogin.user, password: formLogin.pass })
        //         .then((response) => {


        //             localStorage.setItem("token", response.data.token);
        //             store.dispatch({ type: 'AUTH_SET_USER', payload: response.data })

        //             let userInfo;
        //             if (response.data.token) {
        //                 userInfo = jwtDecode(response.data.token)
        //             } else {
        //                 userInfo = response.data;
        //             }

        //             //  if(userInfo.role=="teacher"){
        //             //     this.fire('nylon-change-page',{path:'/examRoom'})
        //             // }else{
        //             //     this.fire('nylon-change-page',{path:'/examHistory'})
        //             // }

        //         })
        //         .catch((error) => {
        //             //console.log('error');
        //             console.log({ error });
        //             alert('error')
        //         });
        // }
        authLogin: function (login) {
            console.log(login);
            return axios.post('/auth/login', login)
            // .then(res => {
            //     localStorage.setItem("token", res.data.token)
            //     // var decoded = jwtDecode(res.data.token);
            //     // localStorage.setItem("emp_id", decoded.emp_id)
            //     // localStorage.setItem("role", decoded.role)
            //     // this.fire('nylon-change-page', {
            //     //     path: 'user-welfare/' + decoded.emp_id
            //     // });
            //     // store.dispatch({ type: 'GET_CHART_DAY_WITHOUT_GROUP', payload: res.data })
            // })
            // .catch(err => {
            //     console.log(err);
            // })

        },

        authGetUser: function (token) {
            var decoded = jwtDecode(token);
            //    return axios.get('/auth/user', token)
            //         .then(res => {
            store.dispatch({ type: 'authGetUser', payload: decoded })
            //         })
            //         .catch(err => {
            //             console.log(err);
            //         })
        },

        authLogout: function () {
            // return dispatch => {
            console.log(22222);
            localStorage.removeItem("token")
            // Nylon.redirect('/')
            store.dispatch({ type: 'authGetUser', payload: {} })
            this.fire('nylon-change-page', {
                path: '/'
            })
            // console.log(66666);
            // }

        },

        // authTransform: function (url) {
        //     return dispatch => {
        //         axios.get('/auth/transform').then(
        //             res => {
        //                 window.location = `${url}/auth/transform?source=${res.data.token}`
        //             }
        //         )
        //             .catch(
        //             err => {
        //                 console.log(err)
        //             }
        //             )
        //     }

        // },

        // authVerifyToken: function () {
        //     return dispatch => {
        //         var decode = jwt_decode(localStorage.token)
        //         dispatch({ type: 'AUTH_VERIFY_TOKEN', payload: decode })
        //     }
        // }
    }
    ]

}