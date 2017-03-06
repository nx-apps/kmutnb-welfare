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
  // console.log(req.body)
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
exports.delete = function(req,res){
  console.log(req.body)
    var r = req.r;
   r.db('welfare').table('employee')
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
exports.update = function(req,res){
  var r = req.r;
    // console.log(req.body)
    // req.body = Object.assign(req.body, { year: req.body.year - 543 });
    r.db('welfare').table('employee')
        .get(req.body.id)
        .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.welfares = function(req,res) {
   var r = req.r;

   r.db('welfare').table('employee').get(req.params.id)
   .merge(function (emp) {
            return {
              gender: r.db('welfare').table('gender').get(emp('gender_id')).getField('gender')
            }}
   )
    .merge(function(f){
        return {
          start_work_date:f('start_work_date').split('T')(0),
          academic_name :r.db('welfare').table('academic').get(f('academic_id')).getField('academic_name'),
          active_name :r.db('welfare').table('active').get(f('active_id')).getField('active_name'),
          department_name :r.db('welfare').table('department').get(f('department_id')).getField('department_name'),
          faculty_name :r.db('welfare').table('faculty').get(f('faculty_id')).getField('faculty_name'),
          gender_name :r.db('welfare').table('gender').get(f('gender_id')).getField('gender_name'),
          matier_name :r.db('welfare').table('matier').get(f('matier_id')).getField('matier_name'),
          position_name :r.db('welfare').table('position').get(f('position_id')).getField('position_name'),
          prefixname_name :r.db('welfare').table('prefixname').get(f('prefixname_id')).getField('prefixname'),
          type_emp_name :r.db('welfare').table('type_employee').get(f('type_employee_id')).getField('type_emp_name'),
        }
      })
 .merge(function (welfare) {
            return {
              welfare: r.db('welfare').table('welfare')
              .merge(function(we_m){
                return {
                  count:we_m('condition').count(),
                  countpass : we_m('condition').map(function(con_map){
                    return {
                      pass: welfare(con_map('field')).do(function(d){
                        return r.branch(con_map('logic').eq(">="),
                                            d.ge(con_map('value')),
                                            r.branch(con_map('logic').eq(">"),
                                                d.gt(con_map('value')),
                                                r.branch(con_map('logic').eq("<="),
                                                    d.le(con_map('value')),
                                                    r.branch(con_map('logic').eq("<"),
                                                        d.lt(con_map('value')),
                                                        r.branch(con_map('logic').eq("="),
                                                            d.eq(con_map('value')),
                                                            d.ne(con_map('value'))
                                                        )
                                                    )
                                                )
                                            )
                                        )
                      })
                    }
                    })
                }
              })
              .merge((e)=>{
                 return {
                  countpass_total:e('countpass').filter({"pass": true}).count()
                  }
                })
             .merge((status)=>{
                 return {
               count_pass_status:status('countpass_total').eq(status('count'))
                  }
                })
            .merge((chengeidname)=>{
                return {welfare_id : chengeidname('id')}
            })
                 .filter({"count_pass_status": true})
                   .without('condition','countpass','id')
              .coerceTo('array')
            }}
   ) 
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
