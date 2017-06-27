module.exports = function (app) {
    var controller = require('../controllers/sso.controller');
    app.post('/upload', controller.upload);
    app.get('/genfile',controller.genSso);
    app.get('/downloadsso', controller.downloadsso);
    app.get('/download/id/:id', controller.downloadFile);
    app.get('/getfile/name/:name/sheet/:sheet', controller.getfile);
    app.post('/insert', controller.insert)
    app.get('/sheet/:name', controller.getSheets);
}