exports.upload = function (req, res) {
    var r = req.r;
    // var params = req.params
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {

        var prefile = files.file[0];

        fs.readFile(prefile.path, function (err, data) {
            // console.log(r);
            r.db('welfare').table('files').insert({
                name: prefile.originalFilename.split('.')[0] + '_' + new Date().getTime() + "." + prefile.originalFilename.split('.')[1],
                type: prefile.headers['content-type'],
                contents: data,
                timestamp: r.now().inTimezone('+07'),
                ref_path: req.headers['ref-path']
            })('generated_keys')(0)
                .do(function (file_id) {
                    return r.db('welfare').table('document_file').insert({
                        file_id: file_id,
                        file_status: true,
                        emp_id: params.emp_id,
                        welfare_id: req.headers['welfare-id'],
                        doc_status: false,
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
exports.getfile = function (req, res) {
    //Read file here.
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../kmutnb-welfare/app/files/sso.xlsx');

    var file = workbook.Sheets;
    // var sheets = [];
    // for(var sheet in file){
    //     sheets.push(sheet);
    // }
    // res.json(sheets);
    var sheetname = "ทะเบียน";
    var rowNo = 4;
    var datas = [];
    var faculty_name = "";
    while (typeof file[sheetname]['B' + rowNo] !== "undefined" || typeof file[sheetname]['C' + rowNo] !== "undefined") {

        if (typeof file[sheetname]['B' + rowNo] !== "undefined") {
            var data = {};
            data.personal_id = file[sheetname]['B' + rowNo].v.replace(/-/g, "").toString();
            var pid = ''
            //data.personal_id = file[sheetname]['B' + rowNo].v.replace("-", "").toString();
            //แก้โดยการตัด - ออกทั้งหมดให้แล้ว
            data.personal_id = file[sheetname]['B' + rowNo].v.split('-').join("")
            // if (typeof file[sheetname]['C' + rowNo] === "undefined") {
            //     data.prefix_name = "";
            // } else {
            //     data.prefix_name = file[sheetname]['C' + rowNo].v;
            // }
            data.prefix_name = file[sheetname]['C' + rowNo].v;
            // if (typeof file[sheetname]['D' + rowNo] === "undefined") {
            //     data.first_name = "";
            // } else {
            //     data.first_name = file[sheetname]['D' + rowNo].v;
            // }
            data.first_name = file[sheetname]['D' + rowNo].v;
            // if (typeof file[sheetname]['E' + rowNo] === "undefined") {
            //     data.last_name = "";
            // } else {
            //     data.last_name = file[sheetname]['E' + rowNo].v;
            // }
            data.last_name = file[sheetname]['E' + rowNo].v;
            // if (typeof file[sheetname]['F' + rowNo] === "undefined") {
            //     data.hospital = "";
            // } else {
            //     data.hospital = file[sheetname]['F' + rowNo].v;
            // }
            data.hospital = file[sheetname]['F' + rowNo].v;
            // if (typeof file[sheetname]['G' + rowNo] === "undefined") {
            //     data.issued_date = "";
            // } else {
            //     data.issued_date = file[sheetname]['G' + rowNo].w;
            // }
            data.issued_date = new Date(file[sheetname]['G' + rowNo].w);
            // if (typeof file[sheetname]['H' + rowNo] === "undefined") {
            //     data.expired_date = "";
            // } else {
            //     data.expired_date = file[sheetname]['H' + rowNo].w;
            // }
            data.expired_date = new Date(file[sheetname]['H' + rowNo].w);
            data.faculty_name = faculty_name;
            // data.date_created = r.now().inTimezone('+07'),
            // data.date_updated = r.now().inTimezone('+07'),

            datas.push(data);
            // res.json(data);
        } else {
            faculty_name = file[sheetname]['C' + rowNo].v;
        }
        rowNo += 1;
    }
    // r.db('welfare').table('history_sso').insert(datas)

    //     .run()
    //     .then(function (result) {
    // res.json(result);
    // })
    res.json(datas);
}