import {createStore,combineReducers} from 'redux'
import PolymerRedux from 'polymer-redux'
import {dispatchActionBehavior} from './config'

import {commonSystemReducer,commonSystemAction} from './reducer/commonSystem'
import {authReducer,authAction} from './reducer/auth'
import {providerReducer,providerAction} from './reducer/provider'
import {userWelfareReducer,userWelfareAction} from './reducer/userWelfare'
import {listWelfareReducer,listWelfareAction} from './reducer/listWelfare'
import {welfareReducer,welfareAction} from './reducer/welfare'
import {commonDataReducer,commonDataAction} from './reducer/commonData'
import {usersReducer,usersAction} from './reducer/users'
const rootReducer = combineReducers({
    commonSystem:commonSystemReducer,
    auth:authReducer,
    provider:providerReducer,
    userWelfare:userWelfareReducer,
    listWelfare:listWelfareReducer,
    welfare:welfareReducer,
    commonData:commonDataReducer,
    users:usersReducer
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
window.userWelfareAction = userWelfareAction(storeApp);
window.listWelfareAction = listWelfareAction(storeApp);
window.welfareAction = welfareAction(storeApp);
window.commonDataAction = commonDataAction(storeApp); 
window.usersAction = usersAction(storeApp);
