module.exports = function (app) {
    var controller = require('../../controllers/rvd/signup.controller')
    
    app.get('/pid/:pid',controller.getrvd)
    app.post('/',controller.signup)
    app.get('/list/:status',controller.list)
    app.get('/list',controller.listAll)
    // sign active leave not 
    app.put('/approve',controller.approve)
    app.put('/reject',controller.reject)

    //ลิงตคนลาออก
    app.put('/fund/change',controller.fundChange)
    app.put('/leave',controller.leave)
    app.put('/fund/out',controller.fundOut)
}