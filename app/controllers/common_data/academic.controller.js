sha1 = require('js-sha1');
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
exports.academicInsert = function(req,res){
    var r = req.r;
    r.db('welfare_common').table('academic')
        .insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.academicUpdate = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('academic')
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
exports.academicDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('academic')
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
