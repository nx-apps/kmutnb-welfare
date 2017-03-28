module.exports = function (app) {
    var controller = require('../../controllers/signup/rvd.controller')
    
    app.get('/pid/:pid',controller.getrvd)
    app.post('/',controller.signup)
}