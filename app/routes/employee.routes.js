module.exports = function (app) {
    var controller = require('../controllers/employee.controller');
    // var upload = require('../controllers/employee/upload.controller');
    // var fundcontroller = require('../controllers/employee/rvd_fund.controller')
    app.get('/list', controller.list);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/:id', controller.delete);

    // app.get('/unapprove', controller.unapprove); //history.route
    app.get('/:id/welfares/year/:year', controller.welfaresYear);
    // app.post('/request/welfare/', controller.requestWelfare);  //history.route
    // app.put('/update/welfare/', controller.updateWelfare);  //history.route

    // upload employee
    // app.get('/list/file/', upload.listFilePath); //document.route
    // app.get('/download/:id', upload.downloadFile); //file.route
    // app.post('/:emp_id/upload/', upload.uploadFile); //file.route
    // app.delete('/delete/:id', upload.deleteFile); //document.route
    // upload admin

    // app.get('/list/upload/history/:id', upload.listUploadHistory); //history.route
    // app.post('/:emp_id/upload/', upload.uploadFile);
    // app.post('/admin/:emp_id/history/file/:history_id', upload.uploadFileadmin); //file.route
    // app.route().get(upload.listFilePath);
    // app.delete('/use_welfare/delete/id/:id', controller.deleteWelfare);

    // app.get('/rvd/pid/:pid', fundcontroller.getRvdFund);

    app.get('/welfaresEmployee/:id', controller.welfaresEmployee);


}