exports.read = function (req, res) {
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
exports.listTable = function (req, res) {
    r.db('welfare_common').tableList()
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.listField = function (req, res) {
    r.db('welfare').table('employee')(0).keys()
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })

}
exports.insert = function (req, res) {
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
exports.delete = function (req, res) {
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
exports.update = function (req, res) {
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
exports.conditions = function (req, res) {
    //https://localhost:3000/api/condition_read_welfare/list/conditions
    var r = req.r;

    r.db('welfare').table('condition')
        .merge(function (con_merge) {
            return {
                data: r.branch(
                    con_merge('data_source').eq(""),
                    "",
                    r.db('welfare_common').table(con_merge('data_source')).merge(function (com_map) {
                        return {
                            id: com_map('id'),
                            name: com_map(con_merge('data_source').add('_name'))
                        }
                    }).coerceTo('array')
                        .merge(function (data_merge) {
                            return {
                                name: r.branch(
                                    con_merge('data_source').eq("department"),
                                    r.db('welfare_common').table('faculty').get(data_merge('faculty_id')).getField('faculty_name').add('/', data_merge('name')),
                                    data_merge('name')
                                )
                            }
                        })
                        .pluck('id', 'name')
                        .orderBy('name')
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
