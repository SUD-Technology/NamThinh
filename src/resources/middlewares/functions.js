const express = require('express');

exports.normalizeDate = function (date) {
	var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

exports.normalizeDate_vi = function(date) {
	let day = parseInt(date.getDate());
	let month = parseInt(date.getMonth());
	let year = date.getFullYear();

	if(day < 10) {
		day = '0' + day;
	}

	if(month < 10) {
		month = '0' + month;
	}

	return day + "-" + month + "-" + year;
}

