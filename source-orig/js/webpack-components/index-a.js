var _ = require('lodash')
var arr = require('../a')
var $ = require('jquery')

console.debug('index-a.js loaded')

$(document).ready(function(){
	$('#gen-username').click(function(e){
		e.preventDefault()
		var $first = $('#first_name')
		var $last  = $('#last_name')

		var first = _.toLower( $first.val() )
		var last  = _.toLower( $last.val() )

		var username = first.substr(0,1) + last
		var email = first + '.' + last + '@linux.com'
		alert( 
			/*
			'First Name:\t' + _.upperFirst( first ) + '\n' +
			'Last Name:\t' 	+ _.upperFirst( last ) + '\n' +
			'E-Mail:\t\t' 	+ email.toLocaleLowerCase() + '\n' +
			'Username:\t' 	+ username.toLocaleLowerCase() 
			*/
			'First Name\t: ' + _.upperFirst( first ) + '\n' +
			'Last Name\t\t: ' 	+ _.upperFirst( last ) + '\n' +
			'E-Mail\t\t: ' 	+ email.toLocaleLowerCase() + '\n' +
			'Username\t\t: ' 	+ username.toLocaleLowerCase() 
		)
	})
})
var sum = _.reduce(arr, function(memo, val){
    return memo + val
}, 0)

console.log(sum)
