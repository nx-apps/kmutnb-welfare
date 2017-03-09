exports.list = function(req,res){
    // https://localhost:3000/api/user/list
  // console.log('1111111')
  //  res.json({user:'1'});
//   var crypto = require('crypto');
//   var sha1 = crypto.createHash('sha1').update('Apple').digest("hex");
//   console.log('>>>>>>>',sha1);
    var r = req.r;
    r.db('welfare').table('employee')
        .merge(function(f){
        return {
          start_work_date:f('start_work_date').split('T')(0),
          birthdate:f('birthdate').split('T')(0)
        }
      })
      .merge(function(f){
        return {
          start_work_date:f('start_work_date').split('T')(0),
         birthdate:f('birthdate').split('T')(0),
          academic_name :r.db('welfare_common').table('academic').get(f('academic_id')).getField('academic_name'),
          active_name :r.db('welfare_common').table('active').get(f('active_id')).getField('active_name'),
          department_name :r.db('welfare_common').table('department').get(f('department_id')).getField('department_name'),
          faculty_name :r.db('welfare_common').table('faculty').get(f('faculty_id')).getField('faculty_name'),
          gender_name :r.db('welfare_common').table('gender').get(f('gender_id')).getField('gender_name'),
          matier_name :r.db('welfare_common').table('matier').get(f('matier_id')).getField('matier_name'),
          position_name :r.db('welfare_common').table('position').get(f('position_id')).getField('position_name'),
          prefixname_name :r.db('welfare_common').table('prefixname').get(f('prefixname_id')).getField('prefixname'),
          type_emp_name :r.db('welfare_common').table('type_employee').get(f('type_employee_id')).getField('type_emp_name'),
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
exports.insert = function(req,res){
//   console.log('>>>>>>>>',req.body)
// let newData = new Object()
  for (let prop in req.body) {
     req.body[prop] = req.body[prop].replace(/ /g,'').trim()
  }   
// console.log(req.body);
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
    for (let prop in req.body) {
     req.body[prop] = req.body[prop].replace(/ /g,'').trim()
  }  
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
   //แก้ด้วย
// https://localhost:3000/api/user/welfares/id/875932f9-a308-4802-980e-247f82f4fb1c
   r.db('welfare').table('employee').get(req.params.id)
   .merge(function (emp) {
            return {
              gender: r.db('welfare_common').table('gender').get(emp('gender_id')).getField('gender_name')
            }}
   )
    .merge(function(f){
        return {
          start_work_date:f('start_work_date').split('T')(0),
         birthdate:f('birthdate').split('T')(0),
          academic_name :r.db('welfare_common').table('academic').get(f('academic_id')).getField('academic_name'),
          active_name :r.db('welfare_common').table('active').get(f('active_id')).getField('active_name'),
          department_name :r.db('welfare_common').table('department').get(f('department_id')).getField('department_name'),
            faculty_name :r.db('welfare_common').table('faculty').get(f('faculty_id')).getField('faculty_name'),
          gender_name :r.db('welfare_common').table('gender').get(f('gender_id')).getField('gender_name'),
          matier_name :r.db('welfare_common').table('matier').get(f('matier_id')).getField('matier_name'),
          position_name :r.db('welfare_common').table('position').get(f('position_id')).getField('position_name'),
          prefixname_name :r.db('welfare_common').table('prefixname').get(f('prefixname_id')).getField('prefixname'),
          type_emp_name :r.db('welfare_common').table('type_employee').get(f('type_employee_id')).getField('type_emp_name'),
        }
      })
 .merge(function (welfare) {
            return {
              welfare: r.db('welfare').table('welfare')
              .merge((group_name)=>{
                  return {
                      name: r.db('welfare').table('group_welfare').get(group_name('group_id')).getField('group_welfare_name')
                  }
              })
              .merge((name_field)=>{
                  return {condition:
                       name_field('condition').map((con_map)=>{
                      return  {
                          field:r.db('welfare').table('condition').get(con_map('field')).getField('field'),
                          logic:con_map('logic'),
                          logic_show:con_map('logic_show'),
                          value:con_map('value'),
                          value_show:con_map('value_show')
                        }
                      }
                    )
                  }
              })
              .merge((value_field)=>{
                  return {condition:
                       value_field('condition').map((con_map)=>{
                      return  {
                          field:con_map('field'),
                          logic:con_map('logic'),
                          logic_show:con_map('logic_show'),
                          value:con_map.getField('field').eq('gender').branch(
                              r.db('welfare_common').table('gender').get(con_map('value')).getField('gender_name')
                              //.coerceTo('array')
                          ,con_map('value'))
                          
                        //   con_map('value')
                          ,
                        //   value_show:con_map('value_show')
                        }
                      }
                    )
                  }
              })
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
                                                        r.branch(con_map('logic').eq("=="),
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
            .merge((use_his)=>{
                    return {
                    budget_use : r.db('welfare').table('history_welfare')
                            .filter(
                                { emp_id:welfare('id'),
                                 welfare_id:use_his('id')}
                                )
                            .sum('use_budget')
                    }
                })
                .merge((balance)=>{
                    return {
                        budget_balance : balance('budget').sub(balance('budget_use')),
                        budget_balance_check : balance('budget').sub(balance('budget_use')).le(0).branch(true,false)
                    }
                })
                // เอาสวัสดิการที่ยังมีเงินเหลือออกมาแสดง
               .filter({"budget_balance_check": false})
               .without('condition','countpass','id','count','count_pass_status','countpass_total','budget_balance_check','year','start_date','end_date')
              .coerceTo('array')
            }}
        )
        .merge((use_his)=>{
                    return {
                    
                    history_welfare : r.db('welfare').table('history_welfare')
                                    .getAll(use_his('id'), {index:'emp_id'})
                                    .merge((name_welfare)=>{
                                        return {
                                            date_use:name_welfare('date_use').split('T')(0),
                                            name : r.db('welfare').table('group_welfare').get(r.db('welfare').table('welfare').get(name_welfare('welfare_id')).getField('group_id')).getField('group_welfare_name'),
                                            history_welfare_id : name_welfare('id')
                                        }
                                    })
                                    .without('id')
                                    .orderBy('date_use')
                                    .coerceTo('array')
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
exports.useWelfare = function (req,res) {
    // https://localhost:3000/api/user/use_welfare/
//     for (let prop in req.body) {
//      req.body[prop] = req.body[prop].replace(/ /g,'').trim()
//   }   
console.log(req.body);

    var r = req.r;
    r.db('welfare').table('history_welfare').insert(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
},
exports.editWelfare = function (req,res) {
    var r = req.r;
    // console.log(req.params.id);
    r.db('welfare').table('history_welfare')
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
exports.deleteWelfare = function (req,res) {
    var r = req.r;
    // console.log(req.params.id);
    r.db('welfare').table('history_welfare')
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
