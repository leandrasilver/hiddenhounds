'use strict';

// Main JS

// Single global object
var hounds = {};

// Empty array for random numbers to be pushed into
hounds.uniqueRandoms = [];

// Make a unique random number that doesn't repeat between 1 and 16
hounds.makeUniqueRandom = function(){
	if (!hounds.uniqueRandoms.length) {
		for ( var i = 1; i <= 16; i++) {
			hounds.uniqueRandoms.push(i);
		}
	}
	var index = Math.floor(Math.random()* hounds.uniqueRandoms.length );
	var val = hounds.uniqueRandoms[index];
	hounds.uniqueRandoms.splice(index,1);
	return val;
};

// Images for the begin screen
hounds.imagePlaceHolders = function(){
	// Make a call to the unsplash api to get 16 random images
	$.ajax({
		url: 'https://api.unsplash.com/photos/random/?client_id=96d765e7378978f9e9c06ee63116a6edb729ac3e912fe048dd7567d859339850',
		dataType: 'json',
		method: 'GET',
		data: {
			query: 'dog',
			w:150,
			h:150,
			count:16,
		}
	// then loop through the array and put the urls in the list items
	}).then(function (res) {
		var onlyTheUrls = res.map(function(res){
			return res.urls.custom;
		});
		onlyTheUrls.forEach(function(value){
			$(".container ul").append("<li class='imageItem starterLi'><img src="+value+" alt='A random dog image'></li>");
		});
		$('.begin').show();
		$('.modalBackground').fadeIn();
	});
}

// Randomize the images that appear on screen
hounds.randomizeImages = function (food, animal) {
	$('.imageItem, .animal').remove();
	for ( var i = 0; i < 16; i++) {
		var randomNumber= hounds.makeUniqueRandom();
		$(".container ul").append("<li class='imageItem imageItem"+randomNumber+"'><img src='../../images/"+food+"/"+food+""+randomNumber+".jpg' alt='A tasty chocolate chip muffin that looks slightly like a dog'><div class='feedback'></div></li>");
	};
	var randomNumber= hounds.makeUniqueRandom();
	$('.imageItem'+randomNumber).replaceWith("<li class='animal'><img src='../../images/"+food+"/"+animal+".jpg' alt='A puppy that resembles a yummy chocolate chip muffin'><div class='feedback'></div></li>");
	// make sure to remove the added class of a fast animation as nothing was clicked yet by the user.
	$('.imageItem img, .animal img').removeClass('fastAnimation');
};

// Events on click of list items
hounds.events = function (score, level){
	var seconds = 1;
	hounds.countdown = window.setInterval(function() {
		// Update the span text with the number of seconds
		$('.secondsLeft').text(seconds);

		// Increase the number of seconds by 1 
		seconds = seconds + 1; // or seconds;

		// Stop the timer if it lasts over 50 seconds
		if (seconds>=50) {
			$('.timer').text("Timed Out, Try again!");
			clearInterval(hounds.countdown);
			setTimeout(function(){ 
				$('.begin, .next').hide();
				$('.restart').show();
				$('.modalBackground').fadeIn();
				$('.restart').on('click', function(){
					location.reload();
				});
			}, 500);
		}
	},1000);

	var counter = 0;

	$('.animal').mouseup(function(){
		window.clearInterval(hounds.countdown);
		$(".feedback .correct, .feedback .incorrect").remove();
		$(this).children('.feedback').append("<h2 class='correct'> Correct, that only took "+(seconds-1)+"s.</h2>");
		$('.imageItem img, .animal img').addClass('fastAnimation');
		if (counter<1) {	
			score = score+(100 - (2*seconds));
		}
		$(".pointsContainer .pointsValue").text(score);
		counter = counter+1;
		setTimeout(function(){ 
			$('.begin').hide();
			$('.next').show();
			$('.modalBackground').fadeIn();
		}, 500);
	});

	$('.imageItem').on('click',  function(){
		$(".feedback .incorrect").remove();
		$(this).children('.feedback').append("<h2 class='incorrect'> Incorrect! -25 points </h2>");
		$(this).children('.feedback').addClass('fadeInAnimation');
		score = score-25;
		if ( score < 0) {
			score = 0;
		}
		$(".pointsContainer .pointsValue").text(score);
	});
};

// On click of the animal, increase the level and refresh the images and carry over the score


hounds.init = function () {

	var score = 0;
	var level = 1;

	// on start load the images on the screen
	hounds.imagePlaceHolders();

	// On click of the begin button randomize the images and hide the modal
	$('.begin').on('click', function(){
		hounds.randomizeImages('muffin','cha');
		// hide the modalbackrgound but also change it's color for later on in the game
		$('.modalBackground').hide().css('background', 'rgba(0,0,0,0.6)');
		hounds.events(score, level);
	});

	$('.next').on('click', function(){
		$('.modalBackground').hide();
		hounds.randomizeImages('icecream','kitten');
		hounds.events(score, level);
		level=level+1;
		$(".levelContainer .level").text(level);
	});
};

$(function () {

	// preloader code
	$(window).load(function () {
		setTimeout(function(){
		$('.preloader').fadeOut('slow',function(){
		});
		},3000); 
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