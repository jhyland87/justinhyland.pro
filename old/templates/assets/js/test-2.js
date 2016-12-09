var _ = require('lodash')
var arr =  [1, 2, 3]
var sum = _.reduce(arr, function(memo, val){
    return memo + val
}, 0)

console.log(sum)