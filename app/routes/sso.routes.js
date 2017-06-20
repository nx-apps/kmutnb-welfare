module.exports = function (app) {
    var controller = require('../controllers/sso.controller');
    app.post('/upload', controller.upload);
    app.get('/getfile', controller.getfile);
}