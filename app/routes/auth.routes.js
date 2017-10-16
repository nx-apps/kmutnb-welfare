module.exports = function(app){
    const authCtrl = require('../controllers/auth.controller')
    const authenticate = require('./authenticate');
    app.post('/login',authCtrl.login)

    // app.post('/taxno',authCtrl.authTaxno)
    // app.get('/transform',authCtrl.transform)
    // app.get('/verifyToken',authCtrl.verifyToken)
    // app.get('/verifyTransform',authCtrl.verifyTransform)
    // app.get('/checkToken',authCtrl.checkToken)

    app.get('/user',authenticate(),authCtrl.user)
}