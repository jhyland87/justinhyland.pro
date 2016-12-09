var _ = require('lodash')
var arr = require('../b')
var $ = require('jquery')

console.debug('index-b.js loaded')

var sum = _.reduce(arr, function(memo, val){
    return memo + val
}, 0)

console.log(sum)
