'use strict';

// Main JS

// Single global object

var hounds = {};

hounds.game = {
	level: 1,
	score: 0,
	levelPhotos: [{
		food: 'icecream',
		animal: 'kitten'
	}, {
		food: 'chickenwings',
		animal: 'doodle'
	}, {
		food: 'icecream',
		animal: 'kitten'
	}, {
		food: 'chickenwings',
		animal: 'doodle'
	}, {
		food: 'icecream',
		animal: 'kitten'
	}, {
		food: 'chickenwings',
		animal: 'doodle'
	}]
};

// Make a unique random number that doesn't repeat between 1 and 16
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

// Images for the begin screen
hounds.imagePlaceHolders = function () {
	// Make a call to the unsplash api to get 16 random images
	$.ajax({
		url: 'https://api.unsplash.com/photos/random/?client_id=96d765e7378978f9e9c06ee63116a6edb729ac3e912fe048dd7567d859339850',
		dataType: 'json',
		method: 'GET',
		data: {
			collections: 728,
			w: 150,
			h: 150,
			count: 16
		}
		// then loop through the array and put the urls in the list items
	}).then(function (res) {
		var onlyTheUrls = res.map(function (res) {
			return res.urls.custom;
		});
		onlyTheUrls.forEach(function (value) {
			$(".container ul").append("<li class='imageItem starterLi'><img src=" + value + " alt='A random dog image for the game'></li>");
		});
		$('.begin').show();
		$('.modalBackground').fadeIn();
	});
};

// Randomize the images that appear on screen
hounds.randomizeImages = function (food, animal) {
	hounds.uniqueRandoms = [];
	$('.imageItem, .animal').remove();
	for (var i = 0; i < 16; i++) {
		var randomNumber = hounds.makeUniqueRandom();
		$(".container ul").append("<li class='imageItem imageItem" + randomNumber + "'><img src='images/" + food + "/" + food + "" + randomNumber + ".jpg' alt='A tasty chocolate chip muffin that looks slightly like a dog'><div class='feedback'></div></li>");
	};
	var randomNumber = hounds.makeUniqueRandom();
	var animalNum = Math.floor(Math.random() * 3) + 1;
	$('.imageItem' + randomNumber).replaceWith("<li class='animal'><img src='images/" + food + "/" + animal + "" + animalNum + ".jpg' alt='A puppy that resembles a yummy chocolate chip muffin'><div class='feedback'></div></li>");
	// make sure to remove the added class of a fast animation as nothing was clicked yet by the user.
	$('.imageItem img, .animal img').removeClass('jsFastAnimation');
};

// Events on click of list items
hounds.events = function (score, level) {
	var seconds = 1;
	hounds.countdown = window.setInterval(function () {
		// Update the span text with the number of seconds
		$('.secondsLeft').text(seconds);
		// Increase the number of seconds by 1 
		seconds = seconds + 1; // or seconds;
		// Stop the timer if it lasts over 50 seconds
		if (seconds >= 50) {
			$('.timer').text("Timed Out, Try again!");
			clearInterval(hounds.countdown);
			setTimeout(function () {
				$('.begin, .next').hide();
				$('.restart').show();
				$('.share').addClass('jsFlexShow');
				var tweet = 'https://twitter.com/intent/tweet?text=I got ' + hounds.game.score + ' points! Try Hidden hounds yourself at www.leandrasilver.com/hiddenHounds %23hiddenhounds';
				document.getElementById("twitter-button").setAttribute("href", tweet);
				$('.modalBackground').fadeIn();
			}, 500);
		}
	}, 1000);

	// Need a counter so that the user doesn't press the animal multiple times
	var counter = 0;

	// On click of the animal image
	// stop and clear the timer
	// calculate and display the points
	// on click of the last animal image prompt twitter share and restart button
	$('.animal').on('click', function () {
		window.clearInterval(hounds.countdown);
		$(".feedback .incorrect").remove();
		var newPoints = 100 - 2 * seconds;
		if (counter < 1) {
			hounds.game.score = hounds.game.score + newPoints;
		}
		$(this).children('.feedback').addClass('jsFadeInAnimation');
		$('.imageItem img, .animal img').addClass('jsFastAnimation');
		$(this).children('.feedback').append("<h2 class='correct'> Correct, " + newPoints + " points. </h2>");
		$(".pointsContainer .pointsValue").text(hounds.game.score);
		counter = counter + 1;
		$('.modalBackground').fadeIn();
		setTimeout(function () {
			if (hounds.game.level <= 6) {
				$('.next').show();
			} else {
				$('.next, .begin').hide();
				$('.restart').show();
				$('.share').addClass('jsFlexShow');
				$('.points').text(hounds.game.score);
				var tweet = 'https://twitter.com/intent/tweet?text=I got ' + hounds.game.score + ' points! Try Hidden hounds yourself at  www.leandrasilver.com/hiddenHounds %23hiddenhounds';
				document.getElementById("twitter-button").setAttribute("href", tweet);
			}
		}, 1200);
	});

	// On click of anything other then an animal image 
	// calculate and display the points 
	$('.imageItem').on('click', function () {
		$(".feedback .incorrect").remove();
		$(this).children('.feedback').append("<h2 class='incorrect'> -25 points </h2>");
		$(this).children('.feedback').addClass('jsFadeInAnimation');
		hounds.game.score = hounds.game.score - 25;
		if (hounds.game.score < 0) {
			hounds.game.score = 0;
		}
		$(".pointsContainer .pointsValue").text(hounds.game.score);
	});
};

// On click of the animal, increase the level and refresh the images and carry over the score


hounds.init = function () {

	// on start load the images on the screen
	hounds.imagePlaceHolders();

	// On click of the begin button randomize the images and hide the modal
	$('.begin').on('click', function () {
		hounds.randomizeImages('muffin', 'cha');
		// hide the modalbackrgound but also change it's color for later on in the game
		$('.modalBackground').hide().css('background', 'rgba(0,0,0,0.6)');
		hounds.events(hounds.game.score, hounds.game.level);
		$('.begin').hide();
	});

	// On click of the next button increase level
	// run the random image function as well as the events function
	$('.next').on('click', function () {
		$('.modalBackground').hide();
		hounds.randomizeImages('icecream', 'kitten');
		hounds.events(hounds.game.score, hounds.game.level);
		hounds.game.level = hounds.game.level + 1;
		$(".levelContainer .level").text(hounds.game.level);
	});

	$('.restart').on('click', function () {
		location.reload();
	});
};

$(function () {

	// preloader code
	$(window).load(function () {
		setTimeout(function () {
			$('.preloader').fadeOut('slow', function () {});
		}, 700);
	});

	$('.instructionsButton').on('click', function () {
		$('.instructions').toggleClass('jsShow');
	});

	hounds.init();

	// SmoothScroll on anchor tags
	$('a').smoothScroll();

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyD1B5xKrUj01CIGLwmEzY8-_ksbGs8Ah9A",
		authDomain: "hidden-hounds.firebaseapp.com",
		databaseURL: "https://hidden-hounds.firebaseio.com",
		storageBucket: "hidden-hounds.appspot.com",
		messagingSenderId: "292106244054"
	};

	firebase.initializeApp(config);
});