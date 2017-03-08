exports.department = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('department')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.departmentInsert = function(req,res){
    let data = new Object()
    data.department_name = req.body.department_name
    data.id = sha1(req.body.department_name)
    var r = req.r;
    r.db('welfare_common').table('department').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.departmentUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.department_name = req.body.department_name
    data.id = sha1(req.body.department_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('department')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({department_id:old_id})
                .update({department_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('department')
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
exports.departmentDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('department')
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