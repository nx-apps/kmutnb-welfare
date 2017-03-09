exports.gender = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('gender')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.genderInsert = function(req,res){
    var r = req.r;
    var valid = req.ajv.validate('gender', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
    r.db('welfare_common').table('gender').insert(req.body)
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
exports.genderUpdate = function(req,res){
  var r = req.r;
  var valid = req.ajv.validate('gender', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
    // console.log(req.body)
    
      r.db('welfare_common').table('gender')
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
exports.genderDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('gender')
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