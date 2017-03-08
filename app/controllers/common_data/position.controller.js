exports.position = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('position')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.positionInsert = function(req,res){
    let data = new Object()
    data.position_name = req.body.position_name
    data.id = sha1(req.body.position_name)
    var r = req.r;
    r.db('welfare_common').table('position').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.positionUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.position_name = req.body.position_name
    data.id = sha1(req.body.position_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('position')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({position_id:old_id})
                .update({position_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('position')
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
exports.positionDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('position')
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