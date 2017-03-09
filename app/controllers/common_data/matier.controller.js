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
exports.matierInsert = function(req,res){
    var r = req.r;
    r.db('welfare_common').table('matier').insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.matierUpdate = function(req,res){
  var r = req.r;
    
     r.db('welfare_common').table('matier')
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
exports.matierDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('matier')
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