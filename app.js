var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const proxy = require('http-proxy-middleware')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var files = require('./core/files')
var api = require('./core/api')
var service = require('./core/service/main')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/files', files)

app.use('/api', api)
app.use('/service', service)
app.use('/channels.json', function (req, res) {
    res.redirect('/api/channels.json')
})

// app.use('/upload', proxy({target: "http://localhost:3000", changeOrigin: true}))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

var server = app.listen(8081, '0.0.0.0', function () {
    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", 'localhost', port)

})

module.exports = app
