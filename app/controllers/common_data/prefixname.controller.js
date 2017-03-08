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
    let data = new Object()
    data.prefixname_name = req.body.prefixname_name
    data.id = sha1(req.body.prefixname_name)
    var r = req.r;
    r.db('welfare_common').table('prefixname').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.prefixnameUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.prefixname_name = req.body.prefixname_name
    data.id = sha1(req.body.prefixname_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('prefixname')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({prefixname_id:old_id})
                .update({prefixname_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('prefixname')
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