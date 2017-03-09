exports.read = function(req,res){
  // https://localhost:3000/api/condition_read_welfare/list
  //  res.json({user:'1'});
//   var crypto = require('crypto');
//   var sha1 = crypto.createHash('sha1').update('Apple').digest("hex");
//   console.log('>>>>>>>',sha1);
    var r = req.r;
    r.db('welfare').table('condition')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.listTable = function (req,res) {
    r.db('welfare_common').tableList()
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
//  for (let prop in req.body) {
//      console.log(typeof prop);
//     //  req.body[prop] = req.body[prop].replace(/ /g,'').trim()
//   }  
    var r = req.r;
    r.db('welfare').table('condition').insert(req.body)
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
   r.db('welfare').table('condition')
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
    r.db('welfare').table('condition')
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
exports.conditions = function(req,res) {
    //https://localhost:3000/api/condition_read_welfare/list/conditions
   var r = req.r;

        r.db('welfare').table('condition')
         .merge(function(f){
            return {
            data:  f('data_source').eq("").branch("",
              r.db('welfare').table(f('data_source'))
                .merge((data_source)=>{
                   return{
                  name: data_source.hasFields('department_name').eq(true).branch(data_source('department_name'),
                          data_source.hasFields('faculty_name').eq(true).branch(data_source('faculty_name'),
                  		     data_source.hasFields('gender_name').eq(true).branch(data_source('gender_name'),
                          data_source.hasFields('academic_name').eq(true).branch(data_source('academic_name'),
                          data_source.hasFields('matier_name').eq(true).branch(data_source('matier_name'),
                          data_source.hasFields('active_name').eq(true).branch(data_source('active_name'),
                          data_source.hasFields('position_name').eq(true).branch(data_source('position_name'),
                          data_source.hasFields('relation_name').eq(true).branch(data_source('relation_name'),
                          data_source.hasFields('prefixname').eq(true).branch(data_source('prefixname'),
                                '1')))))))))
                   } 
                })
              .without('department_name','faculty_name','academic_name','matier_name','active_name','position_name','relation_name','relation_name','prefixname','gender_name')
              .coerceTo('array')
              ) 
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
