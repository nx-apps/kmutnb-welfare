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
exports.positionInsert = function(req,res){
    var r = req.r;
    var valid = req.ajv.validate('position', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
    r.db('welfare_common').table('position')
    .insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
     } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    } 
}
exports.positionUpdate = function(req,res){
  var r = req.r;
    
    var valid = req.ajv.validate('academic', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
      r.db('welfare_common').table('position')
        .get(req.body.id)
        .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
     } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    } 
}
exports.positionDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('position')
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