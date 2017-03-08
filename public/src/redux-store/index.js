import {createStore,combineReducers} from 'redux'
import PolymerRedux from 'polymer-redux'
import {dispatchActionBehavior} from './config'

import {commonSystemReducer,commonSystemAction} from './reducer/commonSystem'
import {authReducer,authAction} from './reducer/auth'
import {providerReducer,providerAction} from './reducer/provider'
import {welfareReducer,welfareAction} from './reducer/welfare'
import {listWelfareReducer,listWelfareAction} from './reducer/listWelfare'
import {commonDataReducer,commonDataAction} from './reducer/commonData'
import {usersReducer,usersAction} from './reducer/users'
import {conditionReadWelfareReducer,conditionReadWelfareAction} from './reducer/conditionReadWelfare'


const rootReducer = combineReducers({
    commonSystem:commonSystemReducer,
    auth:authReducer,
    provider:providerReducer,
    welfare:welfareReducer,
    listWelfare:listWelfareReducer,
    commonData:commonDataReducer,
    users:usersReducer,
    conditionReadWelfare:conditionReadWelfareReducer
});

const storeApp = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.ReduxBehavior = [PolymerRedux(storeApp),dispatchActionBehavior()];
window.dispatchActionBehavior = dispatchActionBehavior();

window.commonSystemAction = commonSystemAction(storeApp);
window.authAction = authAction(storeApp);
window.providerAction = providerAction(storeApp);
window.welfareAction = welfareAction(storeApp);
window.listWelfareAction = listWelfareAction(storeApp);
window.commonDataAction = commonDataAction(storeApp); 
window.usersAction = usersAction(storeApp);
window.conditionReadWelfareAction = conditionReadWelfareAction(storeApp);
// 1111