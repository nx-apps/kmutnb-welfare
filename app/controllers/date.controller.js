exports.currentdate = function (req, res) {
   let  result = new Date()
   let date = {
       dd : result.toISOString(),
       day : result.toISOString().split('T')[0].split('-')[2],
       month : result.toISOString().split('T')[0].split('-')[1],
       year : result.toISOString().split('T')[0].split('-')[0],
   }
   res.json(date);
}