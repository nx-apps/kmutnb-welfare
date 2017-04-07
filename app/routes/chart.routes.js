module.exports = function (app) {
    var controller = require('../controllers/chart.controller');
    
    app.get('/day', controller.day); //listTable
    app.get('/week', controller.week); //listTable
    app.get('/month', controller.month); //listTable
    app.get('/year', controller.year); //listTable
}