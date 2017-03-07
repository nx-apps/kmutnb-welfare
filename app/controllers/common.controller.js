// var r = req.r;
exports.academic = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('academic')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.active = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('active')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.department = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('department')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
// exports.employee = function(req,res){
//   var r = req.r;
//     r.db('welfare_common').table('employee')
//         .run()
//         .then(function (result) {
//             res.json(result);
//         })
//         .catch(function (err) {
//             res.status(500).json(err);
//         })
// }
exports.faculty = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('faculty')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.gender = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('gender')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.matier = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('matier')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.position = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('position')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.prefixname = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('prefixname')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.relation = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('relation')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.type_employee = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('type_employee')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}