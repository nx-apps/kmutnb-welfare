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
exports.activeInsert = function(req,res){
   
    var r = req.r;
    r.db('welfare_common').table('active')
    .insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.activeUpdate = function(req,res){
  var r = req.r;

    r.db('welfare_common').table('active')
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
exports.activeDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('active')
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