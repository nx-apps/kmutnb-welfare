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
    let data = new Object()
    data.gender_name = req.body.gender_name
    data.id = sha1(req.body.gender_name)
    var r = req.r;
    r.db('welfare_common').table('gender').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.genderUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.gender_name = req.body.gender_name
    data.id = sha1(req.body.gender_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('gender')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({gender_id:old_id})
                .update({gender_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('gender')
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