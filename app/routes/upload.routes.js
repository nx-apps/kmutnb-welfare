module.exports = function (app) {

    var upload = require('../controllers/upload.controller');
    app.route('/file/:emp_id').post(upload.uploadFile);
    app.route('/file').get(upload.listFile);
    app.route('/list/:refPath/:emp_id/:welfare_id').get(upload.listFilePath);
    app.route('/download/:id').get(upload.downloadFile);
    app.route('/delete/:id').delete(upload.deleteFile);
    // app.route('/list/:emp_id').get(upload.listFileDelete);
    // app.route('/update/:file_id').put(upload.recoveryFile);
}