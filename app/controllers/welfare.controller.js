exports.list = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
    .run()
    .then(function(result){
        res.json(result)
    })
    .catch(function(err){
        res.status(500).json(err)
    })
}
exports.listId = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
    .get(req.params.id)
    .run()
    .then(function(result){
        res.json(result)
    })
    .catch(function(err){
        res.status(500).json(err)
    })
}