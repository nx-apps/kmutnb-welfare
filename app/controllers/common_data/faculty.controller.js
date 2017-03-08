exports.faculty = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('faculty')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.facultyInsert = function(req,res){
    let data = new Object()
    data.faculty_name = req.body.faculty_name
    data.id = sha1(req.body.faculty_name)
    var r = req.r;
    r.db('welfare_common').table('faculty').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.facultyUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.faculty_name = req.body.faculty_name
    data.id = sha1(req.body.faculty_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('faculty')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({faculty_id:old_id})
                .update({faculty_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('faculty')
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
exports.facultyDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('faculty')
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