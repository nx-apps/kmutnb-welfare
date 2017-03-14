var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var stream = require('stream');

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
exports.listFile = function (req, res) {
    var r = req.r;
    r.db('welfare').table('files').without('contents')
        .run()
        .then(function (result) {
            res.json(result);
        })
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
                .do((doc_id)=>{
                    return {
                        x:r.db('welfare').table('history_welfare').get(params.history_id).update((id)=>{
                            return {
                                document_ids:id('document_ids').append(doc_id)
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
exports.listFilePath = function (req, res) {
    var r = req.r;
    var params = req.params;
    console.log(req.query);
    // console.log(req.query.welfare_id);
    r.db('welfare').table('document_file').getAll(req.query.emp_id,{index:'emp_id'})
        .filter({welfare_id: req.query.welfareId, file_status: true,doc_status:false })
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
        .filter({ref_path: req.query.refPath })
        .orderBy(r.desc('date_upload'))
        .run()
        .then(function (result) {
            res.json(result);
        })
        .error(function (err) {
            res.json(err);
        })
}
exports.adminlistFilePath = function (req, res) {
    var r = req.r;
    var params = req.params;
    console.log('params=>',params);
    r.db('welfare').table('history_welfare').get(params.id)
    .merge((doc_id)=>{
       return {
           files:doc_id('document_ids').map((file)=>{
           return { 
               file:r.db('welfare').table('document_file').get(file).merge((me_file)=>{
               return r.db('welfare').table('files').get(me_file('file_id'))
                    })
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
               .without('contents')
           }
       })
       }
    })
    .getField('files')
    .getField('file')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .error(function (err) {
            res.json(err);
        })
}
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
exports.deleteFile = function (req, res) {
    var r = req.r;
    var params = req.params;
    r.db('welfare').table('document_file').getAll(params.id, { index: 'file_id' })
        .update({ file_status: false, date_update: new Date() })
        .run().then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.json(err);
        })

}
// exports.listFileDelete = function (req, res) {
//     var r = req.r;
//     var params = req.params;
//     r.db('wto2').table('document_file')
//         .eqJoin('file_id', r.db('files').table('files')).without({ right: ["id", "contents"] }).zip()
//         // .eqJoin('seller_id', r.db('external').table('seller')).pluck('left', { right: 'seller_id' }).zip()
//         .merge(function (m) {
//             return { timestamp: m('timestamp').toISO8601().split("T")(0) }
//         })
//         .merge(function (row) {
//             return {
//                 name: row('name').add(' | ')
//                     .add(row('timestamp'))
//                 // .add('-')
//                 // .add(row('date_upload').month().coerceTo('string'))
//                 // .add('-')
//                 // .add(row('date_upload').year().coerceTo('string'))
//                 ,
//                 progress: 100, complete: true
//             }
//         })
//         .filter({ request_id: params.request_id, file_status: false })
//         .orderBy(r.desc('date_update'))
//         .limit(5)
//         .run()
//         .then(function (result) {
//             res.json(result);
//         })
//         .error(function (err) {
//             res.json(err);
//         })
// }
// exports.recoveryFile = function (req, res) {
//     var r = req.r;
//     var params = req.params;
//     console.log(params.file_id+'mmm');
//     r.db('external').table('document_file').getAll(params.file_id, { index: 'file_id' }).update({ file_status: true, date_update: new Date() })
//         .run().then(function (result) {
//             res.json(result);
//         }).catch(function (err) {
//             res.json(err);
//         })
// }