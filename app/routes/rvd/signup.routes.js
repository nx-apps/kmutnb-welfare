module.exports = function (app) {
    var controller = require('../../controllers/rvd/signup.controller')
    
    app.get('/pid/:pid',controller.getrvd)
    app.post('/',controller.signup)
    app.get('/list/:status',controller.list)
    // sign active leave not 
    app.put('/update',controller.update)
    app.delete('/delete/id/:id',controller.delete)

    //ลิงตคนลาออก
    app.get('/list/active',controller.listactive)
    app.put('/leave',controller.leave)
}