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
exports.relationInsert = function(req,res){
    var r = req.r;
    r.db('welfare_common').table('relation')
    .insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.relationUpdate = function(req,res){
  var r = req.r;
    
      r.db('welfare_common').table('relation')
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
exports.relationDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('relation')
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