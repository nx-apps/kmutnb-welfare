module.exports = function (app) {
    var controller = require('../controllers/employee/employee.controller');
    var upload = require('../controllers/employee/upload.controller');
    var fundcontroller = require('../controllers/employee/rvd_fund.controller')
    app.get('/list', controller.list);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/:id', controller.delete);

    app.get('/unapprove', controller.unapprove);
    app.get('/:id/welfares/year/:year', controller.welfaresYear);
    app.post('/request/welfare/', controller.requestWelfare);
    app.put('/update/welfare/', controller.updateWelfare);

    // upload employee
    app.get('/list/file/', upload.listFilePath);
    app.get('/download/:id', upload.downloadFile);
    app.post('/:emp_id/upload/', upload.uploadFile);
    app.delete('/delete/:id', upload.deleteFile);
    // upload admin

    app.get('/list/upload/history/:id', upload.listUploadHistory);
    app.post('/:emp_id/upload/', upload.uploadFile);
    app.route('/admin/:emp_id/history/file/:history_id').post(upload.uploadFileadmin);
    // app.route().get(upload.listFilePath);
    // app.delete('/use_welfare/delete/id/:id', controller.deleteWelfare);

    app.get('/rvd/pid/:pid', fundcontroller.getRvdFund);


}