'use strict';

// Main JS

// immediately-invoked function expression needed doesn't populate the global namespace
// also makes my variables inside the function inaccessible to the global namespace
// prevents score value to be manipulated for example

(function () {

	var game = {
		stats: {
			level: 1,
			score: 0
		},
		levelPhotos: [{
			food: 'cookies',
			animal: 'dal'
		}, {
			food: 'bagel',
			animal: 'puppy'
		}, {
			food: 'chicken',
			animal: 'doodle'
		}, {
			food: 'icecream',
			animal: 'kitten'
		}]
	};

	game.uniqueRandoms = [];
	// Make a unique random number that doesn't repeat between 1 and 16
	// Then use this function to display the images
	game.makeUniqueRandom = function () {
		if (!game.uniqueRandoms.length) {
			for (var i = 1; i <= 16; i++) {
				game.uniqueRandoms.push(i);
			}
		}
		var index = Math.floor(Math.random() * game.uniqueRandoms.length);
		var val = game.uniqueRandoms[index];
		game.uniqueRandoms.splice(index, 1);
		return val;
	};

	// Images for the landing page screen
	game.displayImagePlaceHolders = function () {
		// Make a call to the unsplash api to get 16 random images
		var unsplashUrl = 'https://api.unsplash.com/photos/random/?client_id=96d765e7378978f9e9c06ee63116a6edb729ac3e912fe048dd7567d859339850';
		$.ajax({
			url: unsplashUrl,
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
		}).fail(function () {
			// Display backup images from the first level
			for (var i = 0; i < 16; i++) {
				var randomNumber = game.makeUniqueRandom();
				$(".container ul").append("<li class='imageItem imageItem" + randomNumber + "'><img src='images/muffin/muffin" + randomNumber + ".jpg' alt='A food item that resembles an animal'></li>");
			};
			$('.begin').show();
			$('.modalBackground').fadeIn();
		});
	}; // end of ajax call to unsplash

	// Randomize the images that appear on screen
	game.randomizeImages = function (food, animal) {
		// Clear the empty array
		game.uniqueRandoms = [];
		$('.imageItem, .animal').remove();
		// Then generate a unique random number 16 times and append li
		for (var i = 0; i < 16; i++) {
			var randomNumber = game.makeUniqueRandom();
			$(".container ul").append("<li class='imageItem imageItem" + randomNumber + "'><img src='images/" + food + "/" + food + "" + randomNumber + ".jpg' alt='A food item that resembles an animal'><div class='feedback'></div></li>");
		};
		randomNumber = game.makeUniqueRandom();
		var animalNum = Math.floor(Math.random() * 3) + 1;
		$('.imageItem' + randomNumber).replaceWith("<li class='animal'><img src='images/" + food + "/" + animal + "" + animalNum + ".jpg' alt='A animal'><div class='feedback'></div></li>");
		// make sure to remove the added class of a fast animation as nothing was clicked yet by the user.
		$('.imageItem img, .animal img').removeClass('jsFastAnimation');
	}; //end of randomized images function

	// Events on click of list items
	game.events = function () {
		var seconds = 1;
		game.countdown = window.setInterval(function () {
			// Update the span text with the number of seconds
			$('.secondsLeft').text(seconds);
			// Increase the number of seconds by 1 
			seconds = seconds + 1; // or seconds;
			// Stop the timer if it lasts over 50 seconds
			if (seconds >= 50) {
				clearInterval(game.countdown);
				$('.countUp').remove();
				$('.timer').append('<p>Time is out!</p>');
				setTimeout(function () {
					$('.begin, .next, .share h2, .share a').hide();
					$('.restart, .share').show();
					$('.modalBackground').fadeIn();
				}, 500);
			}
		}, 1000);

		// Need a counter so that the user doesn't press the animal multiple times to get a tonne of points
		var counter = 0;

		// On click of the animal image
		// stop and clear the timer
		// calculate and display the points
		// on click of the last animal image prompt twitter share and restart button
		$('.animal').on('click', function () {
			window.clearInterval(game.countdown);
			$(".feedback .incorrect").remove();
			var newPoints = 100 - 2 * seconds;
			if (counter < 1) {
				game.stats.score = game.stats.score + newPoints;
			}
			$(this).children('.feedback').addClass('jsFadeInAnimation');
			$('.imageItem img, .animal img').addClass('jsFastAnimation');
			$(this).children('.feedback').append("<h2 class='correct'> Correct, " + newPoints + " points. </h2>");
			$(".pointsContainer .pointsValue").text(game.stats.score);
			counter = counter + 1;
			$('.modalBackground').fadeIn();
			setTimeout(function () {
				if (game.stats.level <= 4) {
					$('.next').show();
				} else {
					$('.next, .begin').hide();
					$('.restart').show();
					$('.share').addClass('jsFlexShow');
					$('.points').text(game.stats.score);
					var tweet = 'https://twitter.com/intent/tweet?text=I got ' + game.stats.score + ' points! Try Hidden game yourself at  www.leandrasilver.com/hiddengame %23hiddengame';
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
			var diminishPointsValue = 25;
			game.stats.score = game.stats.score - diminishPointsValue;
			$(".pointsContainer .pointsValue").text(game.stats.score);
		});
	}; // end of events

	// On click of the animal, increase the level and refresh the images and carry over the score


	game.init = function () {
		// on start load the images on the screen
		game.displayImagePlaceHolders();

		// On click of the begin button randomize the images and hide the modal
		$('.begin').on('click', function () {
			game.randomizeImages('muffin', 'cha');
			// hide the modalbackrgound but also change it's color for later on in the stats
			$('.modalBackground').hide().css('background', 'rgba(0,0,0,0.6)');
			game.events(game.stats.score, game.stats.level);
			$('.begin').hide();
		});

		// On click of the next button increase level
		// run the random image function as well as the events function
		var index = 0;
		$('.next').on('click', function () {
			$('.modalBackground').hide();
			game.randomizeImages(game.levelPhotos[index].food, game.levelPhotos[index].animal);
			game.events(game.stats.score, game.stats.level);
			game.stats.level = game.stats.level + 1;
			$(".levelContainer .level").text(game.stats.level);
			index = index + 1;
		});

		$('.restart').on('click', function () {
			location.reload();
		});
	}; // end of init

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

		game.init();

		// SmoothScroll on anchor tags
		$('a').smoothScroll();

		// Next steps: Initialize Firebase
		// var config = {
		// 	apiKey: "AIzaSyD1B5xKrUj01CIGLwmEzY8-_ksbGs8Ah9A",
		// 	authDomain: "hidden-game.firebaseapp.com",
		// 	databaseURL: "https://hidden-game.firebaseio.com",
		// 	storageBucket: "hidden-game.appspot.com",
		// 	messagingSenderId: "292106244054"
		// };

		// firebase.initializeApp(config);
	}); //end doc ready
})(); //end of IIFE