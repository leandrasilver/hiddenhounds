'use strict';

// Main JS

// Single global object

var hounds = {};

// Empty array for random numbers to be pushed into
hounds.uniqueRandoms = [];

// Make a unique random number that doesn't repeat
hounds.makeUniqueRandom = function () {
	if (!hounds.uniqueRandoms.length) {
		for (var i = 1; i <= 16; i++) {
			hounds.uniqueRandoms.push(i);
		}
	}
	var index = Math.floor(Math.random() * hounds.uniqueRandoms.length);
	var val = hounds.uniqueRandoms[index];
	hounds.uniqueRandoms.splice(index, 1);
	return val;
};

hounds.randomizeImages = function () {
	for (var i = 0; i < 16; i++) {
		var randomNumber = hounds.makeUniqueRandom();
		$(".container ul").append("<li class='imageItem imageItem" + randomNumber + "'><img src='../../images/muffin/muffin" + randomNumber + ".jpg'></li>");
	}
	var randomNumber = hounds.makeUniqueRandom();
	$('.imageItem' + randomNumber).replaceWith("<li class='animal'><img src='../../images/muffin/cha.jpg'></li>");
};

hounds.init = function () {

	hounds.randomizeImages();
	// preloader code
	$(window, ".results").load(function () {
		$('.preloader').fadeOut('slow');
	});

	var $loading = $('.preloader').hide();
	$(document).ajaxStart(function () {
		$loading.show();
	}).ajaxStop(function () {
		$loading.hide();
	});

	$('.animal').on('click', function () {
		alert('Bam you got the hound');
	});
	$('.imageItem').on('click', function () {
		alert('Bam you lost points, this isn\'t a hound');
	});
};

$(function () {
	hounds.init();

	// SmoothScroll on anchor tags
	$('a').smoothScroll();
});