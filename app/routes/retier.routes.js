module.exports = function (app) {
    var controller = require('../controllers/retier.controller');
    app.get('/list/date/:date',controller.list);
}

