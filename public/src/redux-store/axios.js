import {create} from 'axios'
import {baseURL} from './config'
const settingAxios = create({
    baseURL:baseURL+'/api',
    // headers: headers.common['Authorization'] = localStorage.token
});
// axios.defaults.headers.common['Authorization'] = localStorage.token
// settingAxios.defaults.headers.common['Authorization'] = localStorage.token
export default settingAxios