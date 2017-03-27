module.exports = function(app){
    var controller = require('../controllers/data_use.controller');

    app.get('/', controller.list)
    // app.get('/:id', controller.Id)
    app.get('/test', controller.test)
}