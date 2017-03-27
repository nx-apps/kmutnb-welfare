var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var stream = require('stream');
exports.downloadFile = function (req, res) {
    var r = req.r;
    var params = req.params;
    // console.log(params)

    r.db('welfare').table('files').get(params.id)
        .run().then(function (result) {
            res.writeHead(200, {
                'Content-Type': result.type,
                'Content-Length': result.contents.length,
                //'Content-Disposition':'filename='+cursor.name
                'Content-Disposition': 'attachment; filename=' + result.name
            });

            var bufferStream = new stream.PassThrough();
            bufferStream.end(result.contents);
            bufferStream.pipe(res);

        }).catch(function (err) {
            res.json(err);
        })

}

exports.uploadFile = function (req, res) {
    var r = req.r;
    var params = req.params;
    console.log(req.body);
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {

        var prefile = files.file[0];

        fs.readFile(prefile.path, function (err, data) {
            // console.log(r);
            r.db('welfare').table('files').insert({
                name: prefile.originalFilename.split('.')[0] + '_' + new Date().getTime() + "." + prefile.originalFilename.split('.')[1],
                type: prefile.headers['content-type'],
                contents: data,
                timestamp: new Date(),
                ref_path: req.headers['ref-path']
            })('generated_keys')(0)
                .do(function (file_id) {
                    return r.db('welfare').table('document_file').insert({
                        file_id: file_id,
                        file_status: true,
                        emp_id: params.emp_id,
                        welfare_id: req.headers['welfare-id'],
                        doc_status: false,
                        date_upload: new Date(),
                        date_update: new Date()
                    })
                })
                .run().then(function (result) {
                    res.json(result);
                }).catch(function (err) {
                    res.json(err);
                })
        });
    });

    // res.json({ec:'01252'});

}

exports.uploadFileadmin = function (req, res) {
    var r = req.r;
    var params = req.params;
    console.log(req.body);
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {

        var prefile = files.file[0];

        fs.readFile(prefile.path, function (err, data) {
            // console.log(r);
            r.db('welfare').table('files').insert({
                name: prefile.originalFilename.split('.')[0] + '_' + new Date().getTime() + "." + prefile.originalFilename.split('.')[1],
                type: prefile.headers['content-type'],
                contents: data,
                timestamp: new Date(),
                ref_path: req.headers['ref-path']
            })('generated_keys')(0)
                .do(function (file_id) {
                    return r.db('welfare').table('document_file').insert({
                        file_id: file_id,
                        file_status: true,
                        emp_id: params.emp_id,
                        welfare_id: req.headers['welfare-id'],
                        doc_status: true,
                        date_upload: new Date(),
                        date_update: new Date()
                    })
                })('generated_keys')(0)
                .do((doc_id) => {
                    return {
                        x: r.db('welfare').table('history_welfare').get(params.history_id).update((id) => {
                            return {
                                document_ids: id('document_ids').append(doc_id)
                            }
                        })
                    }
                })
                .run().then(function (result) {
                    res.json(result);
                }).catch(function (err) {
                    res.json(err);
                })
        });
    });
}