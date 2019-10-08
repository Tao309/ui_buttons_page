$(document).ready(function() {
	$('.menu_button').on('click',function() {
		if($(this).hasClass('click')) {
			$(this).removeClass('click');
		} else {
			$(this).addClass('click');
		}
	});

});