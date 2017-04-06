exports.currentdate = function (req, res) {
   let  result = new Date()
//    var date = 
   let date = {
       result: result,
       dateNow : +new Date(result),
       date : result.toISOString(),
       dates : result.toISOString().split('T')[0],
       day : result.toISOString().split('T')[0].split('-')[2],
       month : result.toISOString().split('T')[0].split('-')[1],
       year : result.toISOString().split('T')[0].split('-')[0],
   }
   res.json(date);
}