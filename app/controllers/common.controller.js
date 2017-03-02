// var r = req.r;
exports.academic = function(req,res){
  var r = req.r;
    r.db('welfare').table('academic')
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
    r.db('welfare').table('active')
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
    r.db('welfare').table('department')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.employee = function(req,res){
  var r = req.r;
    r.db('welfare').table('employee')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.faculty = function(req,res){
  var r = req.r;
    r.db('welfare').table('faculty')
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
    r.db('welfare').table('gender')
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
    r.db('welfare').table('matier')
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
    r.db('welfare').table('position')
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
    r.db('welfare').table('prefixname')
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
    r.db('welfare').table('relation')
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
    r.db('welfare').table('type_employee')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}