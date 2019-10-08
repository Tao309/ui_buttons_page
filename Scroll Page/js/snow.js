for (var i = 1; i < 8; i++) {
	twinkleLoop(i);
};

function twinkleLoop(i) {
	var speed = 400;
	var duration = ((Math.random() * 5) + 4)
	duration = duration - ((495 - speed)/100)
	twinkle(i, duration)
	setTimeout(function() {
		twinkleLoop(i)
	}, duration * 1000);
};

function twinkle(id, duration) {
	var top = (Math.floor(Math.random() * 85) + 0) + '%';
	var left = (Math.floor(Math.random() * 85) + 0) + '%';

	$('#speck' + id).remove();
	$('#specks').append("<div class='speck' id='speck" + id + "'></div>")
	$('#speck' + id).css({
		'top': top,
		'left': left,
		'animation-duration': duration + 's',
		'-o-animation-duration': duration + 's',
		'-moz-animation-duration': duration + 's',
		'-webkit-animation-duration': duration + 's',
		'-ms-animation-duration': duration + 's',
	});
};
