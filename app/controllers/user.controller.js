exports.list = function(req,res){
  // console.log('1111111')
  //  res.json({user:'1'});
    var r = req.r;
    r.db('welfare').table('employee')
        .merge(function(f){
        return {
          start_work_date:f('start_work_date').split('T')(0)
        }
      })
      .eqJoin('academic_id', r.db('welfare').table('academic')).without({right: 'id'}).zip()
      .eqJoin('active_id', r.db('welfare').table('active')).without({right: 'id'}).zip()
      .eqJoin('department_id', r.db('welfare').table('department')).without({right: 'id'}).zip()
      .eqJoin('faculty_id', r.db('welfare').table('faculty')).without({right: 'id'}).zip()
      .eqJoin('gender_id', r.db('welfare').table('gender')).without({right: 'id'}).zip()
      .eqJoin('matier_id', r.db('welfare').table('matier')).without({right: 'id'}).zip()
      .eqJoin('position_id', r.db('welfare').table('position')).without({right: 'id'}).zip()
      .eqJoin('prefixname_id', r.db('welfare').table('prefixname')).without({right: 'id'}).zip()
      .eqJoin('type_employee_id', r.db('welfare').table('type_employee')).without({right: 'id'}).zip()
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.insert = function(req,res){
  console.log(req.body)
    var r = req.r;
    r.db('welfare').table('employee').insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}