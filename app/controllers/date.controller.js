exports.currentdate = function (req, res) {
   let  result = new Date()
   let day =  1000*60 * 60 * 24;
   let _7day_old = 7*day
   let now = +new Date(result)
//    console.log(((+new Date(result))-_7day_old).toISOString())
//    var date = 
   let date = {
       result: result,
       dateOld_7: (new Date(now-_7day_old)).toISOString(),
       dateNow : +new Date(result),
       date : result.toISOString(),
       dates : result.toISOString().split('T')[0],
       day : result.toISOString().split('T')[0].split('-')[2],
       month : result.toISOString().split('T')[0].split('-')[1],
       year : result.toISOString().split('T')[0].split('-')[0],
   }

   res.json(date);
}