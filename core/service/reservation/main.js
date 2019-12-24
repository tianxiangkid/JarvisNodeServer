const request = require('request')
var express = require('express')
var stringUtil = require('util')
var bodyParser = require('body-parser')//解析,用req.body获取post参数
var router = express.Router()
var properties = require("properties")
router.use('./', bodyParser.json())
router.use('./', bodyParser.urlencoded({extended: false}))
var queryString = require('querystring')
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.MYSQL_IP,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'weixin_app',
})

const expressJwt = require('express-jwt')
router.use("./", expressJwt({
    secret: 'secret12345',  // 签名的密钥 或 PublicKey
}).unless({
    path: ['/onLogin'],  // 指定路径不经过 Token 解析
}))
properties.parse("properties.properties", {path: true}, function (error, obj) {
    if (error) {
        return console.error(error)
    }
    console.log(obj)
    //{ a: 1, b: 2 }
})
router.post('/onLogin', (app_req, app_res) => {
    console.log(app_req.body)
    var url = stringUtil.format("https://api.weixin.qq.com/sns/jscode2session" +
        "?appid=%s" +
        "&secret=%s" +
        "&js_code=%s" +
        "&grant_type=authorization_code",
        process.env.WX_APP_ID, process.env.WX_APP_SECRET, app_req.body.code)

    try {
        request(url, {json: true}, (wx_err, wx_res, wx_body) => {
            if (wx_err) {
                return console.log(wx_err)
            }
            try {
                if (wx_body.errcode === 0) {
                    app_res.json({
                        status: 0,
                        userInfo: reqUserInfo(wx_res),
                    })
                } else {
                    app_res.json({
                        status: 1401,
                        "error": wx_res.body,
                    })
                }
            } catch (e) {
                app_res.json({
                    status: 1500,
                    "error": e,
                })
            }
        })
    } catch (e) {
        app_res.json({
            status: 1500,
            "error": e,
        })
    }
})

// openid	string	用户唯一标识
// session_key	string	会话密钥
// unionid	string	用户在开放平台的唯一标识符，在满足 UnionID 下发条件的情况下会返回，详见 UnionID 机制说明。
// errcode	number	错误码
// errmsg	string	错误信息
function reqUserInfo(wxRes) {
    connection.connect()
    var sql = 'SELECT * FROM user WHERE openid = "' + wxRes.openid + '"'
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('查询失败 err: ' + err)
        }
        //转换json
        var message = JSON.stringify(result)
        message = JSON.parse(message)
        connection.end()
        const token = 'Bearer ' + expressJwt.sign(
            {
                _id: wxRes.openid,
                role: message.role,
            },
            'secret12345',
            {
                expiresIn: 3600 * 24 * 3,
            },
        )
        return {
            status: 'ok',
            data: {
                role: message.role,
                token: token,
            },
        }
    })

}

module.exports = router