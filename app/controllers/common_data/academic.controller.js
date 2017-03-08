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
    let data = new Object()
    data.academic_name = req.body.academic_name
    data.id = sha1(req.body.academic_name)
    var r = req.r;
    r.db('welfare_common').table('academic').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.academicUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.academic_name = req.body.academic_name
    data.id = sha1(req.body.academic_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('academic')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({academic_id:old_id})
                .update({academic_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('academic')
                .get(old_id)
                .delete()
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
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
