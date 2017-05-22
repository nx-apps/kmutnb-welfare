module.exports = function (app) {
    var controller = require('../controllers/employee.controller');
    app.get('/list', controller.list);
    app.get('/list/work', controller.welfaresEmployeeWork);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/:id', controller.delete);
    app.get('/:id', controller.welfaresEmployee);
    app.get('/:id/:year', controller.welfaresYear);

}