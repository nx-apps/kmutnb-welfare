exports.type_employee = function(req,res){
  var r = req.r;
    r.db('welfare_common').table('type_employee')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.type_employeeInsert = function(req,res){
    let data = new Object()
    data.type_emp_name = req.body.type_emp_name
    data.id = sha1(req.body.type_emp_name)
    var r = req.r;
    r.db('welfare_common').table('type_employee').insert(data)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.type_employeeUpdate = function(req,res){
  var r = req.r;
    // console.log(req.body)
    let data = new Object()
    let old_id = req.body.old_id
    data.type_emp_name = req.body.type_emp_name
    data.id = sha1(req.body.type_emp_name)
    r.expr(data)
        .merge((int)=>{
            return {
                int : r.db('welfare_common').table('type_employee')
                .insert(int)
            }
        })
        .merge((emp)=>{
            return {
                emp : r.db('welfare').table('employee')
                .filter({type_employee_id:old_id})
                .update({type_employee_id:data.id})
                .coerceTo('array')
            }
        })
        .merge((del)=>{
            return {
                del : r.db('welfare_common').table('type_employee')
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
exports.type_employeeDelete = function(req,res){
//   console.log(req.body)
    var r = req.r;
   r.db('welfare_common').table('type_employee')
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