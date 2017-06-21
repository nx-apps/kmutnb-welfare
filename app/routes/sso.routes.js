module.exports = function (app) {
    var controller = require('../controllers/sso.controller');
    app.put('/upload', controller.upload);
    app.get('/download/id/:id', controller.downloadFile);
    app.get('/getfile/name/:name', controller.getfile);
}