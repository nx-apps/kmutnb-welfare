exports.relation = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('relation')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.relationInsert = function(req,res){
    let data = new Object()
    data.relation_name = req.body.relation_name
    data.id = sha1(req.body.relation_name)
    var r = req.r;
    r.db('welfare_common').table('relation').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.relationUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.relation_name = req.body.relation_name
    data.id = sha1(req.body.relation_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('relation')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({relation_id:old_id})
                .update({relation_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('relation')
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
exports.relationDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('relation')
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