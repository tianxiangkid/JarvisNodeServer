var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Jarvis Here'})
})
var bodyParser = require('body-parser')
var upload = require('multer')({
    dest: './public/files/', //指定文件上传后存放的位置
})

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.post('/uploads', upload.any(), function (req, res) {
    console.log(req.fields)
    console.log(req.files) // 此时可以在req.files 已上传内容的信息了
    console.log(req.body)
})


module.exports = router
