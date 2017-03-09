exports.listWelfare = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.listWelfareId = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .get(req.params.id)
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.insert = function (req, res) {
    var r = req.r;
    var valid = req.ajv.validate('list_welfare', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
    console.log(req.body);
    r.db('welfare').table('welfare').insert(req.body)
        .run()
        .then((response) => {
            result.message = response;
            if (response.errors == 0) {
                result.result = true;
                result.id = response.generated_keys;
            }
            res.json(result);
        })
        .error((err) => {
            result.message = err;
            res.json(result);
        })
    } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    }
}
exports.update = function (req, res) {
    var r = req.r;
    // console.log(req.body)
    r.db('welfare').table('welfare')
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
exports.delete = function (req, res) {
    var r = req.r;
    r.db('welfare').table('welfare')
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