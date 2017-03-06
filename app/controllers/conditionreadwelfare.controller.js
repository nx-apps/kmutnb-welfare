exports.read = function(req,res){
  // console.log('1111111')
  //  res.json({user:'1'});
//   var crypto = require('crypto');
//   var sha1 = crypto.createHash('sha1').update('Apple').digest("hex");
//   console.log('>>>>>>>',sha1);
    var r = req.r;
    r.db('welfare').table('condition_2')
    //     .merge(function(f){
    //     return {
    //       start_work_date:f('start_work_date').split('T')(0)
    //     }
    //   })

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
//   var crypto = require('crypto');
//   var sha1 = crypto.createHash('sha1').update('Apple').digest("hex");
//   console.log('>>>',req.body)
    var r = req.r;
    r.db('welfare').table('condition_2').insert(req.body)
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
   r.db('welfare').table('condition_2')
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
    r.db('welfare').table('condition_2')
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
   var r = req.r;

        r.db('welfare').table('condition_2')
         .merge(function(f){
            return {
            data:r.db('welfare').table(f('data_source'))
                .merge((data_source)=>{
                   return{
                    name: 1
                   } 
                })
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
