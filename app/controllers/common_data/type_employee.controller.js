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
exports.type_employeeInsert = function(req,res){
    var r = req.r;
    r.db('welfare_common').table('type_employee')
    .insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.type_employeeUpdate = function(req,res){
  var r = req.r;
    
    r.db('welfare_common').table('type_employee')
        .get(req.body.id)
        .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.type_employeeDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('type_employee')
        .get(req.params.id)
        .delete()
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}