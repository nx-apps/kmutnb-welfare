module.exports = function (app) {
    var controller = require('../controllers/employee.controller');
    app.get('/list', controller.list);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/:id', controller.delete);
    app.get('/:id/:year', controller.welfaresYear);
    app.get('/:id', controller.welfaresEmployee);
}