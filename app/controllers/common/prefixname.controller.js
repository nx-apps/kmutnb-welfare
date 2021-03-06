exports.prefixname = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('prefix')
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
    console.log(req.body);
    var valid = req.ajv.validate('prefix', req.body);
    console.log(valid);
    var result = { result: false, message: null, id: null };
    if (valid) {
    r.db('welfare_common').table('prefix')
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
  var valid = req.ajv.validate('prefix', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
    
     r.db('welfare_common').table('prefix')
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
   r.db('welfare_common').table('prefix')
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