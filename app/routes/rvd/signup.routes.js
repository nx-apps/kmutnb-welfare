module.exports = function (app) {
    var controller = require('../../controllers/rvd/signup.controller')
    
    app.get('/pid/:pid',controller.getrvd)
    app.post('/',controller.signup)
    app.get('/list/',controller.list)
    app.put('/update',controller.update)
    app.delete('/delete/id/:id',controller.delete)

    //ลิงตคนลาออก
    
}