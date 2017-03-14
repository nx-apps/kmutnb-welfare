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
    
    app.post('/:emp_id/upload/', upload.uploadFile);
    // app.get('/list/:refPath/:emp_id/:welfare_id', upload.listFilePath);
    app.get('/list/file/', upload.listFilePath);
    // app.route().get(upload.listFilePath);
    // app.delete('/use_welfare/delete/id/:id', controller.deleteWelfare);


}