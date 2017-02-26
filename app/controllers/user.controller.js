exports.select = function(req,res){
    
}
exports.read = function(req,res){
    var r = req.r;
    r.db('welfare').table('welfare').get('15b5fa8f-4fb8-43a7-b8fa-c4200c578b5d')
  .merge(function(eee){
    return {
      conditionxxx : eee('condition').map(function(xx){
        return xxx : "xx"
      })
        
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