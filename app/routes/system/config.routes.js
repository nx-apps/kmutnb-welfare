module.exports = function (app) {
    var controller = require('../../controllers/system/config.controller');
    
    app.get('/', controller.readSystemConfig); //listTable
    app.post('/update', controller.updateSystemConfig); //listTable
    // app.get('/month', controller.month); //listTable
    // app.get('/year', controller.year); //listTable
}