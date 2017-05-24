module.exports = function (app) {
    var controller = require('../../controllers/group/welfare.controller');
    app.get('/year/:year', controller.list);
    app.get('/year', controller.groupYear);
    app.get('/:id', controller.listId);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
    app.put('/approve', controller.approve);
    app.get('/groupByYear/year/:year', controller.groupByYear);
    app.get('/adminEmployee/:groupId', controller.adminEmployee); 
    app.post('/clone', controller.cloneData);
    app.put('/updateGroup', controller.updateGroup);
}