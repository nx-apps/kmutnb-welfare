module.exports = function (app) {

    var upload = require('../controllers/upload.controller');
    app.route('/file/:emp_id').post(upload.uploadFile);
    app.route('/file/admin/:emp_id/history/id/:history_id').post(upload.uploadFileadmin);
    app.route('/file').get(upload.listFile);
    app.route('/list/:refPath/:emp_id/:welfare_id').get(upload.listFilePath);
    app.route('/list/histroy/werfale/id/:id').get(upload.adminlistFilePath);
    app.route('/download/:id').get(upload.downloadFile);
    app.route('/delete/:id').delete(upload.deleteFile);
    // app.route('/list/:emp_id').get(upload.listFileDelete);
    // app.route('/update/:file_id').put(upload.recoveryFile);
}