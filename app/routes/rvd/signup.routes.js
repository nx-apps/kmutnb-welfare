module.exports = function (app) {
    var controller = require('../../controllers/rvd/signup.controller')
    
    app.get('/pid/:pid',controller.getrvd)
    app.post('/',controller.signup)
    app.get('/list/:status',controller.list)
    app.get('/list/',controller.listAll)
    // sign active leave not 
    app.put('/update',controller.update)
    app.delete('/delete/id/:id',controller.delete)

    //ลิงตคนลาออก
    app.put('/leave',controller.leave)
    app.put('/fund/out',controller.fundOut)
}