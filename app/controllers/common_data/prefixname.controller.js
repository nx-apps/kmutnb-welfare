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
exports.prefixnameInsert = function(req,res){
    var r = req.r;
    var valid = req.ajv.validate('prefixname', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
    r.db('welfare_common').table('prefixname')
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
exports.prefixnameUpdate = function(req,res){
  var r = req.r;
  var valid = req.ajv.validate('prefixname', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
    
     r.db('welfare_common').table('prefixname')
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
exports.prefixnameDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('prefixname')
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