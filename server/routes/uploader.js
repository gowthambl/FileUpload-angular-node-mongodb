import multer from 'multer';
import path from 'path';
import FileModel from './../helpers/db/fileModel'
import mammoth from "mammoth";
import fs from 'fs';
var csvWriter = require('csv-write-stream')
// var writer = csvWriter();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.dirname(require.main.filename) + "/views/files")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[file.originalname.split('.').length - 2] +
            '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        console.log('vsdv', file);
        if (['csv'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            req.fileValidationError = 'Invalid File Extension';
            return callback(null, false, new Error('Invalid File Extension'));
        }
        callback(null, true);
    }
}).single('file');

export default class UploadFile {
    static Upload(req, res) {
        upload(req, res, () => {
            if (req.fileValidationError) {
                res.status({ response: "Error", msg: "Invalid File format", data: req.file })
            } else {
                const fileDetails = {
                    fileName: req.file.filename,
                    originalName: req.file.originalname,
                    date: new Date().toDateString(),
                    size: req.file.size,
                    type: req.file.path.split(".")[req.file.path.split(".").length - 1],
                    path: req.file.path
                }
                UploadFile.saveFile(fileDetails).then(data => {
                    res.status(200).send({ response: "sucess", msg: "File has been uploaded successfully!", data: fileDetails });
                })
            }
        })
    }

    static list(req, res) {
        return FileModel.find({}).then(data => {
            res.status(200).send({ list: data });
        })
    }

    static saveFile(fileDetails) {
        return FileModel(fileDetails).save().then(result => {
            return FileModel.find({});
        })
    }

    static listing(req, res) {
        console.log(" req.query.id", req.query.id)
        FileModel.findOne({ _id: req.query.id }).then(data => {
            if (data) {
                let filePath = data.path;
                let csv = fs.readFileSync(filePath, 'utf8');
                let lines = csv.split('\n');
                var result = [];
                var headers = lines[0].split(",");
                for (var i = 0; i < headers.length; ++i) {
                    headers[i] = headers[i].replace(/(\r\n|\n|\r)/gm, "")
                }
                for (var i = 1; i < lines.length; i++) {
                    var obj = {};
                    var cl = lines[i].split(',');
                    for (var j = 0; j < headers.length; j++) {
                        obj[headers[j]] = cl[j] ? cl[j].replace(/(\r\n|\n|\r)/gm, "") : '';
                    }
                    result.push(obj)
                }
                let t = result
                let list = {
                    result: result,
                    headers: headers
                }
                res.status(200).send(list);

            } else {
                let list = {
                    result: [],
                    headers: []
                }
                res.status(201).send({ msg: "No Data Found" }, list);
            }
        })


    }
    static updateCsv(req, res) {
        var header = req.body.csv_headers;
        var cellData = req.body.celldata;
        var csvid = req.body.csvid;
        FileModel.findOne({ _id: csvid }).then(data => {
            let filePath = data.path;
            for (var i = 0; i < header.length; ++i) {
                header[i] = header[i].replace(/(\r\n|\n|\r)/gm, "")
            }
            let writer = csvWriter({ headers: header });
            writer.pipe(fs.createWriteStream(filePath))
            for (let j = 0; j < cellData.length; j++) {
                writer.write(cellData[j]);
            }
            writer.end();
            res.status(200).send({ msg: "Data has been updated" });
        });
    }
}