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
exports.facultyInsert = function(req,res){
    var r = req.r;
    r.db('welfare_common').table('faculty')
        .insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.facultyUpdate = function(req,res){
  var r = req.r;
    
    r.db('welfare_common').table('faculty')
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
exports.facultyDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('faculty')
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