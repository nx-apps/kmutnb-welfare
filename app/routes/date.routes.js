module.exports = function (app) {
    var controller = require('../controllers/date.controller');
    
    app.get('/currentdate', controller.currentdate); //listTable
    app.get('/listyear', controller.listyear); //listTable
}