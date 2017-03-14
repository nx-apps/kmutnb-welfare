module.exports = function (app) {
    var controller = require('../controllers/employee/employee.controller');
    var upload = require('../controllers/employee/upload.controller');
    app.get('/list', controller.list);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/:id', controller.delete);

    app.get('/unapprove', controller.unapprove);
    app.get('/:id/welfares/year/:year', controller.welfaresYear);
    app.post('/request/welfare/', controller.requestWelfare);
    app.put('/update/welfare/', controller.updateWelfare);

    // upload
    
    app.route('/:emp_id/upload/').post(upload.uploadFile);

    // app.delete('/use_welfare/delete/id/:id', controller.deleteWelfare);


}