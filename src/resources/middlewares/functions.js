const express = require('express');

exports.normalizeDate = function (date) {
	var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}