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
    let data = new Object()
    data.active_name = req.body.active_name
    data.id = sha1(req.body.active_name)
    var r = req.r;
    r.db('welfare_common').table('active').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.activeUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.active_name = req.body.active_name
    data.id = sha1(req.body.active_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('active')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({active_id:old_id})
                .update({active_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('active')
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