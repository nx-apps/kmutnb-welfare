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
    var valid = req.ajv.validate('matier', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
    r.db('welfare_common').table('matier').insert(req.body)
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
exports.matierUpdate = function(req,res){
  var r = req.r;
    
    var valid = req.ajv.validate('matier', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
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
     } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    } 
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