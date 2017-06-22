var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var stream = require('stream');

var readExcel = function (nameFile, sheet) {
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../kmutnb-welfare/public/files/fund/' + nameFile);

    var file = workbook.Sheets;
    var sheetname = sheet;//"Sheet1";
    var startRow = 1;
    var fund_name = file[sheetname]['B' + startRow].v;
    var uname = file[sheetname]['B' + (startRow += 1)].v;
    var company = file[sheetname]['B' + (startRow += 1)].v;
    var monthly = file[sheetname]['B' + (startRow += 2)].v;
    var month = parseInt(monthly.split('/')[1]);
    var year = parseInt(monthly.split('/')[0]) - 543;
    var rowNo = startRow + 4;
    var datas = [];
    while (typeof file[sheetname]['B' + rowNo] !== "undefined") {
        var data = {
            emp_name: file[sheetname]['A' + rowNo].v,
            personal_id: Math.abs(file[sheetname]['B' + rowNo].v).toString(),
            fund_company: company,
            fund_month: month,
            fund_year: year,
            fund_name: fund_name,
            fund_uname: uname,
            policy_code: file[sheetname]['A' + (rowNo += 2)].v,
            policy_name: file[sheetname]['B' + rowNo].v,
            fund_date: file[sheetname]['B' + (rowNo += 1)].v,
            emp_con: file[sheetname]['D' + rowNo].v,
            emp_ear: file[sheetname]['E' + rowNo].v,
            com_con: file[sheetname]['F' + rowNo].v,
            com_ear: file[sheetname]['G' + rowNo].v,
            total: file[sheetname]['H' + rowNo].v,
            // date_created: r.now().inTimezone('+07'),
            // date_updated: r.now().inTimezone('+07')
        };
        datas.push(data);
        rowNo += 3;
    }
    return datas
}

exports.upload = function (req, res) {
    var r = req.r;
    // var params = req.params
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {

        var prefile = files.file[0];

        fs.readFile(prefile.path, function (err, data) {
            r.db('welfare').table('files').insert({
                name: prefile.originalFilename,//.split('.')[0] + '_' + new Date().getTime() + "." + prefile.originalFilename.split('.')[1],
                type: prefile.headers['content-type'],
                contents: data,
                timestamp: r.now().inTimezone('+07'),
                ref_path: req.headers['ref-path']
            })('generated_keys')(0)
                .do(function (file_id) {
                    return r.db('welfare').table('document_file').insert({
                        file_id: file_id,
                        file_status: true,
                        date_upload: r.now().inTimezone('+07'),
                        date_update: r.now().inTimezone('+07')
                    })
                })
                .run().then(function (result) {
                    res.json(result);
                }).catch(function (err) {
                    res.json(err);
                })
        });
    });
}
exports.downloadFile = function (req, res) {
    var r = req.r;
    r.db('welfare').table('document_file').getAll(req.params.id, { index: 'id' })
        .eqJoin('file_id', r.db('welfare').table('files')).getField('right')
        // r.db('welfare').table('files').get(req.params.id)
        .run()
        .then((result) => {
            // res.json(result[0])
            // res.writeHead(200, {
            //     'Content-Type': result.type,
            //     'Content-Length': result.contents.length,
            //     'Content-Disposition': 'inline; filename=' + result.name //ชื่อเป็น ภาษาไทยจะไม่สามารถเขียนออกมาได้
            // });
            // //inline แสดง show ไฟล์
            // //attachment โหลดไฟล์

            // var bufferStream = new stream.PassThrough();
            // bufferStream.end(result.contents);
            // bufferStream.pipe(res);

            fs.writeFile('./public/files/fund/' + result[0].name, result[0].contents, ['utf8'], (err) => {
                if (err) {
                    return console.log(err);
                }
                else {
                    console.log("The file was saved!");
                    res.json(result);
                }
            })
            // .on('close', function () {
            //     console.log("The file was saved!");
            //     res.json(result);
            // })

        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}
exports.getfile = function (req, res) {
    var datas = readExcel(req.params.name, req.params.sheet);
    res.json(datas);
}
exports.insert = function (req, res) {
    var r = req.r;
    var datas = readExcel(req.body.name, req.body.sheet);
    var month = datas[0].fund_month;
    var year = datas[0].fund_year;
    var mergeEmp = r.expr(datas)
        .merge(function (m) {
            var emp = r.db('welfare').table('employee').getAll(m('personal_id'), { index: 'personal_id' })
                .filter({ active_name: "ทำงาน" });
            return r.branch(emp.count().eq(0),
                {},
                emp.merge(function (m2) {
                    return { emp_id: m2('id') }
                }).without('id')(0)
            )
        });
    r.db('welfare').table('history_fund').getAll([year, month], { index: 'yearMonth' }).delete()
        .do(function (d) {
            return r.db('welfare').table('history_fund').insert(mergeEmp)
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.getSheets = function (req, res) {
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../kmutnb-welfare/public/files/fund/'+req.params.name);
    var file = workbook.Sheets;
    var sheets = [];
    for (var sheet in file) {
        sheets.push(sheet);
    }
    res.json(sheets);
}