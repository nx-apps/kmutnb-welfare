module.exports = function (app) {
    var academicController = require('../controllers/common_data/academic.controller');
    var activeController = require('../controllers/common_data/active.controller');
    var departmentController = require('../controllers/common_data/department.controller');
    var facultyController = require('../controllers/common_data/faculty.controller');
    var genderController = require('../controllers/common_data/gender.controller');
    var matierController = require('../controllers/common_data/matier.controller');
    var positionController = require('../controllers/common_data/position.controller');
    var prefixnameController = require('../controllers/common_data/prefixname.controller');
    var relationController = require('../controllers/common_data/relation.controller');
    var type_employeeController = require('../controllers/common_data/type_employee.controller');

// Exsample 
// https://localhost:3000/api/common/academic/
// https://localhost:3000/api/common/academic/insert/
// ส่ง old_id มาด้วยเพื่ออัพเดตได้
// https://localhost:3000/api/common/academic/update/
// https://localhost:3000/api/common/academic/delete/id/:id
// เปลี่ยนแค่ academic เป็นอย่างอื่น
    // app.get('/read', controller.read);
    app.get('/academic', academicController.academic);
    app.post('/academic/insert', academicController.academicInsert);
    app.put('/academic/update', academicController.academicUpdate);
    app.delete('/academic/delete/id/:id', academicController.academicDelete);

    app.get('/active', activeController.active);
    app.post('/active/insert', activeController.activeInsert);
    app.put('/active/update', activeController.activeUpdate);
    app.delete('/active/delete/id/:id', activeController.activeDelete);
    
    app.get('/department', departmentController.department);
    app.post('/department/insert', departmentController.departmentInsert);
    app.put('/department/update', departmentController.departmentUpdate);
    app.delete('/department/delete/id/:id', departmentController.departmentDelete);

    // // app.get('/employee', controller.employee);
    app.get('/faculty', facultyController.faculty);
    app.post('/faculty/insert', facultyController.facultyInsert);
    app.put('/faculty/update', facultyController.facultyUpdate);
    app.delete('/faculty/delete/id/:id', facultyController.facultyDelete);

    app.get('/gender', genderController.gender);
    app.post('/gender/insert', genderController.genderInsert);
    app.put('/gender/update', genderController.genderUpdate);
    app.delete('/gender/delete/id/:id', genderController.genderDelete);

    app.get('/matier', matierController.matier);
    app.post('/matier/insert', matierController.matierInsert);
    app.put('/matier/update', matierController.matierUpdate);
    app.delete('/matier/delete/id/:id', matierController.matierDelete);

    app.get('/position', positionController.position);
    app.post('/position/insert', positionController.positionInsert);
    app.put('/position/update', positionController.positionUpdate);
    app.delete('/position/delete/id/:id', positionController.positionDelete);

    app.get('/prefixname', prefixnameController.prefixname);
    app.post('/prefixname/insert', prefixnameController.prefixnameInsert);
    app.put('/prefixname/update', prefixnameController.prefixnameUpdate);
    app.delete('/prefixname/delete/id/:id', prefixnameController.prefixnameDelete);
    
    app.get('/relation', relationController.relation);
    app.post('/relation/insert', relationController.relationInsert);
    app.put('/relation/update', relationController.relationUpdate);
    app.delete('/relation/delete/id/:id', relationController.relationDelete);

    app.get('/type_employee', type_employeeController.type_employee);
    app.post('/type_employee/insert', type_employeeController.type_employeeInsert);
    app.put('/type_employee/update', type_employeeController.type_employeeUpdate);
    app.delete('/type_employee/delete/id/:id', type_employeeController.type_employeeDelete);


}