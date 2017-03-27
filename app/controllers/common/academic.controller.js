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
    // var valid = req.ajv.validate('list_welfare', req.body);
    var valid = req.ajv.validate('academic', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {

        r.db('welfare_common').table('academic')
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
exports.academicUpdate = function(req,res){
    // ca7e77c9-1f93-4a30-8a5c-3bd1a633e987
  var r = req.r;
  var valid = req.ajv.validate('academic', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
    
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
    } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    } 
        
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
