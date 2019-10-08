$(document).ready(function() {

	$(".tfl_nm-button.action-circle").on('click touchstart',function(e) {
		var $this = $(this);
		if($this.hasClass('click')) {$this.removeClass('click');}
		
		if($this.hasClass('circle-pos')) {
			$this.find(">span").remove();
			var left = $this.offset().left;
			var top = $this.offset().top;
			
			$("<span/>").css({
				'left': (e.pageX-left)+'px',
				'top': (e.pageY-top)+'px',
			}).prependTo($this);
			
			//$this.prepend('span');
		}
		
		setTimeout(function() {$this.addClass('click');},10);
	});

});