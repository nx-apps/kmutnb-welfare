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
    let data = new Object()
    data.matier_name = req.body.matier_name
    data.id = sha1(req.body.matier_name)
    var r = req.r;
    r.db('welfare_common').table('matier').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.matierUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.matier_name = req.body.matier_name
    data.id = sha1(req.body.matier_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('matier')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({matier_id:old_id})
                .update({matier_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('matier')
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