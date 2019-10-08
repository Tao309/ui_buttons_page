$.fn.swipe = function(options,callback) {
var config = {
		min_x: 20, //минимальный свайп по горизонтали для элемента
		max_x: 40, //максимальный свайп по горизонтали для элемента
		min_y: 20, //минимальный свайп по вертикали для элемента
		max_y: 40, //максимальный свайп по вертикали для элемента
		swipeLeft: function(length) { },//обработка если свайп влево
		swipeRight: function(length) { },//обработка если свайп вправо
		swipeUp: function(length) { },//обработка если свайп вверх
		swipeDown: function(length) { },//обработка если свайп вниз
		swipeMove: function(event,lengthX,lengthY) { },//при движении свайпа
		swipeEnd: function(event,lengthX,lengthY) { },//при окончании свайпа
		swipeStart: function(event) { },//при окончании свайпа
	},
	options = $.extend(config, options);
	
	var sw = {};
	sw.sX = 0;
	sw.sY = 0;
	sw.eX = 0;
	sw.eY = 0;
	
var touchDown = false,//нажата ли кнопка мыши или палец на экране
	pos = null,
	direction = "",
	length = "0";
	
	var el = $(this);
	if(!el.length) {return;}
	
	var getPointerEvent = function(event) {
        return event.targetTouches ? event.targetTouches[0] : event;
    };
	var setListener = function (elm,events,callback) {
        var eventsArray = events.split(' '),
            i = eventsArray.length;
        while(i--){
            elm.addEventListener( eventsArray[i], callback, false );
        }
    };
	var prevent = function(e) {
		e.preventDefault();
		//console.log(e.target);
	};
	var startEl;
	
	setListener(el[0],"touchstart mousedown", function (e) {//mousedown
		if(event.type == "mousedown") {
			startEl = e.target;
		}
		e.preventDefault();
		touchDown = true;
		//var t = e.touches[0];
		var t = getPointerEvent(e);
		sw.sX = t.screenX;
		sw.sY = t.screenY;
		//console.log("Начало: "+sw.sX+":"+sw.sY);
		config.swipeStart(e);
	},false);
	setListener(el[0],"touchmove mousemove", function (e) {//mousemove
		if(!touchDown) {return false;}
		var t = getPointerEvent(e);
		sw.eX = t.screenX; 
		sw.eY = t.screenY;  
		//console.log("Конец "+sw.eX+":"+sw.eY);
		var lengthX = sw.sX-sw.eX;
		var lengthY = sw.sY-sw.eY;
		
		//if(lengthX>options.min_x || lengthY>options.min_y) {
		if(lengthX!=0 || lengthY!=0) {
			config.swipeMove(e,lengthX,lengthY);
			if(event.type == "mousemove") {
				startEl.addEventListener('click', prevent, false);
			}
		}
	},false);
	setListener(el[0],"touchend touchcancel mouseup", function (e) {//mouseup
		if(!touchDown) {return false;}
		e.preventDefault();
		touchDown = false;
		if(event.type == "mouseup" && startEl) {
			if(startEl == e.target) {
				setTimeout(function() {
					e.target.removeEventListener('click', prevent, false);
				},1);
			} else {
				startEl.removeEventListener('click', prevent, false);
			}
		}
		
		//Определение по горизонтали
		if ((((sw.eX - options.min_x > sw.sX) || (sw.eX + options.min_x < sw.sX)) && ((sw.eY < sw.sY + options.max_y) && (sw.sY > sw.eY - options.max_y)))) {
			if(sw.eX!=0) {
				if(sw.eX > sw.sX) {
					direction = "right"; 
					length = sw.eX - sw.sX;
					config.swipeRight(length);
				} else {
					direction = "left";
					length = sw.sX - sw.eX;
					config.swipeLeft(length);
				}
			}
		}
		//Определение по вертикали
		if ((((sw.eY - options.min_y > sw.sY) || (sw.eY + options.min_y < sw.sY)) && ((sw.eX < sw.sX + options.max_x) && (sw.sX > sw.eX - options.max_x)))) {
			if(sw.eY!=0) {
				if(sw.eY > sw.sY) {
					direction = "down";
					length = sw.eY - sw.sY;
					config.swipeDown(length);
				} else {
					direction = "up";
					length = sw.sY - sw.eY;
					config.swipeUp(length);
				}
			}
		}
		
		//console.log("Направление: "+direction+", на расстояние "+length+" px");
		if (direction != "") {
			if(typeof callback == 'function') callback(el,direction,length);
		}
		config.swipeEnd(e,sw.sX-sw.eX,sw.sY-sw.eY);
		startEl = direction = "";
		sw = {};
	},false);
};