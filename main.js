console.log('====================================');
console.log('Jarvis Here');
console.log('====================================');

var express = require('express');
var request = require('request');
var fs = require("fs")
var app = express();
app.get('/channels.json', function (req, res) {
    var baseUrl = 'http://ivi.bupt.edu.cn'
    var channelsJson;
    request.get(baseUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body);
            try {
                var array = body.match(new RegExp("<div class=\"2u.*\">(.|\n)*?</div>", 'g'));
                // console.log(array);
                var channels = new Array();
                for (let index = 0; index < array.length; index++) {
                    try {
                        const tmp = {
                            "title": array[index].match(new RegExp("<p>(.*)</p>"))[1],
                            "url": array[index].match(new RegExp("href=\"(.*?)\".*移动端"))[1]
                        };
                        if (tmp.title && tmp.url) {
                            channels.push({
                                "title": tmp.title,
                                "url": baseUrl + tmp.url
                            })
                        }
                    } catch (error) {
                    }
                }
                if (channels) {
                    channelsJson = {
                        "channels": channels
                    }
                    console.log(channelsJson);
                }
            } catch (error) {
                console.log(error);
            }
            if (!channelsJson) {
                channelsJson = fs.readFileSync('channels_bak.json', 'utf8')
            }
            res.send(channelsJson);
        }
    });
});
app.get('/', function (req, res) {
    res.send('Jarvis Here');
});



var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})