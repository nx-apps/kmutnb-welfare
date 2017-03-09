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
exports.departmentInsert = function(req,res){
    var r = req.r;
    r.db('welfare_common').table('department')
        .insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.departmentUpdate = function(req,res){
  var r = req.r;

        r.db('welfare_common').table('department')
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
exports.departmentDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('department')
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