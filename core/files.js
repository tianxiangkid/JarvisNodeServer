const fs = require('fs')
const path = require('path')
var express = require('express')
var router = express.Router()
var mime = require('./mime')
var url = require('url')

router.get('/', function (req, res, next) {
    var filePath = path.join(__dirname + '/../public/files')
    // if (req.url.length === 1) {
        listFiles(filePath, req, res, next)
    // } else {
    //     showFile(filePath, req, res, next)
    // }
})

function listFiles(filePath, req, res, next) {
    // 显示服务器文件
    fs.readdir(filePath, function (err, results) {
        if (err) {
            throw err
        }
        var files = []
        results.forEach(function (file) {
            if (fs.statSync(path.join(filePath, file)).isFile()) {
                files.push(file)
            }
        })
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
        res.render('files', {files: files, baseUrl: fullUrl})
    })
}

// function showFile(filePath, req, res, next) {
//     //url模块的parse方法 接受一个字符串，返回一个url对象,切出来路径
//     var file = filePath + req.url
//
//     //获取对应文件的文档类型
//     //我们通过path.extname来获取文件的后缀名。由于extname返回值包含”.”，所以通过slice方法来剔除掉”.”，
//     //对于没有后缀名的文件，我们一律认为是unknown。
//     var ext = path.extname(file)
//     ext = ext ? ext.slice(1) : 'unknown'
//
//     //未知的类型一律用"text/plain"类型
//     var contentType = mime[ext] || "text/plain"
//     fs.stat(file, (err, stats) => {
//         if (err) {
//             res.writeHead(404, {"content-type": "text/html"})
//             res.end("<h1>404 Not Found</h1>")
//         }
//         //没出错 并且文件存在
//         if (!err && stats.isFile()) {
//             // res.dowload(file)
//             res.writeHead(200, {"content-type": contentType})
//             //建立流对象，读文件
//             var stream = fs.createReadStream(filePath)
//             //错误处理
//             stream.on('error', function () {
//                 res.writeHead(500, {"content-type": contentType})
//                 res.end("<h1>500 Server Error</h1>")
//             })
//             //读取文件
//             stream.pipe(res)
//             //response.end();  这个地方有坑，加了会关闭对话，看不到内容了
//         }
//     })
// }

module.exports = router