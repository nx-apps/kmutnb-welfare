var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
var stream = require('stream');
var arr_month = ['', 'ม.ค.', 'ก.พ.', 'มี.ค', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
var tz = 'T00:00:00+07:00';
var readExcel = function (nameFile, sheet) {
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../kmutnb-welfare/public/files/sso/' + nameFile);

    var file = workbook.Sheets;
    var sheetname = sheet;//"ทะเบียน";
    var rowNo = 4;
    var datas = [];
    var faculty_name = "";
    while (typeof file[sheetname]['B' + rowNo] !== "undefined" || typeof file[sheetname]['C' + rowNo] !== "undefined") {

        if (typeof file[sheetname]['B' + rowNo] !== "undefined" && !isNaN(file[sheetname]['B' + rowNo].v.replace(/-/g, ""))) {
            var data = {};
            data.personal_id = file[sheetname]['B' + rowNo].v.replace(/-/g, "").toString();
            var pid = ''
            data.personal_id = file[sheetname]['B' + rowNo].v.split('-').join("")
            data.prefix_name = file[sheetname]['C' + rowNo].v;
            data.first_name = file[sheetname]['D' + rowNo].v;
            data.last_name = file[sheetname]['E' + rowNo].v;
            data.hospital = file[sheetname]['F' + rowNo].v;
            var dates = file[sheetname]['G' + rowNo].w;
            dates = dates.split(' - ');
            for (var i = 0; i < dates.length; i++) {
                var date = dates[i].split(" ");
                dates[i] = (parseInt(date[2]) - 543) + '-' + arr_month.indexOf(date[1]) + '-' + parseInt(date[0]) + tz;
            }
            data.issued_date = r.ISO8601(dates[0]);//new Date(file[sheetname]['G' + rowNo].w);
            data.expired_date = r.ISO8601(dates[1]);//new Date(file[sheetname]['H' + rowNo].w);
            // data.faculty_name = faculty_name;
            // data.date_created = r.now().inTimezone('+07'),
            // data.date_updated = r.now().inTimezone('+07'),

            datas.push(data);
            // res.json(data);
        } else {
            faculty_name = file[sheetname]['C' + rowNo].v;
        }
        rowNo += 1;
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

            fs.writeFile('./public/files/sso/' + result[0].name, result[0].contents, ['utf8'], (err) => {
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
    datas.map((item) => {
        return item.date_created = new Date(),
            item.date_updated = new Date()
    })
    // res.json(datas);
    r.db('welfare').table('history_sso').insert(datas)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err)
        })

    // r.db('welfare').table('test_sso').insert(datas)
    //     .run()
    //     .then(function (result) {
    //         res.json(result);
    //     })
    //     .catch(function (err) {
    //         res.status(500).json(err)
    //     })
}
exports.getSheets = function (req, res) {
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../kmutnb-welfare/public/files/sso/' + req.params.name);
    var file = workbook.Sheets;
    var sheets = [];
    for (var sheet in file) {
        sheets.push(sheet);
    }
    res.json(sheets);
}
exports.genSso = function (req, res) {
    var r = req.r

    r.db('welfare').table('employee')
        .pluck('personal_id', 'prefix_name', 'firstname', 'lastname', 'faculty_name')

        // .group('faculty_name').ungroup()
        .orderBy('faculty_name')
        .map(function (ma) {
            return {
                SSO01รหัสบัตรประชาชน: ma('personal_id'),
                SSO02คำนำหน้า: ma('prefix_name'),
                SSO03ชื่อ: ma('firstname'),
                SSO04นามสกุล: ma('lastname'),
                SSO05คณะ: ma('faculty_name'),
                SSO06โรงพยาบาล: '',
                SSO07วันที่ออกบัตร: '',
                SSO08วันหมดอายุ: ''
            }
        })

        .run().then(function (data) {
            // res.json(data);
            const XLSX = require('xlsx');
            /* create workbook & set props*/
            const wb = { SheetNames: [], Sheets: {} };
            // // wb.Props = {
            // //     Title: "Stats from app",
            // //     Author: "John Doe"
            // // };
            // /*create sheet data & add to workbook*/
            // for (var prop in data) {
            var ws = XLSX.utils.json_to_sheet(data);
            var ws_name = 'sso'
            XLSX.utils.book_append_sheet(wb, ws, ws_name);
            // }
            // /* create file 'in memory' */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            var filename = "genfile.xlsx";
            res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
            res.type('application/octet-stream');
            res.send(wbout);
        })

    // personal_id
    // prefix_name
    // first_name
    // last_name
    // faculty_name
    // hospital
    // issued_date
    // expired_date
}
exports.downloadsso = function (req, res) {
    //Read file here.
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../kmutnb-welfare/app/files/genfile.xlsx');

    var file = workbook.Sheets;
    // var sheets = [];
    // for(var sheet in file){
    //     sheets.push(sheet);
    // }
    // res.json(file);
    var sheetname = "sso";
    var rowNo = 2;
    var datas = [];
    var faculty_name = "";
    while (typeof file[sheetname]['A' + rowNo] !== "undefined") {
        var data = {
            personal_id: file[sheetname]['A' + rowNo].v,
            prefix_name: file[sheetname]['B' + rowNo].v,
            firstname: file[sheetname]['C' + rowNo].v,
            lastname: file[sheetname]['D' + rowNo].v,
            faculty_name: file[sheetname]['E' + rowNo].v,
            hospital: file[sheetname]['F' + rowNo].v,
            issued_date: file[sheetname]['G' + rowNo].v,
            expired_date: file[sheetname]['H' + rowNo].v
        };
        datas.push(data);
        rowNo += 1;
    }
    res.json(datas)

    // res.json(datas[0]);
    // r.expr(datas)
    //     .run()
    //     .then(function (result) {
    //         res.json(result)
    //     })
    // r.db('welfare').table('history_sso').insert(datas)
    // .run()
    // .then(function (result) {
    //     res.json(result);
    // })

}
var checkLogic = function (select, row) {
    return r.branch(
        select('logic').eq('=='),
        row(select('field_name')).eq(select('value')),
        select('logic').eq('>'),
        row(select('field_name')).gt(select('value')),
        select('logic').eq('>='),
        row(select('field_name')).ge(select('value')),
        select('logic').eq('<'),
        row(select('field_name')).lt(select('value')),
        select('logic').eq('<='),
        row(select('field_name')).le(select('value')),
        row(select('field_name')).ne(select('value'))
    )
};
var getEmployee = function (emp, con) {
    var countCon = con.count();
    return r.branch(countCon.gt(1),
        con.reduce(function (left, right) {
            return r.branch(left.hasFields('data'),
                {
                    data: left('data').filter(function (f) {
                        return checkLogic(right, f)
                    })
                },
                {
                    data: emp.filter(function (f) {
                        return checkLogic(left, f)
                    }).filter(function (f) {
                        return checkLogic(right, f)
                    })
                }
            )
        })('data'),
        countCon.eq(1),
        emp.filter(function (f) {
            return checkLogic(con(0), f)
        }),
        emp
    )
};
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
var arr_month = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
