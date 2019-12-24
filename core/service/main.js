var request = require('request')
var fs = require("fs")
var express = require('express')
var router = express.Router()
var reservation = require('./reservation/main')
router.use('/reservation', reservation)
module.exports = router