var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var stream = require('stream');
exports.listFilePath = function (req, res) {
    var r = req.r;
    var params = req.params;
    // console.log(req.query);
    // console.log(req.query.welfare_id);
    r.db('welfare').table('document_file').getAll(req.query.emp_id, { index: 'emp_id' })
        .filter({ welfare_id: req.query.welfareId, file_status: true, doc_status: false })
        .eqJoin('file_id', r.db('welfare').table('files')).without({ right: ["id", "contents"] }).zip()
        .merge(function (m) {
            return { timestamp: m('timestamp').toISO8601().split("T")(0) }
        })
        .merge(function (row) {
            return {
                name: row('name').add(' | ')
                    .add(row('timestamp'))
                ,
                progress: 100, complete: true
            }
        })
        .filter({ ref_path: req.query.refPath })
        .orderBy(r.desc('date_upload'))
        .run()
        .then(function (result) {
            res.json(result);
        })
        .error(function (err) {
            res.json(err);
        })
}
exports.deleteFile = function (req, res) {
    var r = req.r;
    var params = req.params;
    r.db('welfare').table('document_file').getAll(params.id, { index: 'file_id' })
        .update({ file_status: 'delete', date_update: new Date().toISOString() })
        .run().then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.json(err);
        })

}