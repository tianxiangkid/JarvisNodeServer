console.log('====================================')
console.log('Jarvis Here')
console.log('====================================')
var request = require('request')
var fs = require("fs")
var express = require('express')
var router = express.Router()
const multer = require('multer')
const multerService = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/files')
        },
        filename: function (req, file, cb) {
            //file.originalname上传文件的原始文件名
            // var changedName = (new Date().getTime()) + '-' + file.originalname
            // cb(null, changedName)
            cb(null, file.originalname)
        },
    }),
})
router.use(multerService.any())
let singleUpload = multerService.single('singleFile')
router.post('/upload', (req, res) => {
    console.log(req.files)
    singleUpload(req, res, (err) => {
        if (!!err) {
            console.log(err.message)
            res.json({
                code: '2000',
                type: 'single',
                originalname: '',
                msg: err.message,
            })
            return
        }
        if (!!req.file) {
            res.json({
                code: '0000',
                type: 'single',
                originalname: req.file.originalname,
                msg: '',
            })
        } else {
            res.json({
                code: '1000',
                type: 'single',
                originalname: '',
                msg: '',
            })
        }
    })
})

router.get('/channels.json', function (req, res) {
    var baseUrl = 'http://ivi.bupt.edu.cn'
    var channelsJson
    request.get(baseUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // console.log(body);
            try {
                var array = body.match(new RegExp("<div class=\"2u.*\">(.|\n)*?</div>", 'g'))
                // console.log(array);
                var channels = []
                for (let index = 0; index < array.length; index++) {
                    try {
                        const tmp = {
                            "title": array[index].match(new RegExp("<p>(.*)</p>"))[1],
                            "url": array[index].match(new RegExp("href=\"(.*?)\".*移动端"))[1],
                        }
                        if (tmp.title && tmp.url) {
                            channels.push({
                                "title": tmp.title,
                                "url": baseUrl + tmp.url,
                            })
                        }
                    } catch (error) {
                    }
                }
                if (channels) {
                    channelsJson = {
                        "channels": channels,
                    }
                    console.log(channelsJson)
                }
            } catch (error) {
                console.log(error)
            }
            if (!channelsJson) {
                channelsJson = fs.readFileSync('channels_bak.json', 'utf8')
            }
            res.send(channelsJson)
        }
    })
})

String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

module.exports = router