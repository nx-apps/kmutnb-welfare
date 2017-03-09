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
    var valid = req.ajv.validate('active', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
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
        } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    } 
}
exports.activeUpdate = function(req,res){
  var r = req.r;
 var valid = req.ajv.validate('active', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
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
    } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    } 
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